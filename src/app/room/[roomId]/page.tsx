"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import useIsMobile from "@/hooks/useIsMobile";
import VideoPlayer from "@/app/room/[roomId]/components/VideoPlayer";
import MessageList from "@/app/room/[roomId]/components/MessageList";
import ChatInput from "@/app/room/[roomId]/components/ChatInput";
import EmojiPanel from "@/app/room/[roomId]/components/EmojiPanel";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const isMobile = useIsMobile();

  const dummyMessages = [
    "觀眾 A：這主播不錯耶",
    "觀眾 B：+1",
    "觀眾 C：我送了一個 🎁",
    "觀眾 D：🔥",
    "觀眾 A：這主播不錯耶",
    "觀眾 B：+1",
    "觀眾 C：我送了一個 🎁",
    "觀眾 D：🔥",
  ];

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100svh] md:h-screen bg-background relative">
      {/* 左側 - 直播影片 */}
      <div
        className={`flex justify-center items-center p-4 w-full flex-grow transition-all duration-300
        ${!isMobile && isSidePanelOpen ? "md:w-2/3" : "md:w-full"}`}
      >
        <VideoPlayer
          // streamUrl={`http://localhost:8000/live/${roomId}/index.m3u8`}
          streamUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
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
