import { Input } from "@/components/ui/input";
import { StructuredResume } from "@/types/StructuredResume";
import { Control, Controller } from "react-hook-form";

export function PersonalInfoForm({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="personal_info.full_name"
        control={control}
        render={({ field }) => <Input placeholder="Nome completo" {...field} />}
      />
    </div>
  );
}
