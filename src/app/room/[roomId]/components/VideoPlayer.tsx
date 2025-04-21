// forwardRef 是讓「父元件可以直接取得子元件 DOM 節點的 ref」的一種方式。
// 這在需要直接操作 DOM 的情況下非常有用，例如在這個例子中，我們需要將 video 元件的 ref 傳遞給 HLS.js。

"use client";
import { forwardRef } from "react";

const VideoPlayer = forwardRef<HTMLVideoElement>((_, ref) => {
  return (
    <video
      ref={ref}
      controls
      className="w-full max-w-4xl aspect-video rounded-xl shadow-lg bg-gray-900"
    />
  );
});

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
