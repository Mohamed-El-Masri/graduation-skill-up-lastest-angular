export interface AIMessage {
    id: number;
    conversationId: number;
    content: string;
    isFromUser: boolean;
    timestamp: Date;
    metadata?: { [key: string]: any };
}
