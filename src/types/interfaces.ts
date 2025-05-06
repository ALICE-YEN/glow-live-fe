import { StreamStatus } from "@/types/enum";

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
