import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StructuredResume } from "@/types/StructuredResume";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

export function SocialContactSection({
  control,
}: {
  control: Control<StructuredResume>;
}) {
  const fields = [
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefone" },
    { key: "linkedin_url", label: "LinkedIn" },
    { key: "github_url", label: "GitHub" },
    { key: "portfolio_url", label: "Portfolio" },
  ] as const;

  return (
    <AccordionItem value="socials-contact" className="px-4">
      <AccordionTrigger>
        <strong>Redes sociais e contato</strong>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <Controller
              key={field.key}
              name={`personal_info.${field.key}`}
              control={control}
              render={({ field: controllerField }) => (
                <Input
                  placeholder={field.label}
                  value={controllerField.value || ""}
                  onChange={controllerField.onChange}
                />
              )}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
