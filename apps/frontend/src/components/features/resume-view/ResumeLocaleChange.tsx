"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ResumeLocaleChange() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  function handleLanguageChange(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("language", value);
    push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("language")?.toString()}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o idioma" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pt-BR">🇧🇷 Português</SelectItem>
        <SelectItem value="en-US">🇺🇸 Inglês</SelectItem>
        <SelectItem value="es-ES">🇪🇸 Espanhol</SelectItem>
      </SelectContent>
    </Select>
  );
}
