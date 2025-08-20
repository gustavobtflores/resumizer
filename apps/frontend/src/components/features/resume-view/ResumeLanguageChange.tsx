"use client";

import { LanguageSelect } from "@/components/LanguageSelect";
import { Label } from "@/components/ui/label";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function ResumeLanguageChange({
  resumeId,
  availableLanguages,
}: {
  resumeId: string;
  availableLanguages: ("pt-BR" | "en-US" | "es-ES")[];
}) {
  const [generatingLanguage, setGeneratingLanguage] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  async function handleLanguageChange(value: string) {
    if (!availableLanguages.includes(value as "pt-BR" | "en-US" | "es-ES")) {
      setGeneratingLanguage(true);
      await fetch(`http://localhost:8080/resumes/${resumeId}/translations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetLanguage: value }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        })
        .catch((error) => {
          console.error("Erro ao criar tradução do currículo:", error);
        })
        .finally(() => {
          setGeneratingLanguage(false);
        });
    }

    const params = new URLSearchParams(searchParams);

    params.set("language", value);
    push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Label className="mb-2">Idioma do currículo</Label>
      <LanguageSelect
        availableLanguages={availableLanguages}
        onLanguageChange={handleLanguageChange}
        isLoading={generatingLanguage}
      />
    </>
  );
}
