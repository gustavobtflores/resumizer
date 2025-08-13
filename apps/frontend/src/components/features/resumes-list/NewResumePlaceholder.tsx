import { FilePlus } from "lucide-react";
import Link from "next/link";

export function NewResumePlaceholder() {
  return (
    <li className="w-[200px] h-[300px] border-2 border-accent-foreground/20 border-dashed rounded-lg hover:border-accent-foreground/50 transition-all duration-200 group">
      <Link
        href="/resumes/new"
        className="text-muted-foreground w-full h-full flex flex-col gap-2 items-center justify-center"
      >
        <FilePlus
          className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200"
          size={60}
          strokeWidth={1}
        />
        <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200">
          Adicionar currículo
        </span>
      </Link>
    </li>
  );
}
