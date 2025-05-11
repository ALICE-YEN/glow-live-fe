import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

export default function useViewerWebRTC(
  streamId: number | null, // 用來在 signaling 傳遞中辨識是哪一場直播
  socketRef: React.MutableRefObject<Socket | null>
) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null); // 儲存 WebRTC 連線實例（持久化不隨 render 重建）
  const remoteStreamRef = useRef<MediaStream | null>(null); // 儲存從主播接收到的影音流（用於傳給 <video srcObject>）

  useEffect(() => {
    if (!streamId || !socketRef.current) return;

    const socket = socketRef.current;
    // 建立 WebRTC 連線，使用 Google 的免費 STUN server 幫助穿透 NAT（獲得 public IP）
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // 初始化狀態
    peerConnectionRef.current = pc;
    remoteStreamRef.current = new MediaStream();

    // 收到遠端媒體資料，加入 remoteStream（local MediaStream）
    pc.ontrack = (event) => {
      console.log("📥 收到遠端媒體 track", event);
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current?.addTrack(track);
      });
    };

    // 當 socket 收到 SDP offer（來自主播）後建立 answer
    socket.on("offer", async ({ sdp, type }) => {
      console.log("📨 收到 offer，準備建立連線");
      // 設定主播的 offer 為 remote description
      await pc.setRemoteDescription(new RTCSessionDescription({ sdp, type }));

      // 建立自己的 answer，並設為 local description
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 將 answer 傳給主播，完成 WebRTC 雙方握手
      socket.emit("answer", {
        streamId,
        sdp: answer.sdp,
        type: answer.type,
      });

      console.log("📤 answer 已送出");
    });

    return () => {
      pc.close();
      peerConnectionRef.current = null;
      remoteStreamRef.current = null;
      socket.off("offer");
    };
  }, [socketRef, streamId]);

  return {
    peerConnection: peerConnectionRef.current,
    remoteStream: remoteStreamRef.current,
  };
}
