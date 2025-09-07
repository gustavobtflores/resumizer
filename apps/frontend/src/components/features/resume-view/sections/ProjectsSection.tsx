import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StructuredResume } from "@/types/StructuredResume";
import { Trash } from "lucide-react";
import { Control, Controller, useFieldArray } from "react-hook-form";

export function ProjectsSection({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  const {
    fields: projectsFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: control,
    name: "projects",
  });

  return (
    <AccordionItem value="projects" className="px-4">
      <AccordionTrigger>
        <strong>Projetos</strong>
      </AccordionTrigger>
      <AccordionContent>
        {projectsFields.map((field, index) => (
          <div key={field.id} className="pb-4 mb-4 border-b border-b-border">
            <Controller
              control={control}
              name={`projects.${index}.name`}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Nome do projeto"
                  className="mb-2"
                />
              )}
            />
            <Controller
              control={control}
              name={`projects.${index}.description`}
              render={({ field }) => (
                <Textarea
                  placeholder="Descrição do projeto"
                  rows={10}
                  {...field}
                />
              )}
            />
            <Button
              variant={"destructiveGhost"}
              className="mt-2"
              onClick={() => removeProject(index)}
            >
              <Trash />
              Remover projeto
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendProject({
              achievements: [],
              description: "",
              end_date: new Date().toDateString(),
              name: "",
              start_date: new Date().toDateString(),
              technologies_used: [],
              url: "",
            })
          }
        >
          Adicionar projeto
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
