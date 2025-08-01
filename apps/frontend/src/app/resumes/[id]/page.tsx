"use client";

import Container from "@/components/layout/Container";
import { ResumePreview } from "@/components/resume/ResumePreview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StructuredResume } from "@/types/StructuredResume";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Resume() {
  const { id } = useParams();

  const [resume, setResume] = useState<StructuredResume | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`http://localhost:8080/resumes/${id}`);
      const resume = await data.json();
      setResume(resume.original_json);
    };
    fetchData();
  }, [id]);

  const form = useForm();
  const formValues = form.watch();

  if (!resume) return null;

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
                    <div className="flex flex-col gap-4">
                      <Controller
                        name="personal_info.full_name"
                        control={form.control}
                        defaultValue={resume.personal_info.full_name}
                        render={({ field }) => (
                          <Input placeholder="Nome completo" {...field} />
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="work-experience" className="px-4">
                  <AccordionTrigger>
                    <strong>Experiência profissional</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    {resume.work_experience.map((exp, index) => (
                      <div key={index}>
                        <Controller
                          name={`work_experience.${index}.position`}
                          control={form.control}
                          defaultValue={exp.position}
                          render={({ field }) => (
                            <Input
                              placeholder="Cargo"
                              {...field}
                              className="mb-2"
                            />
                          )}
                        />
                        <Controller
                          name={`work_experience.${index}.company`}
                          control={form.control}
                          defaultValue={exp.company}
                          render={({ field }) => (
                            <Input
                              placeholder="Empresa"
                              {...field}
                              className="mb-2"
                            />
                          )}
                        />
                        <div className="flex items-center">
                          <Controller
                            name={`work_experience.${index}.start_date`}
                            control={form.control}
                            defaultValue={
                              new Date(exp.start_date)
                                .toISOString()
                                .split("T")[0]
                            }
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
                            control={form.control}
                            defaultValue={exp.end_date}
                            disabled={
                              formValues.work_experience?.[index].is_current ??
                              resume.work_experience?.[index].is_current
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
                          control={form.control}
                          defaultValue={exp.is_current}
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
                          control={form.control}
                          defaultValue={exp.achievements}
                          render={({ field }) => (
                            <Textarea
                              placeholder="Conquistas"
                              value={field.value.join("\n")}
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
                      </div>
                    ))}
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
                          name={`education.${index}.degree`}
                          defaultValue={edu.degree || edu.field_of_study}
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
                                const coursework = raw
                                  .split("\n")
                                  .map((item) => item.trim());

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
                      <Controller
                        name="personal_info.email"
                        control={form.control}
                        defaultValue={resume.personal_info.email}
                        render={({ field }) => (
                          <Input placeholder="Email" {...field} />
                        )}
                      />
                      {["LinkedIn", "GitHub"].map((social) => (
                        <Controller
                          key={social}
                          name={`personal_info.socials.${social.toLowerCase()}`}
                          control={form.control}
                          defaultValue={
                            resume.personal_info.socials.find(
                              (s) => s.label === social
                            )?.url || ""
                          }
                          render={({ field }) => (
                            <Input placeholder={social} {...field} />
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
