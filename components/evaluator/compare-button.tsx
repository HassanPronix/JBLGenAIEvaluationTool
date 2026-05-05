"use client";

import { Button } from "@/components/ui/button";

export default function CompareButton({handleCompareButton}:any) {
  return (
    <Button className="w-[25vw]" onClick={handleCompareButton}>
      Compare Response
    </Button>
  );
}