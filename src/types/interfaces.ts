import { StreamStatus } from "@/types/enum";

export interface StreamDetail {
  id: number;
  user_id: number; // 主播 ID
  title?: string;
  description?: string;
  stream_key: string;
  status: StreamStatus;
  started_at?: string;
  ended_at?: string;
  thumbnail_url?: string;
  is_recorded: boolean;
  playback_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GiftDetail {
  id: number;
  name: string;
  emoji: string;
  price: number;
}
