"use client";

import { useState } from "react";
import ResponseInput from "@/components/evaluator/response-input";
import TemplateSelector from "@/components/evaluator/template-selector";
import TemplatePreview from "@/components/evaluator/template-preview";
import CompareButton from "@/components/evaluator/compare-button";
import { parseTemplate } from "@/lib/parseTemplate";
import ComparisonPanel from "@/components/evaluator/comparison-panel";

export default function Home() {

  const [parsedTemplate, setParsedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [comparison, setComparison] = useState<any>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const handleTemplateSelect = async ({
    name,
  }: {
    name: string;
  }) => {

    setLoading(true);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateName: name,
        }),
      });

      const data = await res.json();

      const parsed = parseTemplate(data.htmlBody);

      setParsedTemplate(parsed);
    } catch (err) {
      console.error("Error fetching template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareButton = async () => {
    if (!userInput) {
      alert("Please enter bot response");
      return;
    }

    if (!parsedTemplate) {
      alert("Please select a template");
      return;
    }

    setCompareLoading(true);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: userInput,
          template: parsedTemplate,
        }),
      });

      const data = await res.json();

      setComparison(data?.result || null);
    } catch (error) {
      console.error("Error comparing:", error);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold">GenAI Evaluation Tool</h1>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* LEFT */}
        {/* LEFT */}
        <div className="flex flex-col gap-4 h-full overflow-auto">

          {/* Comparison Panel */}
          <div className="max-h-65 overflow-auto">
            <ComparisonPanel data={comparison} />
          </div>

          {/* Compare Button (Moved Here) */}
          <CompareButton
            handleCompareButton={handleCompareButton}
            loading={compareLoading}
          />

          {/* Input */}
          <div className="max-h-80 overflow-auto">
            <ResponseInput
              handleOnChangeUserInput={setUserInput}
              value={userInput}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4 h-full overflow-auto">
          <TemplateSelector
            onSelect={handleTemplateSelect}
            loading={loading}
          />

          <div className="max-h-96 overflow-auto">
            <TemplatePreview
              template={parsedTemplate}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}