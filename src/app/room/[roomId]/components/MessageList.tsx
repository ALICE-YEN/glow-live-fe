"use client";
import { DisplayMessageType } from "@/types/enum";

type ChatMessage = {
  id: string | number;
  displayType: DisplayMessageType;
  message: string;
  userName?: string;
};

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="overflow-y-auto flex flex-col space-y-1 px-2 pb-2 max-h-[40vh]">
      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={`text-xs md:text-sm px-3 py-1 w-fit max-w-full rounded-md
            ${
              msg.displayType === DisplayMessageType.System
                ? "bg-transparent text-gray-400 mx-auto italic"
                : "bg-chat-bubble-mobile md:bg-chat-bubble-desktop text-foreground-dark md:text-foreground"
            }`}
        >
          {msg.displayType === DisplayMessageType.User ? (
            <span>
              {msg.userName}：<strong>{msg.message}</strong>
            </span>
          ) : (
            <span>{msg.message}</span>
          )}
        </div>
      ))}
    </div>
  );
}
