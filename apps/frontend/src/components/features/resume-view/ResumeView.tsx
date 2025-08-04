"use client";

import Container from "@/components/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StructuredResume } from "@/types/StructuredResume";
import { Controller, useForm } from "react-hook-form";
import { ResumePreview } from "./ResumePreview";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { WorkExperienceForm } from "./WorkExperienceForm";

export default function Resume({
  resumeData,
}: {
  resumeData: { id: string; original_json: StructuredResume };
}) {
  const { original_json: resume } = resumeData;
  const form = useForm({
    defaultValues: resume,
  });
  const formValues = form.watch();

  function onSubmit(data: Partial<StructuredResume>) {
    console.log(data);
  }

  return (
    <Container className="max-w-full w-full px-0!">
      <div className="h-20"></div>
      <div className="grid grid-cols-3">
        <div className="py-4 flex flex-col border-border border border-l-0 border-b-0 rounded-sm rounded-b-none max-w-96 print:hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <Accordion type="multiple" defaultValue={["personal-info"]}>
                <AccordionItem value="personal-info" className="px-4">
                  <AccordionTrigger>
                    <strong>Informações pessoais</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PersonalInfoForm control={form.control} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="work-experience" className="px-4">
                  <AccordionTrigger>
                    <strong>Experiência profissional</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    <WorkExperienceForm
                      workExperience={resume.work_experience}
                      control={form.control}
                      formValues={formValues}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="education" className="px-4">
                  <AccordionTrigger>
                    <strong>Formação acadêmica</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    {resume.education.map((edu, index) => (
                      <div key={index}>
                        <Controller
                          control={form.control}
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
                          control={form.control}
                          name={`education.${index}.institution`}
                          defaultValue={edu.institution}
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
                            control={form.control}
                            name={`education.${index}.start_date`}
                            defaultValue={
                              new Date(edu.start_date)
                                .toISOString()
                                .split("T")[0]
                            }
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
                            control={form.control}
                            name={`education.${index}.graduation_date`}
                            defaultValue={
                              new Date(edu.graduation_date)
                                .toISOString()
                                .split("T")[0]
                            }
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
                          control={form.control}
                          name={`education.${index}.relevant_coursework`}
                          defaultValue={edu.relevant_coursework}
                          render={({ field }) => (
                            <Textarea
                              placeholder="Disciplinas relevantes"
                              value={field.value.join("\n")}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const coursework = raw.split("\n");

                                field.onChange(coursework);
                              }}
                              className="mt-2"
                              rows={10}
                            />
                          )}
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="socials-contact" className="px-4">
                  <AccordionTrigger>
                    <strong>Redes sociais e contato</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      {(
                        [
                          { key: "email", label: "Email" },
                          { key: "phone", label: "Telefone" },
                          { key: "linkedin_url", label: "LinkedIn" },
                          { key: "github_url", label: "GitHub" },
                          { key: "portfolio_url", label: "Portfolio" },
                        ] as const
                      ).map((field) => (
                        <Controller
                          key={field.key}
                          name={`personal_info.${field.key}`}
                          control={form.control}
                          defaultValue={resume.personal_info[field.key]}
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
              </Accordion>
              <div className="px-4 self-end mt-2">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </div>
        <ResumePreview resume={{ ...resume, ...formValues }} />
      </div>
    </Container>
  );
}
