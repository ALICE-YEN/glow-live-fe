import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Connected to socket", socketRef.current?.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Disconnected from socket");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
}
