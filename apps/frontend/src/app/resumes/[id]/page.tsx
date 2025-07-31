"use client";

import Container from "@/components/layout/Container";
import { ResumePreview } from "@/components/resume/ResumePreview";
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
    <Container className="mt-20 max-w-full">
      <div className="grid grid-cols-3">
        <div className="p-4 flex flex-col border-border border rounded-sm print:hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <section>
                <div>
                  <strong className="mb-2 block">Informações pessoais</strong>
                  <div className="flex flex-col gap-4">
                    <Controller
                      name="personal_info.full_name"
                      control={form.control}
                      defaultValue={resume.personal_info.full_name}
                      render={({ field }) => (
                        <Input placeholder="Nome completo" {...field} />
                      )}
                    />
                    <Controller
                      name="personal_info.email"
                      control={form.control}
                      defaultValue={resume.personal_info.email}
                      render={({ field }) => (
                        <Input placeholder="Email" {...field} />
                      )}
                    />
                  </div>
                </div>
              </section>
              <section>
                <strong className="mb-2 block">Experiência profissional</strong>
                <div>
                  {resume.work_experience.map((exp, index) => (
                    <div key={index} className="mb-4">
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
                      <div className="flex gap-4">
                        <Controller
                          name={`work_experience.${index}.start_date`}
                          control={form.control}
                          defaultValue={
                            new Date(exp.start_date).toISOString().split("T")[0]
                          }
                          render={({ field }) => (
                            <Input
                              type="date"
                              placeholder="Data de início"
                              {...field}
                              className="mb-2"
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
                              className="mb-2"
                            />
                          )}
                        />
                      </div>
                      <Controller
                        name={`work_experience.${index}.is_current`}
                        control={form.control}
                        defaultValue={exp.is_current}
                        render={({ field }) => (
                          <div className="flex items-center gap-3 mt-2">
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
                </div>
              </section>
              <Button className="mt-4" type="submit">
                Salvar
              </Button>
            </form>
          </Form>
        </div>
        <ResumePreview resume={{ ...resume, ...formValues }} />
      </div>
    </Container>
  );
}
