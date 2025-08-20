import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

export function JobsListHeader() {
  return (
    <div className="flex items-center justify-between pb-10 mb-10 border-b border-b-border">
      <div>
        <h1 className="text-2xl font-medium">Vagas de trabalho</h1>
        <span className="text-muted-foreground">
          Crie, edite e visualize suas vagas de trabalho.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/jobs/new">
          <Button className="cursor-pointer" size={"lg"}>
            <BriefcaseBusiness />
            Adicionar vaga
          </Button>
        </Link>
      </div>
    </div>
  );
}
