"use client";

import { Button } from "@/components/ui/button";
import { CircleFadingArrowUp } from "lucide-react";

export function GenerateTailoredButton({ jobId: id }: { jobId: string }) {
  async function handleGenerateTailored() {
    const tailored = await fetch(`http://localhost:8080/jobs/${id}/tailor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    console.log(tailored);
  }

  return (
    <Button
      className="mt-4 w-fit"
      variant="outline"
      size="sm"
      onClick={handleGenerateTailored}
    >
      <CircleFadingArrowUp className="size-4 mr-2" />
      Gerar currículo otimizado
    </Button>
  );
}
