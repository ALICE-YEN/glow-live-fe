"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import useCameraStream from "@/hooks/useCameraStream";
import useHostWebRTC from "@/hooks/useHostWebRTC";
import useIsMobile from "@/hooks/useIsMobile";
import useSocket from "@/hooks/useSocket";
import { getChats, createChat } from "@/services/api";
import type { CreateChatBody } from "@/types/api";
import { DisplayMessageType, ChatMessageType } from "@/types/enum";
import VideoPlayer from "@/app/components/VideoPlayer";
import MessageList from "@/app/components/MessageList";
import ChatInput from "@/app/components/ChatInput";
import CloseButton from "@/app/components/CloseButton";

export default function HostStream({
  params,
}: {
  params: Promise<{ streamId: number }>;
}) {
  const { streamId } = use(params);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const isMobile = useIsMobile();
  const socketRef = useSocket();
  const localStream = useCameraStream();
  const { peerConnection, endStream } = useHostWebRTC(
    localStream,
    Number(streamId),
    socketRef
  ); // 建立一個 WebRTC 連線實體（RTCPeerConnection），並把 localStream 加進去，準備推流給觀眾

  const router = useRouter();

  const {
    data: chats,
    // isLoading: chatsLoading,
    // error: chatsError,
  } = useQuery({
    queryKey: ["chats", streamId],
    queryFn: () => getChats(Number(streamId)),
    refetchOnWindowFocus: false, // 使用 WebSocket 來即時更新聊天訊息
  });

  const queryClient = useQueryClient();

  const createChatMutation = useMutation({
    mutationFn: (body: CreateChatBody) => {
      return createChat(Number(streamId), body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chats", streamId]);
      toast.success("建立聊天記錄成功！");
    },
    onError: (error) => {
      console.error("建立聊天記錄失敗：", error);
      toast.error("建立聊天記錄失敗，請稍後重試");
    },
  });

  const handleSendMessage = async (message: string) => {
    await createChatMutation.mutateAsync({
      content: message,
      type: ChatMessageType.Text,
    }); // ChatInput 目前只支援文字訊息
  };

  const handleEndStream = () => {
    endStream(); // 結束 WebRTC 連線
    const socket = socketRef.current;
    if (socket) {
      socket.emit("leaveRoom", { streamId: Number(streamId) });
    }
    router.push("/host/streams");
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100svh] md:h-screen relative">
      {isMobile && <CloseButton onClick={handleEndStream} />}

      {/* 左側 - 直播影片 */}
      <div
        className={`flex justify-center items-center p-4 w-full flex-grow transition-all duration-300
        ${!isMobile && isSidePanelOpen ? "md:w-2/3" : "md:w-full"}`}
      >
        {localStream ? (
          <VideoPlayer localStream={localStream} />
        ) : (
          <p className="text-white">攝影機啟動中...</p>
        )}
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
                <XIcon className="w-6 h-6 hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1">
                <MessageList messages={chats} />
              </div>
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <div className="absolute bottom-0 w-full h-[30vh] z-10 flex flex-col pb-2">
          <div className="flex-1 overflow-y-auto px-4">
            <MessageList messages={chats} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
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
