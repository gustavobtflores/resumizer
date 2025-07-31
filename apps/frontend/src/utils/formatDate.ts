import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: string | null) {
  if (!date) return "Data inválida";

  return format(new Date(date), "MMM/yyyy", {
    locale: ptBR,
  });
}
