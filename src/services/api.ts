import axios from "axios";
import type {
  CreateStreamBody,
  CreateChatBody,
  SendGiftBody,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createStream = async (body: CreateStreamBody) => {
  const { data } = await axios.post(`${BASE_URL}/streams/`, body);
  return data;
};

export const getLiveStreams = async () => {
  const { data } = await axios.get(`${BASE_URL}/streams`);
  return data;
};

export const createChat = async (streamId: number, body: CreateChatBody) => {
  const { data } = await axios.post(
    `${BASE_URL}/streams/${streamId}/chats`,
    body
  );
  return data;
};

export const getChats = async (streamId: number) => {
  const { data } = await axios.get(`${BASE_URL}/streams/${streamId}/chats`);
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
