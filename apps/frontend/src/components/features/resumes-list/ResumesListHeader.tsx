import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

export function ResumesListHeader() {
  return (
    <div className="flex items-center justify-between pb-10 mb-10 border-b border-b-border">
      <div>
        <h1 className="text-2xl font-medium">Currículos</h1>
        <span className="text-muted-foreground">
          Crie, edite e visualize seus currículos.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/resumes/new">
          <Button className="cursor-pointer" size={"lg"}>
            <FilePlus2 />
            Adicionar currículo
          </Button>
        </Link>
      </div>
    </div>
  );
}
