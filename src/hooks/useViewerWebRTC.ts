import { useEffect, useState, useRef } from "react";
import type { Socket } from "socket.io-client";

export default function useViewerWebRTC(
  streamId: number | null, // 用來在 signaling 傳遞中辨識是哪一場直播
  socketRef: React.MutableRefObject<Socket | null>
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!streamId || !socketRef.current) return;

    const socket = socketRef.current;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current = pc;
    const newStream = new MediaStream();
    setRemoteStream(newStream);

    // 1. 收到遠端媒體資料，加入 remoteStream
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("📥 Viewer 收到 remote track", stream);
      setRemoteStream(stream);
    };

    // 2. 收集本地 ICE candidate，傳給 signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("📤 Viewer ICE candidate:", event.candidate);
        socket.emit("ice-candidate", {
          streamId,
          candidate: event.candidate,
        });
      }
    };

    // 3. 處理來自主播的 ICE candidate
    const handleRemoteCandidate = ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (candidate) {
        console.log("📥 Viewer 收到 remote ICE candidate");
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
          console.error("❌ Viewer 加入 ICE 失敗:", e)
        );
      }
    };
    socket.on("ice-candidate", handleRemoteCandidate);

    // 4. 當 socket 收到 SDP offer（來自主播）後建立 answer
    const handleOffer = async ({
      sdp,
      type,
    }: {
      sdp: string;
      type: string;
    }) => {
      console.log("📨 Viewer 收到 offer");
      await pc.setRemoteDescription(new RTCSessionDescription({ sdp, type })); // 接收對方的 SDP

      const answer = await pc.createAnswer(); // 根據 offer 建立回答
      await pc.setLocalDescription(answer); // 設定我的配合連線方式

      // 傳回給主播，這裡的 answer 是一個 SDP，包含了我們的媒體格式、編碼方式、網路位址等資訊
      socket.emit("answer", {
        streamId,
        sdp: answer.sdp,
        type: answer.type,
      });
    };
    socket.on("offer", handleOffer);

    // 5. 清理
    return () => {
      pc.close();
      peerConnectionRef.current = null;
      socket.off("offer", handleOffer);
      socket.off("ice-candidate", handleRemoteCandidate);
      setRemoteStream(null);
    };
  }, [streamId, socketRef]);

  return {
    peerConnection: peerConnectionRef.current,
    remoteStream,
  };
}
