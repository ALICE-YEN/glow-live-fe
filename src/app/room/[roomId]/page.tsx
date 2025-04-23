"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import useIsMobile from "@/hooks/useIsMobile";
import VideoPlayer from "@/app/room/[roomId]/components/VideoPlayer";
import ChatBox from "@/app/room/[roomId]/components/ChatBox";
import EmojiPanel from "@/app/room/[roomId]/components/EmojiPanel";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100svh] md:h-screen bg-gray-900 relative">
      {/* 左側 - 直播影片 */}
      <div
        className={`flex justify-center items-center p-4 w-full flex-grow transition-all duration-300
        ${isSidePanelOpen ? "md:w-2/3" : "md:w-full"}`}
      >
        <VideoPlayer
          streamUrl={`http://localhost:8000/live/${roomId}/index.m3u8`}
        />
      </div>

      {/* 右側 - 聊天室 */}
      <AnimatePresence>
        {isSidePanelOpen ? (
          <motion.div
            initial={{
              opacity: 0,
              y: isMobile ? 100 : 0,
              x: isMobile ? 0 : 100,
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, y: isMobile ? 100 : 0, x: isMobile ? 0 : 100 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 h-[50svh] md:h-full bg-black/60 backdrop-blur-md shadow-lg p-4 overflow-y-auto relative z-10"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base md:text-lg font-bold">聊天室</h2>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <ChatBox />

            <div className="mt-4">
              <EmojiPanel />
            </div>
          </motion.div>
        ) : (
          <>
            {/* 桌機版按鈕：右側中間，箭頭向左 */}
            <motion.button
              onClick={() => setIsSidePanelOpen(true)}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg shadow-lg cursor-pointer z-[20] hidden md:block"
              initial={{ scale: 1, x: 0 }}
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </motion.button>

            {/* 手機版按鈕：底部中間，箭頭向上 */}
            <motion.button
              onClick={() => setIsSidePanelOpen(true)}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white p-2 rounded-t-lg shadow-lg cursor-pointer z-[20] md:hidden"
              initial={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <ChevronLeftIcon className="w-6 h-6 rotate-[90deg]" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
