export interface StructuredResume {
  skills: Skills;
  projects: Project[];
  education: Education[];
  personal_info: PersonalInfo;
  certifications: Certification[];
  work_experience: WorkExperience[];
  professional_summary: string;
}

interface Skills {
  languages: string[];
  soft_skills: string[];
  technical_skills: string[];
  tools_technologies: string[];
}

interface Project {
  url: string;
  name: string;
  end_date: string;
  start_date: string;
  description: string;
  achievements: string[];
  technologies_used: string[];
}

interface Education {
  gpa: string;
  degree: string;
  honors: string[];
  location: string;
  start_date: string;
  institution: string;
  field_of_study: string;
  graduation_date: string;
  relevant_coursework: string[];
}

interface PersonalInfo {
  email: string;
  phone: string;
  location: Location;
  full_name: string;
  portfolio_url: string;
  socials: { label: string; url: string }[];
}

interface Location {
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

interface Certification {
  name: string;
  issue_date: string;
  credential_id: string;
  expiration_date: string;
  issuing_organization: string;
}

interface WorkExperience {
  company: string;
  end_date: string;
  location: string;
  position: string;
  is_current: boolean;
  start_date: string;
  description: string;
  achievements: string[];
}
