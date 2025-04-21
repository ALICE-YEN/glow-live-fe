"use client";
import { useEffect, useRef, use } from "react";
// import Hls from "hls.js";
import VideoPlayer from "@/app/room/[roomId]/components/VideoPlayer";
import ChatBox from "@/app/room/[roomId]/components/ChatBox";
import EmojiPanel from "@/app/room/[roomId]/components/EmojiPanel";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { roomId } = use(params);

  useEffect(() => {
    const video = videoRef.current;
    // const hls = new Hls();
    // if (video) {
    //   hls.attachMedia(video);
    //   hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    //     hls.loadSource(`http://localhost:8000/live/${roomId}/index.m3u8`);
    //   });
    // }
    // return () => hls.destroy();
  }, [roomId]);

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <VideoPlayer ref={videoRef} />
      </div>
      <div className="flex-shrink-0 max-h-52 overflow-y-auto">
        <ChatBox />
      </div>

      <div className="flex-shrink-0">
        <EmojiPanel />
      </div>
    </div>
  );
}
