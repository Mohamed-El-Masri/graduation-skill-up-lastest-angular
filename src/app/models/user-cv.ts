import { Certification } from "./certification";
import { Education } from "./education";
import { Language } from "./language";
import { PersonalInfo } from "./personal-info";
import { Reference } from "./reference";
import { Skill } from "./skill";
import { WorkExperience } from "./work-experience";

export interface UserCV {
      id: number;
  userId: number;
  templateId: number;
  title: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  references: Reference[];
  createdAt: Date;
  updatedAt: Date;
}
