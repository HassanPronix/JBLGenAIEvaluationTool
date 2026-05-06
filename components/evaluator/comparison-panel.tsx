"use client";

export default function ComparisonPanel({ data }: any) {
  if (!data) return null;

  const scoreColor =
    data.matchScore >= 80
      ? "text-green-500"
      : data.matchScore >= 50
        ? "text-yellow-500"
        : "text-red-500";

  const badgeColor = data.isCorrect
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  const breakdown = data.breakdown || {};

  return (
    <div className="border rounded-xl p-5 bg-white shadow-md space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Evaluation Report</h2>
          <p className="text-xs text-gray-500">
            AI-powered similarity analysis
          </p>
        </div>

        <div className="text-right">
          <div className={`text-3xl font-bold ${scoreColor}`}>
            {data.matchScore}%
          </div>

          <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
            {data.isCorrect ? "Correct" : "Needs Improvement"}
          </span>
        </div>
      </div>

      {/* BREAKDOWN GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Structure", value: breakdown.structure },
          { label: "Wording", value: breakdown.wording },
          { label: "Logic Flow", value: breakdown.logicFlow },
          { label: "Formatting", value: breakdown.formatting },
        ].map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 bg-gray-50 text-center"
          >
            <div className="text-xs text-gray-500">{item.label}</div>
            <div className="text-lg font-semibold">
              {item.value ?? 0}%
            </div>
          </div>
        ))}
      </div>

      {/* VERDICT */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold mb-1">Final Verdict</h3>
        <p className="text-sm text-gray-700">
          {data.verdict || "No verdict available"}
        </p>
      </div>

      {/* SIMILARITY SUMMARY */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-1">Similarity Summary</h3>
        <p className="text-sm text-gray-600">
          {data.similaritySummary || "No summary available"}
        </p>
      </div>

      {/* MISSING POINTS */}
      <div className="border rounded-lg p-4 bg-red-50">
        <h3 className="font-semibold text-red-600 mb-2">
          Missing Points
        </h3>

        {data.missingPoints?.length ? (
          <ul className="list-disc ml-5 text-sm text-red-700 space-y-1">
            {data.missingPoints.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-red-400 italic">
            No missing points
          </p>
        )}
      </div>

      {/* EXTRA POINTS */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold text-blue-600 mb-2">
          Extra Points
        </h3>

        {data.extraPoints?.length ? (
          <ul className="list-disc ml-5 text-sm text-blue-700 space-y-1">
            {data.extraPoints.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-blue-400 italic">
            No extra points
          </p>
        )}
      </div>

      {/* SPELLING & GRAMMAR */}
      <div className="border rounded-lg p-4 bg-yellow-50">
        <h3 className="font-semibold text-yellow-700 mb-2">
          Spelling & Grammar Issues
        </h3>

        {data.spellingGrammar?.length ? (
          <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
            {data.spellingGrammar.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-yellow-600 italic">
            No spelling or grammar issues found
          </p>
        )}
      </div>
    </div>
  );
}