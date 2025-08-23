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
  const response =
    language === undefined
      ? await fetch(`http://localhost:8080/resumes/${id}`)
      : await fetch(`http://localhost:8080/resumes/${id}?language=${language}`);
  const { data } = await response.json();
  const { resume, available_languages } = data;

  console.log("Resume data:", resume); // Debugging line

  if (!response.ok) {
    redirect("/resumes");
  }

  if (!language) {
    redirect(`/resumes/${id}?language=${resume.language}`);
  }

  return (
    <ResumeView resume={resume} availableLanguages={available_languages} />
  );
}
