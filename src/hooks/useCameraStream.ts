import { useState, useEffect } from "react";

export default function useCameraStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(stream);

        // ⏩ TODO: 後續這個 stream 要傳給 WebRTC PeerConnection
      } catch (err) {
        console.error("無法存取攝影機與麥克風", err);
      }
    };

    startCamera();
  }, []);

  return stream;
}
