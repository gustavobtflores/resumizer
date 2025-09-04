"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate } from "@/utils/formatDate";
import { StructuredResume } from "@/types/StructuredResume";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Language } from "@/types/Language";
import { VersionSelect } from "@/components/VersionSelect";
import { version } from "os";

export function CreateJob({
  resumes,
}: {
  resumes: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
  }[];
}) {
  const router = useRouter();
  // const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  // const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [versions, setVersions] = useState<number[]>([]);

  function handleAddJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    fetch("http://localhost:8080/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeId: formData.get("resumeId"),
        version: formData.get("version"),
        jobDescription: formData.get("jobDescription"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to add job:", response.statusText);
          return;
        }
        console.log("Job added successfully");
        router.push("/jobs");
      })
      .catch((error) => {
        console.error("Error adding job:", error);
      });
  }

  function handleResumeChange(value: string) {
    setSelectedResume(value);
  }

  // useEffect(() => {
  //   if (!selectedResume) {
  //     setAvailableLanguages([]);
  //     return;
  //   }

  //   setLoadingLanguages(true);
  //   fetch(`http://localhost:8080/resumes/${selectedResume}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const { data: resume } = data;

  //       setAvailableLanguages(resume.available_languages || []);
  //       console.log("Available languages:", resume.available_languages);
  //     })
  //     .finally(() => {
  //       setLoadingLanguages(false);
  //     });
  // }, [selectedResume]);

  useEffect(() => {
    if (!selectedResume) {
      setVersions([]);
      return;
    }

    fetch(`http://localhost:8080/resumes/${selectedResume}/versions`)
      .then((response) => response.json())
      .then(({ data }) => {
        setVersions(data.versions || []);
        console.log("Available versions:", data.versions);
      });
  }, [selectedResume]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Adicionar descrição de vaga</CardTitle>
        <CardDescription>
          Cole a descrição completa da vaga abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddJob} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select name="resumeId" onValueChange={handleResumeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um currículo" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.original_json.personal_info.full_name} -{" "}
                    {formatDate(resume.created_at)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <VersionSelect
              name="version"
              versions={versions}
              onChange={(version) => console.log(version)}
              disabled={!selectedResume}
            />
          </div>
          <Textarea
            placeholder="Descrição da vaga"
            rows={10}
            name="jobDescription"
          />
          <Button type="submit">Adicionar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
