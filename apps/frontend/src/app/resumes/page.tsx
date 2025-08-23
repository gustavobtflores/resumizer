import { ResumesList } from "@/components/features/resumes-list/ResumesList";
import { ResumesListHeader } from "@/components/features/resumes-list/ResumesListHeader";
import Container from "@/components/layout/Container";
import { StructuredResume } from "@/types/StructuredResume";

export default async function Resumes() {
  const data = await fetch("http://localhost:8080/resumes");
  const {
    data: resumes,
  }: {
    data: {
      id: string;
      original_json: StructuredResume;
      created_at: string;
      updated_at: string;
    }[];
  } = await data.json();

  return (
    <Container className="pt-20">
      <ResumesListHeader />
      <ResumesList resumes={resumes} />
    </Container>
  );
}
