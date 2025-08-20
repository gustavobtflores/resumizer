"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/types/Language";
import { useSearchParams } from "next/navigation";

const labels: Record<Language, string> = {
  "pt-BR": "🇧🇷 Português",
  "en-US": "🇺🇸 English",
  "es-ES": "🇪🇸 Español",
};

export function LanguageSelect({
  name,
  disabled,
  isLoading,
  availableLanguages,
  onLanguageChange,
}: {
  name?: string;
  disabled?: boolean;
  isLoading: boolean;
  availableLanguages: Language[];
  onLanguageChange: (value: string) => void;
}) {
  const searchParams = useSearchParams();

  return (
    <>
      <Select
        name={name}
        defaultValue={searchParams.get("language")?.toString()}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger className="w-full" disabled={disabled || isLoading}>
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder="Selecione o idioma" />
            {isLoading && (
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
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
