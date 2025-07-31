import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: string | null) {
  if (!date) return "Data inválida";

  try {
    const [year, month] = date.split("-");

    const parsedDate = parse(`${year}-${month}`, "yyyy-MM", new Date());

    return format(parsedDate, "MMM/yyyy", {
      locale: ptBR,
    });
  } catch {
    return "Data inválida";
  }
}
