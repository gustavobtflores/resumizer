import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { StructuredResume } from "@/types/StructuredResume";
import { Control, Controller } from "react-hook-form";

export function PersonalInfoSection({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  return (
    <AccordionItem value="personal-info" className="px-4">
      <AccordionTrigger>
        <strong>Informações pessoais</strong>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4">
          <Controller
            name="personal_info.full_name"
            control={control}
            render={({ field }) => (
              <Input placeholder="Nome completo" {...field} />
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
