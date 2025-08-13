import { StructuredResume } from "@/types/StructuredResume";
import { NewResumePlaceholder } from "./NewResumePlaceholder";
import { ResumeItem } from "./ResumeItem";

type ResumesListProps = {
  resumes: {
    id: string;
    original_json: StructuredResume;
    created_at: string;
    updated_at: string;
  }[];
};

export function ResumesList({ resumes }: ResumesListProps) {
  return (
    <ul className="grid grid-cols-3 gap-20">
      {resumes.map((resume) => (
        <ResumeItem key={resume.id} resume={resume} />
      ))}
      <NewResumePlaceholder />
    </ul>
  );
}
