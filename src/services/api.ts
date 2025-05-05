import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getLiveStreams = async () => {
  const { data } = await axios.get(`${BASE_URL}/streams`);
  return data;
};

export const getGifts = async () => {
  const { data } = await axios.get(`${BASE_URL}/gifts`);
  return data;
};
