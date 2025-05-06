import axios from "axios";
import type { CreateStreamBody, SendGiftBody } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createStream = async (body: CreateStreamBody) => {
  const { data } = await axios.post(`${BASE_URL}/streams/`, body);
  return data;
};

export const getLiveStreams = async () => {
  const { data } = await axios.get(`${BASE_URL}/streams?status=live`);
  return data;
};

export const getGifts = async () => {
  const { data } = await axios.get(`${BASE_URL}/gifts`);
  return data;
};

export const sendGift = async (streamId: number, body: SendGiftBody) => {
  const { data } = await axios.post(
    `${BASE_URL}/streams/${streamId}/gifts`,
    body
  );
  return data;
};
