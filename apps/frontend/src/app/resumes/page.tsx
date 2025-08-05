import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StructuredResume } from "@/types/StructuredResume";
import { BriefcaseBusiness, File } from "lucide-react";
import Link from "next/link";

export default async function Resumes() {
  const data = await fetch("http://localhost:8080/resumes");
  const resumes: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
  }[] = await data.json();

  return (
    <Container className="mt-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold">Currículos</h1>
        <div className="flex items-center gap-2">
          <Link href="/resumes/new">
            <Button className="cursor-pointer">
              <File />
              Adicionar currículo
            </Button>
          </Link>
          <Button variant={"outline"}>
            <BriefcaseBusiness />
            Adicionar descrição
          </Button>
        </div>
      </div>
      <ul className="grid grid-cols-4 gap-4">
        {resumes.map((resume) => (
          <li key={resume.id}>
            <Link href={`/resumes/${resume.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {resume.original_json.personal_info.full_name}
                  </CardTitle>
                  <CardDescription>
                    {resume.original_json.work_experience[0]?.position ||
                      "Sem experiência"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">
                    {new Date(resume.created_at).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
