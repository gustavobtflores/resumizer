"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkle } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const labels = {
  "pt-BR": "🇧🇷 Português",
  "en-US": "🇺🇸 English",
  "es-ES": "🇪🇸 Español",
};

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
      <Select
        defaultValue={searchParams.get("language")?.toString()}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-full" disabled={generatingLanguage}>
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder="Selecione o idioma" />
            {generatingLanguage && (
              <div className="flex items-center text-xl">
                <span className="animate-bounce ease-in-out w-1.5">.</span>
                <span className="animate-bounce delay-100 ease-in-out w-1.5">
                  .
                </span>
                <span className="animate-bounce delay-200 ease-in-out w-1.5">
                  .
                </span>
              </div>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          {(["pt-BR", "en-US", "es-ES"] as const).map((lang) => (
            <SelectItem key={lang} value={lang}>
              <span
                className="block"
                style={{ opacity: availableLanguages.includes(lang) ? 1 : 0.5 }}
              >
                {labels[lang]}
              </span>
              {!availableLanguages.includes(lang) && (
                <button
                  type="button"
                  className="pointer-events-auto opacity-100 absolute right-2 transition-all group"
                  onClick={() => console.log("Language not available")}
                >
                  <Sparkle className="text-muted-foreground group-hover:text-primary transition-colors " />
                </button>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
