import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StructuredResume } from "@/types/StructuredResume";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { PROFICIENCY_LEVELS } from "@/constants/language-proficiency";

export function LanguagesForm({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills.languages",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <div>
            <Controller
              name={`skills.languages.${index}.language`}
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Idioma (ex: Inglês, Espanhol, Francês)"
                  {...field}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name={`skills.languages.${index}.proficiency`}
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Nível de proficiência" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROFICIENCY_LEVELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button
            type="button"
            variant="destructiveGhost"
            size="sm"
            onClick={() => remove(index)}
          >
            <Trash size={16} />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ language: "", proficiency: "basic" })}
        className="w-fit"
      >
        Adicionar idioma
      </Button>
    </div>
  );
}
