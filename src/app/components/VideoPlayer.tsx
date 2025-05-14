"use client";
import { useEffect, useRef } from "react";
import { useHlsVideo } from "@/hooks/useHlsVideo";

type Props =
  | { streamUrl: string; localStream?: never }
  | { streamUrl?: never; localStream: MediaStream };

export default function VideoPlayer({ streamUrl, localStream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (streamUrl) useHlsVideo(videoRef, streamUrl);

  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <video
      ref={videoRef}
      // controls
      autoPlay
      muted={!!localStream} // 本地攝影機預覽一定要 muted 才能 autoplay
      playsInline // 防止影片在 iOS 裝置上自動進入全螢幕
      className="w-full absolute top-0 left-0 h-full object-cover z-0
      md:max-w-6xl md:aspect-video md:rounded-xl md:shadow-lg md:relative 
      md:static md:h-auto md:object-contain"
    />
  );
}
