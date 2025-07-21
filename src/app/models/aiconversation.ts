import { AIMessage } from "./aimessage";
import { ConversationType } from "./conversation-type";

export interface AIConversation {
    id: number;
    userId: number;
    title: string;
    type: ConversationType;
    createdAt: Date;
    updatedAt: Date;
    messages: AIMessage;
}
