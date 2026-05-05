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
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600";

  return (
    <div className="border rounded-xl p-4 bg-muted/20 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Evaluation Result</h2>

        <div className="text-right">
          <div className={`text-3xl font-bold ${scoreColor}`}>
            {data.matchScore}%
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}
          >
            {data.isCorrect ? "Correct" : "Needs Improvement"}
          </span>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-background border rounded-lg p-3">
        <h3 className="font-semibold mb-1">Feedback</h3>

        {data.feedback ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.feedback}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No feedback available
          </p>
        )}
      </div>

      {/* Missing Points */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <h3 className="font-semibold text-red-600 mb-2">
          Missing Points
        </h3>

        {data.missingPoints?.length > 0 ? (
          <ul className="list-disc ml-5 text-sm space-y-1 text-red-700">
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

      {/* Extra Points */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-semibold text-blue-600 mb-2">
          Extra Points
        </h3>

        {data.extraPoints?.length > 0 ? (
          <ul className="list-disc ml-5 text-sm space-y-1 text-blue-700">
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
    </div>
  );
}