import { CreateJob } from "@/components/features/create-job/CreateJob";
import Container from "@/components/layout/Container";

export default async function NewJobPage() {
  const response = await fetch("http://localhost:8080/resumes");
  const { data: resumes } = await response.json();

  return (
    <Container className="flex flex-col items-center justify-center h-[calc(100vh_-_80px)]">
      <CreateJob resumes={resumes} />
    </Container>
  );
}
