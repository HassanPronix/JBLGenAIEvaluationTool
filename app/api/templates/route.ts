// app/api/templates/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateName } = body;


    // Request payload (modify based on your need)
    const requestData = {
      query: {
        expressions: [
          {
            field: "folderName",
            operand: "=",
            value: "US Customer Facing - Battery",
          },
          { "field": "folderName", "operand": "=", "value": "US Customer Facing - Sound (HPs)" },
          { "field": "folderName", "operand": "=", "value": "US Customer Facing - Sound (Por)" }
        ],
        operator: "or",
      },
    };

    const response = await axios.post(
      "https://platform.kore.ai/api/public/tables/SalesforceEmailTemplate/query?sys_limit=100&sys_offset=0",
      requestData,
      {
        headers: {
          auth: process.env.KORE_API_KEY as string,
          "content-type": "application/json",
        },
      }
    );

    const data = response.data;

    const templates = data?.queryResult || [];

    const template = templates.find(
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