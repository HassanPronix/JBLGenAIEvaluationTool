import createDOMPurify from "dompurify";

function decodeHtmlEntities(html: string) {
  return html
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function formatLists(html: string) {
  return html
    .replace(
      /<ul\b[^>]*>/gi,
      '<ul style="margin: 8px 0 8px 20px; padding-left: 20px; list-style-type: disc;">'
    )
    .replace(
      /<ol\b[^>]*>/gi,
      '<ol style="margin: 8px 0 8px 20px; padding-left: 20px;">'
    )
    .replace(
      /<li\b[^>]*>/gi,
      '<li style="margin: 4px 0;">'
    );
}

function cleanNextStepHtml(html: string) {
  if (!html || typeof html !== "string") {
    return "";
  }

  let decoded = decodeHtmlEntities(html);

  // Remove CR/LF
  decoded = decoded.replace(/[\r\n]+/g, "");

  // Remove style blocks
  decoded = decoded.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // Remove Model name and color from claim checklist
  decoded = decoded.replace(
    /<li>\s*Model\s+name\s+and\s+color[^<]*(?=<li>|<\/ul>|$)/gi,
    ""
  );

  // Remove font/div tags
  decoded = decoded
    .replace(/<\/?font[^>]*>/gi, "")
    .replace(/<\/?div[^>]*>/gi, "");

  // Remove inline styles
  decoded = decoded.replace(
    /\s*style="[^"]*"/gi,
    ""
  );

  // Remove leading <br> inside elements
  decoded = decoded.replace(
    /<(ul|ol|p|b|u|li|i)>\s*(<br\s*\/?>\s*)+/gi,
    "<$1>"
  );

  // Remove trailing <br> before closing elements
  decoded = decoded.replace(
    /(<br\s*\/?>\s*)+<\/(p|b|u|li|ul|ol|i)>/gi,
    "</$2>"
  );

  // Close consecutive <li> elements
  decoded = decoded.replace(
    /<li>(.*?)(?=<li>)/gi,
    "<li>$1</li>"
  );

  // Remove stray </li> after list opening
  decoded = decoded.replace(
    /<(ol|ul)([^>]*)>\s*<\/li>\s*/gi,
    "<$1$2>"
  );

  // Remove empty elements
  decoded = decoded
    .replace(/<li>\s*<\/li>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "");

  // Remove doubled <p>
  decoded = decoded.replace(
    /<p>\s*<p>/gi,
    "<p>"
  );

  // Fix incorrect nesting
  decoded = decoded.replace(
    /<\/b>\s*<\/u>/gi,
    "</u></b>"
  );

  // Remove whitespace after <li>
  decoded = decoded.replace(
    /<li>\s+/gi,
    "<li>"
  );

  // Convert bold markers
  decoded = decoded
    .replace(/%%B_START%%/g, "<b>")
    .replace(/%%B_END%%/g, "</b>");

  // Bold Next Steps
  decoded = decoded.replace(
    /(?<!<b>)(?<!<u>)(Next Steps:)(?!<\/b>)/gi,
    "<b>$1</b>"
  );

  // Bold Note
  decoded = decoded.replace(
    /(?<!<b>)(Note:)(?!<\/b>)/gi,
    "<b>$1</b>"
  );

  // Multiple <br> -> ONE <br>
  decoded = decoded.replace(
    /(?:\s*<br\s*\/?>\s*){2,}/gi,
    "<br>"
  );

  // Normalize all BR variants
  decoded = decoded.replace(
    /<br\s*\/?>/gi,
    "<br/>"
  );

  // Remove whitespace between tags
  decoded = decoded.replace(
    />\s+</g,
    "><"
  );

  // Remove leading/trailing BR
  decoded = decoded
    .replace(
      /^(?:\s*<br\/>)+\s*/i,
      ""
    )
    .replace(
      /(?:\s*<br\/>)+\s*$/i,
      ""
    );

  decoded = formatLists(decoded);
  return decoded.trim();
}

