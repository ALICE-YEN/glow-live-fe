import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

export default function useHostWebRTC(
  localStream: MediaStream | null,
  streamId: number,
  socketRef: React.MutableRefObject<Socket | null>
) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!localStream || !socketRef.current) return;

    const socket = socketRef.current;

    const pc = new RTCPeerConnection({
      // ICE（Interactive Connectivity Establishment）就像一個「試所有可行通道」的機制，幫助彼此找出一條可以傳資料的路。
      iceServers: [
        // 這是一個免費的 Google STUN 伺服器，它幫你找出自己在 NAT/路由器後面的 public IP，不需自己架設，適合開發初期使用，真正上線時可能會需要 TURN 伺服器來 relay 視訊資料（打不通時）
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // 把 audio + video 都加入 WebRTC 傳輸用
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    peerConnectionRef.current = pc;

    console.log("📡 WebRTC 連線建立完成，已加入 local tracks");

    // 建立 SDP offer
    const startOffer = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 傳送 offer 到 signaling server
      socket.emit("offer", {
        streamId,
        sdp: offer.sdp, //  Session Description Protocol，WebRTC 使用它來「描述連線的能力」，內容非常長，描述了音訊編碼、影像格式、候選位址（ICE）等
        type: offer.type, //  "offer" 還是 "answer"
      });

      console.log("📤 Host WebRTC: offer sent");
    };

    socket.emit(
      "joinRoom",
      {
        streamId,
        userId: 1,
        userName: "streamer01",
      },
      () => {
        console.log("✅ Host joined room, now sending offer...");
        startOffer(); // 確保 server 端完成 joinRoom 才開始 offer
      }
    );

    return () => {
      pc.close();
      peerConnectionRef.current = null;
    };
  }, [localStream, socketRef, streamId]);

  return {
    peerConnection: peerConnectionRef.current,
  };
}
