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
  const response = await fetch(
    `http://localhost:8080/resumes/${id}/versions/latest`
  );
  const { data } = await response.json();
  const { resume, versions } = data;
  const { language, version } = await searchParams;

  if (language || version) {
    const url = new URL(`http://localhost:8080/resumes/${id}`);
    const params = new URLSearchParams();

    if (version) {
      url.pathname += `/versions/${version}`;
    }

    if (language) {
      params.set("language", language);
    }

    url.search = params.toString();

    const response = await fetch(url.toString());

    if (!response.ok) {
      redirect("/resumes");
    }

    const { data } = await response.json();
    const { resume, versions } = data;

    return (
      <ResumeView resume={resume} availableLanguages={[]} versions={versions} />
    );
  }

  if (!response.ok) {
    redirect("/resumes");
  }

  return (
    <ResumeView resume={resume} availableLanguages={[]} versions={versions} />
  );
}
