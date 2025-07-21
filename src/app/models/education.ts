export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    gpa?: number;
    description?: string;
}
