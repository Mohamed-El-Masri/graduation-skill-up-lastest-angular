export interface Assessment {
    id: number;
    title: string;
    description: string;
    learningPathId: number;
    passingScore: number;
    timeLimit?: number;
    isActive: boolean;
}
