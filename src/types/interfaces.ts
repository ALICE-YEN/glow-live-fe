import { StreamStatus, ChatMessageType } from "@/types/enum";

export interface StreamDetail {
  id: number;
  userId: number; // 主播 ID
  title?: string;
  description?: string;
  streamKey: string;
  status: StreamStatus;
  startedAt?: string;
  endedAt?: string;
  thumbnailUrl?: string;
  isRecorded: boolean;
  playbackUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftDetail {
  id: number;
  name: string;
  emoji: string;
  price: number;
}

export interface ChatMessage {
  id: number;
  streamId: number;
  userId: number;
  content: string;
  type: ChatMessageType;
  createdAt: string;
  updatedAt: string;
  username?: string; // websocket 加此欄位，方便聊天室直接取用
}
