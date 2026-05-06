// app/api/templates/route.ts

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateName } = body;


    const filePath = path.join(process.cwd(), "lib", "templates.json");

    const fileContent = await fs.readFile(filePath, "utf-8");
    const templates = JSON.parse(fileContent);

    const template = templates.queryResult.find(
      (item: any) => {


        if (item.TName === templateName) {
          return item
        }

      }
    );

    return NextResponse.json({
      success: true,
      htmlBody: template?.htmlBody || "",

    });

  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data || "Failed to fetch template",
      },
      { status: 500 }
    );
  }
}