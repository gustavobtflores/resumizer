import ResumeView from "@/components/features/resume-view/ResumeView";
import { redirect } from "next/navigation";

export default async function Resume({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetch(`http://localhost:8080/resumes/${id}`);
  const resume = await data.json();

  if (!data.ok) {
    redirect("/resumes");
  }

  return <ResumeView resumeData={resume} />;
}
