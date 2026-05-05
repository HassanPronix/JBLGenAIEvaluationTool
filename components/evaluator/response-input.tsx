"use client";

import { Textarea } from "@/components/ui/textarea";

export default function ResponseInput({
  handleOnChangeUserInput,
  value,
}: any) {
  return (
    <div className="flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Bot Response Here</h2>
        <span className="text-xs text-muted-foreground">
          {value?.length || 0} chars
        </span>
      </div>

      {/* Textarea */}
      <Textarea
        value={value}
        onChange={(e) => handleOnChangeUserInput(e.target.value)}
        placeholder="Paste or type the bot response here..."
        className="flex-1 resize-none rounded-xl border bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40"
      />
    </div>
  );
}