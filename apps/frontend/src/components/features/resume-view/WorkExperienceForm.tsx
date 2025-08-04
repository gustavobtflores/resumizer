import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StructuredResume } from "@/types/StructuredResume";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Control, Controller } from "react-hook-form";

export function WorkExperienceForm({
  control,
  workExperience,
  formValues,
}: {
  control: Control<StructuredResume>;
  workExperience: StructuredResume["work_experience"];
  formValues: StructuredResume;
}) {
  return workExperience.map((exp, index) => (
    <div key={index}>
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
      <div className="flex items-center">
        <Controller
          name={`work_experience.${index}.start_date`}
          control={control}
          defaultValue={new Date(exp.start_date).toISOString().split("T")[0]}
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
          defaultValue={exp.end_date}
          disabled={
            formValues.work_experience?.[index].is_current ??
            workExperience?.[index].is_current
          }
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
        defaultValue={exp.is_current}
        render={({ field }) => (
          <div className="flex items-center gap-3 my-4">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <Label>Trabalho atualmente nesse cargo</Label>
          </div>
        )}
      />
      <Controller
        name={`work_experience.${index}.achievements`}
        control={control}
        defaultValue={exp.achievements}
        render={({ field }) => (
          <Textarea
            placeholder="Conquistas"
            value={field.value.join("\n")}
            onChange={(e) => {
              const raw = e.target.value;
              const achievements = raw.split("\n").map((item) => item.trim());

              field.onChange(achievements);
            }}
            className="mt-2"
            rows={10}
          />
        )}
      />
    </div>
  ));
}
