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

    // 1. 把 audio + video 都加入 WebRTC 傳輸用
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    console.log("📡 WebRTC 連線建立完成，已加入 local tracks");

    // 2. 收集本地 ICE candidate，傳給 signaling server
    pc.onicecandidate = (event) => {
      console.log("📨 主播收集 ICE candidate", event);
      if (event.candidate) {
        socket.emit("ice-candidate", {
          streamId,
          candidate: event.candidate,
        });
      }
    };

    // 3. 準備接收觀眾回傳的 answer（先綁定好事件監聽器）
    const handleAnswer = async ({
      sdp,
      type,
    }: {
      sdp: string;
      type: string;
    }) => {
      await pc.setRemoteDescription(new RTCSessionDescription({ sdp, type })); // 接收對方配合的 SDP

      console.log("✅ 主播完成 setRemoteDescription(answer)");
    };
    socket.on("answer", handleAnswer);

    const sendOffer = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer); // 設定自己產生的 SDP

      // 傳送 offer 到 signaling server
      socket.emit("offer", {
        streamId,
        sdp: offer.sdp, //  Session Description Protocol，WebRTC 使用它來「描述連線的能力」，內容非常長，描述了音訊編碼、影像格式、候選位址（ICE）等
        type: offer.type, //  "offer" 還是 "answer"
      });

      console.log("📤 Host offer 已送出");
    };

    // 4. 有新觀眾加入時，主動重新送出 offer
    const handleNewViewer = () => {
      console.log("👀 有新觀眾加入，重新送出 offer");
      sendOffer(); // 使用共用函式重新送出 offer
    };
    socket.on("new-viewer", handleNewViewer);

    // 5. 接收觀眾端的 ICE candidate，加入 PeerConnection
    const handleRemoteCandidate = ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (candidate) {
        console.log("📥 主播收到 remote ICE candidate");
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
          console.error("❌ 主播加入 ICE 失敗:", e)
        );
      }
    };
    socket.on("ice-candidate", handleRemoteCandidate);

    // 5. 先加入房間，再開始送出 offer
    socket.emit(
      "joinRoom",
      {
        streamId,
        userId: 1,
        userName: "streamer01",
      },
      () => {
        console.log("✅ Host 已加入房間");
        sendOffer(); // 確保 server 端完成 joinRoom 才開始 offer
      }
    );

    peerConnectionRef.current = pc;

    // 6. 清理
    return () => {
      pc.close();
      peerConnectionRef.current = null;
      socket.off("answer", handleAnswer);
      socket.off("new-viewer", handleNewViewer);
      socket.off("ice-candidate", handleRemoteCandidate);
    };
  }, [localStream, socketRef, streamId]);

  return {
    peerConnection: peerConnectionRef.current,
  };
}
