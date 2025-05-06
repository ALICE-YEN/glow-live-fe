"use client";
import { useEffect, useRef } from "react";
import { DisplayMessageType } from "@/types/enum";

type ChatMessage = {
  id: string | number;
  displayType?: DisplayMessageType; // 邏輯上預設是 user
  content: string;
  username?: string;
};

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex flex-col space-y-1 px-2 pb-2">
      {(messages ?? []).map((msg, i) => (
        <div
          key={msg.id}
          className={`text-xs md:text-sm px-3 py-1 w-fit max-w-full rounded-md
            ${
              msg.displayType === DisplayMessageType.System
                ? "bg-transparent text-gray-400 mx-auto italic"
                : "bg-chat-bubble-mobile md:bg-chat-bubble-desktop text-foreground-dark md:text-foreground"
            }`}
        >
          {msg.displayType === DisplayMessageType.System ? (
            <span>{msg.content}</span>
          ) : (
            <span>
              {msg.username}：<strong>{msg.content}</strong>
            </span>
          )}
        </div>
      ))}

      {/* 這是滾動定位用的底部元素 */}
      <div ref={bottomRef} />
    </div>
  );
}
