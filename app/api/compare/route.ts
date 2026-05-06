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
                matchScore: z.number().min(0).max(100),

                isCorrect: z.boolean(),

                breakdown: z.object({
                    structure: z.number().min(0).max(100),
                    wording: z.number().min(0).max(100),
                    logicFlow: z.number().min(0).max(100),
                    formatting: z.number().min(0).max(100),
                }),

                missingPoints: z.array(z.string()),
                extraPoints: z.array(z.string()),

                spellingGrammar: z.array(z.string()).describe("List of grammar/spelling issues"),

                similaritySummary: z.string(),

                verdict: z.string().describe("Final conclusion like HIGH / MEDIUM / LOW similarity with reasoning"),
            })
        );

        const formatInstructions = parser.getFormatInstructions();

        // 🧠 Prompt
        const prompt = new PromptTemplate({
            template: `
                You are an expert AI evaluation system.
                        
                Your job is to compare a TEMPLATE RESPONSE and a USER RESPONSE.
                        
                You must evaluate similarity in a structured, analytical way.
                        
                ## IMPORTANT EVALUATION DIMENSIONS:
                        
                1. Structure (0–100)
                - Same sections, order, flow
                        
                2. Wording (0–100)
                - Similar phrasing and sentence construction
                        
                3. Logic Flow (0–100)
                - Same reasoning steps and progression
                        
                4. Formatting (0–100)
                - HTML vs plain text, lists, styling, layout similarity
                        
                ## ALSO IDENTIFY:
                - Missing points (present in template, missing in user response)
                - Extra points (present in user response but not template)
                - Spelling/grammar issues
                        
                ## FINAL OUTPUT RULES:
                - Provide strict JSON only
                - Be precise and consistent
                - Do NOT include explanations outside JSON
                        
                TEMPLATE RESPONSE:
                {template}
                        
                USER RESPONSE:
                {response}
                        
                {format_instructions}
                `,
            inputVariables: ["template", "response"],
            partialVariables: { format_instructions: formatInstructions },
        });

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