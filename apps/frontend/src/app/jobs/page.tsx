import { JobsList } from "@/components/features/jobs-list/JobsList";
import { JobsListHeader } from "@/components/features/jobs-list/JobsListHeader";
import Container from "@/components/layout/Container";

export default async function JobsPage() {
  const response = await fetch("http://localhost:8080/jobs");
  const jobs = await response.json();

  return (
    <Container className="pt-20">
      <JobsListHeader />
      <JobsList jobs={jobs} />
    </Container>
  );
}
