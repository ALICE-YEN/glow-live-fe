"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import useIsMobile from "@/hooks/useIsMobile";
import useSocket from "@/hooks/useSocket";
import { DisplayMessageType } from "@/types/enum";
import VideoPlayer from "@/app/streams/[streamId]/components/VideoPlayer";
import MessageList from "@/app/streams/[streamId]/components/MessageList";
import ChatInput from "@/app/streams/[streamId]/components/ChatInput";
import EmojiPanel from "@/app/streams/[streamId]/components/EmojiPanel";

export default function Room({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = use(params);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const isMobile = useIsMobile();
  const socketRef = useSocket();

  useEffect(() => {
    if (!streamId) return;
    if (!socketRef.current) return;

    const socket = socketRef.current;
    // 發送 joinRoom 事件給後端
    socket.emit("joinRoom", {
      streamId: Number(streamId),
      userId: 1,
      userName: "streamer01",
    });

    return () => {
      // TODO: leaveRoom 判斷要更精準完整
      // 通知後端使用者離開房間，釋放資源，更新在線人數等
      socket.emit("leaveRoom", { streamId: Number(streamId) });
    };
  }, [streamId, socketRef]);

  const dummyMessages = [
    {
      id: 1,
      displayType: DisplayMessageType.User,
      userName: "觀眾 A",
      message: "這主播不錯耶",
    },
    {
      id: 2,
      displayType: DisplayMessageType.User,
      userName: "觀眾 B",
      message: "+1",
    },
    {
      id: 3,
      displayType: DisplayMessageType.User,
      userName: "觀眾 C",
      message: "我送了一個 🎁",
    },
    {
      id: 4,
      displayType: DisplayMessageType.User,
      userName: "觀眾 D",
      message: "🔥",
    },
    {
      id: 5,
      displayType: DisplayMessageType.System,
      message: "你已加入聊天室",
    },
    {
      id: 6,
      displayType: DisplayMessageType.User,
      userName: "觀眾 A",
      message: "這主播不錯耶",
    },
    {
      id: 7,
      displayType: DisplayMessageType.User,
      userName: "觀眾 B",
      message: "+1",
    },
    {
      id: 8,
      displayType: DisplayMessageType.System,
      message: "觀眾 C 加入了聊天室",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100svh] md:h-screen bg-background relative">
      {/* 左側 - 直播影片 */}
      <div
        className={`flex justify-center items-center p-4 w-full flex-grow transition-all duration-300
        ${!isMobile && isSidePanelOpen ? "md:w-2/3" : "md:w-full"}`}
      >
        <VideoPlayer
          streamUrl={`http://localhost:8000/live/${streamId}/index.m3u8`}
          // streamUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        />
      </div>

      {/* 右側 - 聊天室 */}
      <AnimatePresence>
        {!isMobile && isSidePanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 h-[50svh] md:h-full bg-chat-bg-desktop backdrop-blur-md shadow-lg p-4 relative z-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base md:text-lg font-bold text-white">
                聊天室
              </h2>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1">
                <MessageList messages={dummyMessages} />
              </div>
              <ChatInput />
              <EmojiPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <div className="absolute bottom-0 w-full h-[30vh] z-10 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 pt-2">
            <MessageList messages={dummyMessages} />
          </div>
          <ChatInput />
          <EmojiPanel />
        </div>
      )}

      {!isMobile && !isSidePanelOpen && (
        <>
          {/* 桌機版按鈕：右側中間，箭頭向左 */}
          <motion.button
            onClick={() => setIsSidePanelOpen(true)}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-chat-bg-desktop text-white p-2 rounded-l-lg shadow-lg cursor-pointer z-[20]"
            initial={{ scale: 1, x: 0 }}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </motion.button>
        </>
      )}
    </div>
  );
}