function cleanHtml(htmlBody: string, nextStepHtml?: string) {
  if (!htmlBody || typeof htmlBody !== "string") {
    return "";
  }

  let decoded = decodeHtmlEntities(htmlBody);

  // --------------------------------------------------
  // Inject Next Steps BEFORE the final cleanup
  // --------------------------------------------------
  if (nextStepHtml) {
    const cleanedNextStep = cleanNextStepHtml(nextStepHtml);

    decoded = decoded.replace(
      /\[insert\s+appropriate\s+NEXT\s+STEPS\s+template\s+here\]/gi,
      cleanedNextStep
    );
  }

  // --------------------------------------------------
  // Remove CR/LF
  // --------------------------------------------------
  decoded = decoded.replace(/[\r\n]+/g, "");

  // --------------------------------------------------
  // Remove style blocks
  // --------------------------------------------------
  decoded = decoded.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );

  // --------------------------------------------------
  // Remove font/div tags
  // --------------------------------------------------
  decoded = decoded
    .replace(/<\/?font[^>]*>/gi, "")
    .replace(/<\/?div[^>]*>/gi, "");

  // --------------------------------------------------
  // Remove inline styles
  // --------------------------------------------------
  decoded = decoded.replace(
    /\s*style="[^"]*"/gi,
    ""
  );

  // --------------------------------------------------
  // Remove leading BR inside elements
  // --------------------------------------------------
  decoded = decoded.replace(
    /<(ul|ol|p|b|u|li|i)>\s*(<br\s*\/?>\s*)+/gi,
    "<$1>"
  );

  // --------------------------------------------------
  // Remove trailing BR before closing elements
  // --------------------------------------------------
  decoded = decoded.replace(
    /(<br\s*\/?>\s*)+<\/(p|b|u|li|ul|ol|i)>/gi,
    "</$2>"
  );

  // --------------------------------------------------
  // Close consecutive LI elements
  // --------------------------------------------------
  decoded = decoded.replace(
    /<li>(.*?)(?=<li>)/gi,
    "<li>$1</li>"
  );

  // --------------------------------------------------
  // Remove stray </li>
  // --------------------------------------------------
  decoded = decoded.replace(
    /<(ol|ul)([^>]*)>\s*<\/li>\s*/gi,
    "<$1$2>"
  );

  // --------------------------------------------------
  // Remove empty elements
  // --------------------------------------------------
  decoded = decoded
    .replace(/<li>\s*<\/li>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "");

  // --------------------------------------------------
  // Remove doubled P
  // --------------------------------------------------
  decoded = decoded.replace(
    /<p>\s*<p>/gi,
    "<p>"
  );

  // --------------------------------------------------
  // Fix incorrect nesting
  // --------------------------------------------------
  decoded = decoded.replace(
    /<\/b>\s*<\/u>/gi,
    "</u></b>"
  );

  // --------------------------------------------------
  // Remove whitespace after LI
  // --------------------------------------------------
  decoded = decoded.replace(
    /<li>\s+/gi,
    "<li>"
  );

  // --------------------------------------------------
  // Convert bold markers
  // --------------------------------------------------
  decoded = decoded
    .replace(/%%B_START%%/g, "<b>")
    .replace(/%%B_END%%/g, "</b>");

  // --------------------------------------------------
  // Bold Next Steps / Note
  // --------------------------------------------------
  decoded = decoded.replace(
    /(?<!<b>)(?<!<u>)(Next Steps:)(?!<\/b>)/gi,
    "<b>$1</b>"
  );

  decoded = decoded.replace(
    /(?<!<b>)(Note:)(?!<\/b>)/gi,
    "<b>$1</b>"
  );

  // --------------------------------------------------
  // Multiple BR -> ONE
  // --------------------------------------------------
  decoded = decoded.replace(
    /(?:\s*<br\s*\/?>\s*){2,}/gi,
    "<br/>"
  );

  // --------------------------------------------------
  // Normalize BR
  // --------------------------------------------------
  decoded = decoded.replace(
    /<br\s*\/?>/gi,
    "<br/>"
  );

  // --------------------------------------------------
  // Remove whitespace between tags
  // --------------------------------------------------
  decoded = decoded.replace(
    />\s+</g,
    "><"
  );

  // --------------------------------------------------
  // Remove leading/trailing BR
  // --------------------------------------------------
  decoded = decoded
    .replace(
      /^(?:\s*<br\/>)+\s*/i,
      ""
    )
    .replace(
      /(?:\s*<br\/>)+\s*$/i,
      ""
    );

  decoded = formatLists(decoded);
  decoded = formatLinks(decoded);

  return decoded.trim();
}

