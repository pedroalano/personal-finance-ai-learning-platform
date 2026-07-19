import { ChatMessageRole } from '../enums/chat-message-role.enum';

export interface ChatMessageDto {
  id: string;
  userId: string;
  role: ChatMessageRole;
  content: string;
  created_at: Date;
}
