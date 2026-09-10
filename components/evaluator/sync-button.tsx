"use client";


import { Button } from "@/components/ui/button";

export default function SyncButton({
  onSync,
  loading,
}: {
  onSync: () => void;
  loading: boolean;
}) {
  return (
    <Button
      onClick={onSync}
      disabled={loading}
      className="w-[10vw] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Syncing..." : "Sync Templates"}
    </Button>
  );
}