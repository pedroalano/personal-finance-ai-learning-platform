import type { ChatMessageRole } from '../enums/chat-message-role.enum.js';
export interface ChatMessageDto {
    id: string;
    role: ChatMessageRole;
    content: string;
    sessionId: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
}
export interface SendChatMessageDto {
    content: string;
    sessionId: string;
}
//# sourceMappingURL=chat-message.dto.d.ts.map