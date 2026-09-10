import { NextResponse } from "next/server";

const FOLDERS = [
    "US Customer Facing - Battery",
    "US Customer Facing - Bluetooth",
    "US Customer Facing - Sound (HPs)",
    "US Customer Facing - Sound (Por)",
];

interface KoreRecord {
    CommonData: string;
    folderName: string;
    htmlBody: string;
    TName: string;
    TID: string;
    sys_Id: string;
    Created_On: string;
    Updated_On: string;
    Created_On_TimeStamp: number;
    Updated_On_TimeStamp: number;
    Created_By: string;
    Updated_By: string;
}

interface KoreQueryResponse {
    hasMore: boolean;
    total: number;
    queryResult: KoreRecord[];
}

export interface Template {
    TID: string;
    TName: string;
    folderName: string;
    htmlBody: string;
}

export async function POST() {
    try {
        const res = await fetch(
            "https://platform.kore.ai/api/public/tables/EmailTemplates/query?sys_limit=100&sys_offset=0",
            {
                method: "POST",
                headers: {
                    auth: process.env.KORE_AUTH_TOKEN || "",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query: {
                        expressions: FOLDERS.map((folderName) => ({
                            field: "folderName",
                            operand: "=",
                            value: folderName,
                        })),
                        operator: "or",
                    },
                }),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            console.error("Kore API error:", res.status, text);
            return NextResponse.json(
                { error: "Failed to fetch templates from Kore" },
                { status: res.status }
            );
        }

        const data: KoreQueryResponse = await res.json();

        const queryResult: Template[] = (data.queryResult ?? []).map((r) => ({
            TID: r.TID,
            TName: r.TName,
            folderName: r.folderName,
            htmlBody: r.htmlBody
        }));

        // console.log(templates)
        return NextResponse.json({ queryResult });

    } catch (err) {
        console.error("Error syncing templates:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}