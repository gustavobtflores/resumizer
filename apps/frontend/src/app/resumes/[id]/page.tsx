import ResumeView from "@/components/features/resume-view/ResumeView";

export default async function Resume({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetch(`http://localhost:8080/resumes/${id}`);
  const resume = await data.json();

  return <ResumeView resumeData={resume} />;
}
