export interface WorkExperience {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    isCurrentJob: boolean;
}
