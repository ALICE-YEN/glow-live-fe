import { ChatMessageType } from "./enum";

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
