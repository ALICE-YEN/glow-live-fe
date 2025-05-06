export interface CreateStreamBody {
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface SendGiftBody {
  senderId: number;
  giftId: number;
  price: number;
  amount: number;
}
