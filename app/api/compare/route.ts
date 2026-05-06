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
        matchScore: z
          .number()
          .min(0)
          .max(100)
          .describe("Similarity score from 0 to 100"),
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

Compare the USER RESPONSE with the TEMPLATE RESPONSE and return your evaluation strictly in JSON format.

Evaluation Criteria:
- Correctness: Whether the response is factually accurate compared to the template.
- Completeness: Whether all key points from the template are covered.
- Missing Points: Important details from the template that are absent in the user response.
- Extra Points: Any irrelevant or unnecessary information not present in the template.
- Spelling & Grammar: Identify spelling errors, grammatical mistakes, and clarity issues.
- Similarity Score (0–100): Overall similarity between the template and user response.

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