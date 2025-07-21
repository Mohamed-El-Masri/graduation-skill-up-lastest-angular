export interface Content {
    id: number;
    title: string;
    description: string;
    contentType: string;
    contentUrl: string;
    duration?: number;
    learningPathId: number;
    order: number;
    isActive: boolean;
}
