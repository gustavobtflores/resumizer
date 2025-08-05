import { StructuredResume } from "@/types/StructuredResume";
import { formatDate } from "@/utils/formatDate";
import { Fragment } from "react";

function Experiences({
  experiences,
}: {
  experiences: StructuredResume["work_experience"];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base border-b print:border-b-zinc-200 border-b-border pb-2 mb-4">
        Experiências
      </h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{exp.position}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(exp.start_date)} -{" "}
              {exp.is_current ? "Atual" : formatDate(exp.end_date)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{exp.company}</p>
          {exp.achievements.length > 0 && (
            <ul className="mt-4 pl-8">
              {exp.achievements.map((achievement, idx) => (
                <li className="list-disc pl-4 text-sm mt-2" key={idx}>
                  {achievement}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function Education({
  education,
}: {
  education: StructuredResume["education"];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base border-b border-b-border print:border-b-zinc-200 pb-2 mb-4">
        Formação acadêmica
      </h2>
      {education.map((edu, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{edu.field_of_study}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(edu.start_date)} - {formatDate(edu.graduation_date)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{edu.institution}</p>
          <p className="text-sm mt-4">{edu.relevant_coursework.join(", ")}</p>
        </div>
      ))}
    </section>
  );
}

export function ResumePreview({ resume }: { resume: StructuredResume }) {
  const socials = (
    [
      { key: "linkedin_url", label: "LinkedIn" },
      { key: "github_url", label: "GitHub" },
      { key: "portfolio_url", label: "Portfolio" },
    ] as const
  )
    .map((item) => ({ ...item, url: resume.personal_info[item.key] }))
    .filter((item) => Boolean(item.url));

  return (
    <div className="px-4 col-span-2 print:col-span-3 overflow-auto pb-8">
      <div className="bg-secondary rounded-sm col-span-2 max-w-full w-[21cm] h-[29.7cm] p-8 print:p-0">
        <h1 className="text-3xl font-semibold">
          {resume.personal_info.full_name}
        </h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {resume.personal_info.email && (
            <a href={`mailto:${resume.personal_info.email}`}>
              {resume.personal_info.email}
            </a>
          )}

          {resume.personal_info.phone && (
            <>
              <span>•</span>
              <a href={`tel:${resume.personal_info.phone}`}>
                {resume.personal_info.phone}
              </a>
            </>
          )}

          {socials.length > 0 &&
            socials.map(({ url, label }, index) => (
              <Fragment key={index}>
                <span>•</span>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </Fragment>
            ))}
        </div>
        <Experiences experiences={resume.work_experience} />
        <Education education={resume.education} />
      </div>
    </div>
  );
}
