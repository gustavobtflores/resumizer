export interface StructuredResume {
  skills: Skills;
  projects: Project[];
  education: Education[];
  references: Reference[];
  publications: Publication[];
  awards_honors: AwardsHonor[];
  personal_info: PersonalInfo;
  certifications: Certification[];
  work_experience: WorkExperience[];
  additional_sections: AdditionalSections;
  professional_summary: string;
  volunteer_experience: VolunteerExperience[];
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

interface Reference {
  name: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  relationship: string;
}

interface Publication {
  url: string;
  date: string;
  title: string;
  authors: string[];
  publication_venue: string;
}

interface AwardsHonor {
  date: string;
  name: string;
  issuer: string;
  description: string;
}

interface PersonalInfo {
  email: string;
  phone: string;
  location: Location;
  full_name: string;
  github_url: string;
  other_urls: string[];
  linkedin_url: string;
  portfolio_url: string;
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

interface AdditionalSections {
  [key: string]: string | string[] | null;
}

interface VolunteerExperience {
  role: string;
  end_date: string;
  location: string;
  start_date: string;
  description: string;
  achievements: string[];
  organization: string;
}
