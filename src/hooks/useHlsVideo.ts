import { useEffect, RefObject } from "react";
import Hls from "hls.js";

export function useHlsVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  streamUrl: string
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    // 當瀏覽器本身就支援 HLS（你可以用 canPlayType() 來檢查），你就可以直接把 .m3u8 的網址給 <video> 元素的 src，不需要使用 HLS.js。
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // .m3u8 的 MIME 類型是 application/vnd.apple.mpegurl
      // Safari（macOS、iOS）原生支援 .m3u8，效能更好，不需引入 HLS.js
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      // Chrome、Firefox、Edge 不支援原生 .m3u8，需要 HLS.js 幫忙解析
      const hls = new Hls();
      hls.attachMedia(video); // 將 HLS.js 附加到 video 元素
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(streamUrl);
      });
      return () => hls.destroy();
    }
  }, [videoRef, streamUrl]);
}
