// lib/parseTemplate.ts

import createDOMPurify from "dompurify";

export function parseTemplate(htmlBody: string) {
  if (!htmlBody) return "";

  let decoded = htmlBody;

  // 🔓 Decode entities
  decoded = decoded
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // 🧹 Clean breaks
  decoded = decoded.replace(/\\r/g, "");
  decoded = decoded.replace(/<br\s*\/?>/gi, "<br/>");

  // ❌ Remove styles
  decoded = decoded.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");

  // 🔁 Replace placeholders
  decoded = decoded
    .replace(/{!Contact\.FirstName}/g, "John")
    .replace(/{!User\.FirstName}/g, "Support Agent")
    .replace(/{!Case\.CaseNumber}/g, "123456");

  // ✅ Create DOMPurify safely in browser
  let clean = decoded;

  if (typeof window !== "undefined") {
    const DOMPurify = createDOMPurify(window);
    clean = DOMPurify.sanitize(decoded);
  }

  return clean;
}