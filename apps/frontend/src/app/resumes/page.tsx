import Container from "@/components/layout/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StructuredResume } from "@/types/StructuredResume";
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
      <h1 className="text-2xl font-semibold mb-10">Currículos</h1>
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
