import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StructuredResume } from "@/types/StructuredResume";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";

export function EducationSection({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: control,
    name: "education",
  });

  return (
    <AccordionItem value="education" className="px-4">
      <AccordionTrigger>
        <strong>Formação acadêmica</strong>
      </AccordionTrigger>
      <AccordionContent>
        {educationFields.map((field, index) => (
          <div key={field.id} className="pb-4 mb-4 border-b border-b-border">
            <Controller
              control={control}
              name={`education.${index}.field_of_study`}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Curso"
                  className="mb-2"
                />
              )}
            />
            <Controller
              control={control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Instituição"
                  className="mb-2"
                />
              )}
            />
            <div className="flex items-center">
              <Controller
                control={control}
                name={`education.${index}.start_date`}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...field}
                    placeholder="Data de início"
                    className="mb-2 rounded-r-none"
                  />
                )}
              />
              <Controller
                control={control}
                name={`education.${index}.graduation_date`}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...field}
                    placeholder="Data de conclusão"
                    className="mb-2 rounded-l-none"
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name={`education.${index}.relevant_coursework`}
              render={({ field }) => (
                <Textarea
                  placeholder="Disciplinas relevantes"
                  value={field.value?.join("\n") || ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const coursework = raw.split("\n");
                    field.onChange(coursework);
                  }}
                  className="mt-2"
                  rows={5}
                />
              )}
            />
            <Button
              variant={"destructiveGhost"}
              className="mt-2"
              onClick={() => removeEducation(index)}
            >
              <Trash />
              Remover formação
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendEducation({
              field_of_study: "",
              institution: "",
              degree: "",
              start_date: "",
              graduation_date: "",
              relevant_coursework: [],
            })
          }
        >
          Adicionar formação
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
