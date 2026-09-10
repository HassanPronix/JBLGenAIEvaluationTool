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

function cleanHtml(htmlBody: string) {
    if (!htmlBody || typeof htmlBody !== "string") {
        return "";
    }

    let html = htmlBody;

    // 1. Decode HTML entities
    html = html
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&nbsp;/gi, " ");

    // 2. Remove <style>...</style> blocks
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

    // 3. Remove malformed/duplicate <br> tags
    //    <br>, <br/>, <br />
    //    Multiple consecutive ones become a single <br>
    html = html.replace(
        /(?:\s*<br\s*\/?>\s*)+/gi,
        "<br>"
    );

    // 4. Remove whitespace between HTML tags
    html = html.replace(/>\s+</g, "><");

    // 5. Normalize spaces around <br>
    html = html.replace(/\s*<br\s*\/?>\s*/gi, "<br>");

    // 6. Remove empty paragraphs
    html = html.replace(/<p\b[^>]*>\s*<\/p>/gi, "");

    // 7. Remove empty list items
    html = html.replace(/<li\b[^>]*>\s*<\/li>/gi, "");

    // 8. Remove unnecessary closing </li> at the end
    html = html.replace(/<\/li>\s*$/i, "");

    // 9. Remove leading/trailing <br>
    html = html.replace(/^(?:<br>)+/i, "");
    html = html.replace(/(?:<br>)+$/i, "");

    // 10. Normalize remaining whitespace
    html = html.replace(/[ \t]{2,}/g, " ");
    html = html.trim();

    return html;
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
            htmlBody: cleanHtml(r.htmlBody),
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