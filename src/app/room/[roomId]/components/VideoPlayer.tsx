"use client";
import { useRef } from "react";
import { useHlsVideo } from "@/hooks/useHlsVideo";

export default function VideoPlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useHlsVideo(videoRef, streamUrl);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full max-w-4xl aspect-video rounded-xl shadow-lg bg-gray-900"
    />
  );
}
