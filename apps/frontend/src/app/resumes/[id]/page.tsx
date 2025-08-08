import ResumeView from "@/components/features/resume-view/ResumeView";
import { redirect } from "next/navigation";

export default async function Resume({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const { id } = await params;
  const { language } = await searchParams;
  const data =
    language === undefined
      ? await fetch(`http://localhost:8080/resumes/${id}`)
      : await fetch(`http://localhost:8080/resumes/${id}?language=${language}`);
  const resume = await data.json();

  if (!data.ok) {
    redirect("/resumes");
  }

  if (!language) {
    redirect(`/resumes/${id}?language=${resume.language}`);
  }

  return <ResumeView resumeData={resume} />;
}
