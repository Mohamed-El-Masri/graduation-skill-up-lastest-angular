import { Certification } from "./certification";
import { Education } from "./education";
import { Language } from "./language";
import { Reference } from "./reference";
import { Skill } from "./skill";
import { WorkExperience } from "./work-experience";

export interface CV {
    id?: number;
    userId?: number;
    templateId?: number;
    title?: string;
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    summary?: string;
    linkedInUrl?: string;
    workExperiences?: WorkExperience[];
    educations?: Education[];
    skills?: Skill[];
    languages?: Language[];
    certifications?: Certification[];
    references?: Reference[];
    createdAt?: Date;
    updatedAt?: Date;
}
