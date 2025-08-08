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

export function CreateJob({
  resumes,
}: {
  resumes: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
  }[];
}) {
  function handleAddJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log("Job added with data:", {
      resumeId: formData.get("resumeId"),
      jobDescription: formData.get("jobDescription"),
    });
  }

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
          <Select name="resumeId">
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
