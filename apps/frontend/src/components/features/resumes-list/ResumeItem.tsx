"use client";

import { Button } from "@/components/ui/button";
import { StructuredResume } from "@/types/StructuredResume";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, DownloadCloud, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ResumeItem({
  resume,
}: {
  resume: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
    updated_at: string;
  };
}) {
  const router = useRouter();

  function handleResumeDelete() {
    fetch(`http://localhost:8080/resumes/${resume.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir o currículo");
        }

        router.refresh();
      })
      .catch((error) => {
        console.error("Error deleting resume:", error);
      });
  }

  return (
    <li key={resume.id}>
      <div className="flex gap-4">
        <div className="border border-border rounded-lg overflow-hidden shadow-lg shrink-0">
          <Image
            src={"/fixture/resume.png"}
            width={200}
            height={300}
            alt=""
            style={{ clipPath: "inset(1px)" }}
          />
        </div>
        <div className="flex flex-col">
          <strong className="font-medium text-lg mb-1">
            {resume.original_json.personal_info.full_name}
          </strong>
          <span className="text-muted-foreground text-sm">
            Editado{" "}
            {formatDistanceToNow(new Date(resume.updated_at), {
              locale: ptBR,
              addSuffix: true,
            })}
          </span>
          <div className="flex flex-col gap-3 mt-6">
            <Link href={`/resumes/${resume.id}`}>
              <Button
                variant={"outline"}
                size={"sm"}
                className="w-full justify-start shadow cursor-pointer font-normal"
              >
                <Edit className="mr-1" />
                Abrir no editor
              </Button>
            </Link>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="justify-start cursor-pointer font-normal"
            >
              <DownloadCloud className="mr-1" />
              Baixar PDF
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="justify-start cursor-pointer font-normal text-red-500!"
              onClick={handleResumeDelete}
            >
              <Trash />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
