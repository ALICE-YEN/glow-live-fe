"use client";
import { useRef } from "react";
import { useHlsVideo } from "@/hooks/useHlsVideo";

export default function VideoPlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useHlsVideo(videoRef, streamUrl);

  return (
    <video
      ref={videoRef}
      // controls
      autoPlay
      className="w-full absolute top-0 left-0 h-full object-cover z-0
      md:max-w-4xl md:aspect-video md:rounded-xl md:shadow-lg md:relative 
      md:static md:h-auto md:object-contain"
    />
  );
}
