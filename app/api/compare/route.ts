import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
    try {
        const { response, template } = await req.json();

        if (!response || !template) {
            return NextResponse.json(
                { error: "Missing response or template" },
                { status: 400 }
            );
        }

        // 🧠 Define structured output schema
        const parser = StructuredOutputParser.fromZodSchema(
            z.object({
                matchScore: z.number().describe("Similarity score from 0 to 100"),
                isCorrect: z.boolean(),
                missingPoints: z.array(z.string()),
                extraPoints: z.array(z.string()),
                feedback: z.string(),
            })
        );

        const formatInstructions = parser.getFormatInstructions();

        // 🧠 Prompt
        const prompt = new PromptTemplate({
            template: `
You are an AI evaluator.

Compare the USER RESPONSE with the TEMPLATE RESPONSE.

Evaluate:
- correctness
- completeness
- missing points
- extra/unnecessary content
- similarity score (0-100)

TEMPLATE:
{template}

USER RESPONSE:
{response}

{format_instructions}
      `,
            inputVariables: ["template", "response"],
            partialVariables: { format_instructions: formatInstructions },
        });

        // 🤖 LLM
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
            apiKey: process.env.OPENAI_API_KEY,
        });

        const formattedPrompt = await prompt.format({
            template,
            response,
        });

        const result = await model.invoke(formattedPrompt);

        const parsed = await parser.parse(result.content as string);

        return NextResponse.json({
            success: true,
            result: parsed,
        });
    } catch (error: any) {
        console.error("Compare API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}