import { CreateJob } from "@/components/features/create-job/CreateJob";
import Container from "@/components/layout/Container";
import { StructuredResume } from "@/types/StructuredResume";

export default async function NewJobPage() {
  const data = await fetch("http://localhost:8080/resumes");
  const resumes: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
  }[] = await data.json();

  return (
    <Container className="flex flex-col items-center justify-center h-full">
      <CreateJob resumes={resumes} />
    </Container>
  );
}
