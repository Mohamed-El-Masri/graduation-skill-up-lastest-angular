export interface LearningPath {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: number;
    prerequisites: string[];
    learningObjectives: string[];
    imageUrl?: string;
    isActive: boolean;
}
