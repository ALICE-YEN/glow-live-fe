import { ChatMessageType } from "./enum";
import { StreamDetail } from "./interfaces";

export interface CreateStreamBody {
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface CreateChatBody {
  content: string;
  type?: ChatMessageType;
}

export interface SendGiftBody {
  senderId: number;
  giftId: number;
  price: number;
  amount: number;
}
export interface GetStreamResponse extends StreamDetail {
  isFollowedByCurrentUser: boolean;
}
