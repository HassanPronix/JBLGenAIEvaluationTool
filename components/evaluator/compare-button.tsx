"use client";

import { Button } from "@/components/ui/button";

export default function CompareButton({ handleCompareButton, loading }: any) {
  return (
    <Button
      className="w-[25vw] flex items-center justify-center gap-2"
      onClick={handleCompareButton}
      disabled={loading}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {loading ? "Comparing..." : "Compare Response"}
    </Button>
  );
}