"use client";

import Container from "@/components/layout/Container";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StructuredResume } from "@/types/StructuredResume";
import { useForm } from "react-hook-form";
import { ResumePreview } from "./ResumePreview";
import { useEffect } from "react";
import { FileDown } from "lucide-react";
import { Language } from "@/types/Language";
import { ResumeVersionChange } from "./ResumeVersionChange";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { WorkExperienceSection } from "./sections/WorkExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SocialContactSection } from "./sections/SocialContactSection";

export default function Resume({
  resume,
  versions,
}: {
  resume: StructuredResume;
  availableLanguages: Language[];
  versions: number[];
}) {
  const form = useForm({
    defaultValues: {
      ...resume,
      skills: {
        ...resume.skills,
        languages: resume.skills?.languages || [],
      },
    },
  });
  const formValues = form.watch();

  useEffect(() => {
    form.reset({
      ...resume,
      skills: {
        ...resume.skills,
        languages: resume.skills?.languages || [],
      },
    });
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
                <PersonalInfoSection control={form.control} />
                <WorkExperienceSection control={form.control} />
                <EducationSection control={form.control} />
                <LanguagesSection control={form.control} />
                <ProjectsSection control={form.control} />
                <SocialContactSection control={form.control} />
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
