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

    // 收到遠端媒體資料，加入 remoteStream
    pc.ontrack = (event) => {
      // 直接用 event.streams[0]，避免重複 addTrack
      setRemoteStream(event.streams[0]);
    };

    // 收集本地 ICE candidate，傳給 signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          streamId,
          candidate: event.candidate,
        });
      }
    };

    // 處理來自主播的 ICE candidate
    const handleRemoteCandidate = ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
          console.error("添加 ICE 候選失敗:", e)
        );
      }
    };
    socket.on("ice-candidate", handleRemoteCandidate);

    // 當 socket 收到 SDP offer（來自主播）後建立 answer
    const handleOffer = async ({
      sdp,
      type,
    }: {
      sdp: string;
      type: string;
    }) => {
      await pc.setRemoteDescription(new RTCSessionDescription({ sdp, type }));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        streamId,
        sdp: answer.sdp,
        type: answer.type,
      });
    };
    socket.on("offer", handleOffer);

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
