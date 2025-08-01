export const resumeSchema = {
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    socials: [
      {
        label: "",
        url: "",
      },
    ],
  },
  professional_summary: "",
  work_experience: [
    {
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      achievements: [],
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field_of_study: "",
      location: "",
      start_date: "",
      graduation_date: "",
      gpa: "",
      honors: [],
      relevant_coursework: [],
    },
  ],
  skills: {
    technical_skills: [],
    soft_skills: [],
    languages: [
      {
        language: "",
        proficiency: "",
      },
    ],
    tools_technologies: [],
  },
  certifications: [
    {
      name: "",
      issuing_organization: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
    },
  ],
  projects: [
    {
      name: "",
      description: "",
      technologies_used: [],
      start_date: "",
      end_date: "",
      url: "",
      achievements: [],
    },
  ],
};
