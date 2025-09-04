export interface StructuredResume {
  id: string;
  version: number;
  skills: Skills;
  projects: Project[];
  education: Education[];
  personal_info: PersonalInfo;
  certifications: Certification[];
  work_experience: WorkExperience[];
  professional_summary: string;
  metadata: {
    language: string;
  };
}

interface Skills {
  languages: string[];
  programming_languages: string[];
  web_technologies: string[];
  database_cloud: string[];
  tools_platforms: string[];
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
  github_url: string;
  linkedin_url: string;
  other_urls: { label: string; url: string }[];
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