function formatLinks(html: string) {
  return html.replace(
    /<a\b([^>]*)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi,
    (_match, before, href, after, text) => {
      return `${text.trim()}<br/><a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`;
    }
  );
}


export function parseTemplate(
  htmlBody: string,
) {

  const nextStepHtml = "&lt;style type=\"text/css\"&gt;\r\nbody,td,th {\r\n    font-family: verdana;\r\n    font-size: 12px;\r\n    color: #000000;\r\n}\r\n&lt;/style&gt;\r\n&lt;style type=\"text/css\"&gt;\r&lt;br&gt;\r\nbody,td,th {\r&lt;br&gt;\r\n    font-family: verdana;\r&lt;br&gt;\r\n    font-size: 12px;\r&lt;br&gt;\r\n    color: #000000;\r&lt;br&gt;\r\n}\r&lt;br&gt;\r\n&lt;/style&gt;\r&lt;br&gt;\r\n&lt;div style=\"border: 2px solid black;\"&gt;\r&lt;br&gt;\r\n&lt;p style=\"margin-left: 10px;\"&gt;\r&lt;br&gt;\r\n&lt;b&gt;&lt;u&gt;Next Steps: Warranty Validation&lt;/b&gt;&lt;/u&gt;\r&lt;br&gt;\r\n&lt;br&gt;\r&lt;br&gt;\r\n&lt;br&gt;\r&lt;br&gt;\r\nIf your unit is within the 1-year warranty period, please send the following to initiate a claim:\r&lt;br&gt;\r\n&lt;ul&gt;&lt;li&gt;Model name and color (or SKU)&lt;li&gt;A copy of the receipt showing the place of purchase as well as the date, item, and price&lt;li&gt;If you do not have proof of purchase, please include the serial number – this can be found &lt;p style=\"color: red\"&gt;&lt;font size =6&gt;[explain location here]&lt;/font color&gt;&lt;/font&gt;&lt;/p&gt;&lt;li&gt;Your shipping address (please note that we do not ship to POs or APOs)&lt;li&gt;Your phone number&lt;/li&gt;&lt;/ul&gt;\r&lt;br&gt;\r\n&lt;br&gt;\r&lt;br&gt;\r\n&lt;p style=\"margin-left: 10px;\"&gt;\r&lt;br&gt;\r\nOn the other hand, if your warranty has expired, please reply for further assistance.\r&lt;br&gt;\r\n&lt;/div&gt;"
  if (!htmlBody) return "";

  // Clean + inject Next Steps
  let decoded = cleanHtml(
    htmlBody,
    nextStepHtml
  );

  // Replace Salesforce placeholders
  decoded = decoded
    .replace(
      /{!Contact\.FirstName}/g,
      "John"
    )
    .replace(
      /{!User\.FirstName}/g,
      "Support Agent"
    )
    .replace(
      /{!Case\.CaseNumber}/g,
      "123456"
    );

  // Sanitize in browser when DOMPurify can use window
  let clean = decoded;

  if (typeof window !== "undefined") {
    const DOMPurify = createDOMPurify(window);
    clean = DOMPurify.sanitize(decoded);
  }

  return clean;
}
