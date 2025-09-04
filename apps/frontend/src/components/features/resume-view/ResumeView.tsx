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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ResumePreview } from "./ResumePreview";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { useEffect } from "react";
import { ResumeLanguageChange } from "./ResumeLanguageChange";
import { FileDown, Trash } from "lucide-react";
import { Language } from "@/types/Language";
import { ResumeVersionChange } from "./ResumeVersionChange";

export default function Resume({
  resume,
  availableLanguages,
  versions,
}: {
  resume: StructuredResume;
  availableLanguages: Language[];
  versions: number[];
}) {
  const form = useForm({
    defaultValues: resume,
  });
  const formValues = form.watch();

  const {
    fields: projectsFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  useEffect(() => {
    form.reset(resume);
  }, [form, resume]);

  function onSubmit(data: Partial<StructuredResume>) {
    const updatedResume = {
      ...resume,
      ...data,
    };

    fetch(`http://localhost:8080/resumes/${resume.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedResume),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar o currículo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Currículo atualizado com sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o currículo:", error);
      });
  }

  function handleResumeDownload() {
    fetch("/api/resume.pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resume),
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  return (
    <Container className="flex flex-col w-full px-0! h-screen">
      <div className="grid grid-cols-8">
        <div className="py-4 flex flex-col border border-border col-span-2 overflow-auto ml-8 mt-8 rounded-lg shadow h-[80dvh] sticky top-28">
          <div className="px-4 border-b border-b-border pb-4">
            <ResumeVersionChange
              currentVersion={resume.version}
              versions={versions}
            />
            {/* <div className="mt-4">
              <ResumeLanguageChange
                resumeId={resume.id}
                availableLanguages={availableLanguages}
              />
            </div> */}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <Accordion type="multiple">
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
                <AccordionItem value="projects" className="px-4">
                  <AccordionTrigger>
                    <strong>Projetos</strong>
                  </AccordionTrigger>
                  <AccordionContent>
                    {projectsFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="pb-4 mb-4 border-b border-b-border"
                      >
                        <Controller
                          control={form.control}
                          name={`projects.${index}.name`}
                          render={({ field }) => (
                            <Input
                              type="text"
                              {...field}
                              placeholder="Nome do projeto"
                              className="mb-2"
                            />
                          )}
                        />
                        <Controller
                          control={form.control}
                          name={`projects.${index}.description`}
                          render={({ field }) => (
                            <Textarea
                              placeholder="Descrição do projeto"
                              rows={10}
                              {...field}
                            />
                          )}
                        />
                        <Button
                          variant={"destructiveGhost"}
                          className="mt-2"
                          onClick={() => removeProject(index)}
                        >
                          <Trash />
                          Remover projeto
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        appendProject({
                          achievements: [],
                          description: "",
                          end_date: new Date().toDateString(),
                          name: "",
                          start_date: new Date().toDateString(),
                          technologies_used: [],
                          url: "",
                        })
                      }
                    >
                      Adicionar projeto
                    </Button>
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
              <div className="flex items-center px-4 self-end mt-2">
                <Button
                  type="button"
                  variant={"outline"}
                  className="mr-2"
                  onClick={handleResumeDownload}
                >
                  <FileDown />
                  Baixar PDF
                </Button>
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
