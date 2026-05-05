"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function TemplatePreview({ template, loading }: any) {
  return (
    <Card className="flex-1 overflow-auto bg-card border shadow-sm rounded-xl">
      <CardContent className="p-4">

        {/* Loading State */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !template && (
          <div className="text-sm text-muted-foreground text-center py-10">
            Select a template to preview it here
          </div>
        )}

        {/* Content */}
        {!loading && template && (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: template }}
          />
        )}
      </CardContent>
    </Card>
  );
}