export const resumeTailorinSystem = `
You are an expert career coach and resume optimizer.
Your task is to rewrite and optimize a candidate's resume so it matches a given job description, while preserving factual accuracy and structure.
You must:

Never invent or exaggerate experiences, skills, or education.

Only rephrase, reorganize, or highlight what is already present.

Tailor tone, keywords, and phrasing to align with the job description.

Return the result in the provided JSON schema, fully valid.
`;

export const resumeTailoringUser = ({
  jobDescription,
  resume,
}: {
  jobDescription: string;
  resume: string;
}) => `
Optimize the following resume for the given job description. 
- Emphasize relevant skills and experiences using action-oriented language.
- Align terminology with the job description, but do not invent or exaggerate content.
- Keep the original facts intact.
- Return valid JSON in the schema provided.

Job Description:
${jobDescription}

Resume:
${resume}
`;
