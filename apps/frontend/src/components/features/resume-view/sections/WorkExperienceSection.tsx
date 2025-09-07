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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";

export function WorkExperienceSection({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  const {
    fields: workExperienceFields,
    append: appendWorkExperience,
    remove: removeWorkExperience,
  } = useFieldArray({
    control: control,
    name: "work_experience",
  });

  return (
    <AccordionItem value="work-experience" className="px-4">
      <AccordionTrigger>
        <strong>Experiência profissional</strong>
      </AccordionTrigger>
      <AccordionContent>
        {workExperienceFields.map((field, index) => (
          <div key={field.id} className="pb-4 mb-4 border-b border-b-border">
            <Controller
              name={`work_experience.${index}.position`}
              control={control}
              render={({ field }) => (
                <Input placeholder="Cargo" {...field} className="mb-2" />
              )}
            />
            <Controller
              name={`work_experience.${index}.company`}
              control={control}
              render={({ field }) => (
                <Input placeholder="Empresa" {...field} className="mb-2" />
              )}
            />
            <Controller
              name={`work_experience.${index}.location`}
              control={control}
              render={({ field }) => (
                <Input placeholder="Localização" {...field} className="mb-2" />
              )}
            />
            <Controller
              name={`work_experience.${index}.description`}
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Descrição do cargo"
                  {...field}
                  className="mb-2"
                  rows={4}
                />
              )}
            />
            <div className="flex items-center">
              <Controller
                name={`work_experience.${index}.start_date`}
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    placeholder="Data de início"
                    {...field}
                    className="rounded-r-none"
                  />
                )}
              />
              <Controller
                name={`work_experience.${index}.end_date`}
                control={control}
                disabled={field.is_current}
                render={({ field }) => (
                  <Input
                    type="date"
                    placeholder="Data de término"
                    {...field}
                    className="rounded-l-none"
                  />
                )}
              />
            </div>
            <Controller
              name={`work_experience.${index}.is_current`}
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3 my-4">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label>Trabalho atualmente nesse cargo</Label>
                </div>
              )}
            />
            <Controller
              name={`work_experience.${index}.achievements`}
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Conquistas"
                  value={field.value?.join("\n") || ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const achievements = raw
                      .split("\n")
                      .map((item) => item.trim());
                    field.onChange(achievements);
                  }}
                  className="mt-2"
                  rows={10}
                />
              )}
            />
            <Button
              variant={"destructiveGhost"}
              className="mt-2"
              onClick={() => removeWorkExperience(index)}
            >
              <Trash />
              Remover experiência
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendWorkExperience({
              position: "",
              company: "",
              location: "",
              start_date: "",
              end_date: "",
              is_current: false,
              description: "",
              achievements: [],
            })
          }
        >
          Adicionar experiência
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
