"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { CHAT_MAX_LENGTH } from "@/utils/constants";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      // toast.error("訊息不可為空");
      return;
    }
    if (trimmed.length > CHAT_MAX_LENGTH) {
      toast.error(`訊息不可超過 ${CHAT_MAX_LENGTH} 字`);
      return;
    }

    await onSendMessage(trimmed);

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    } else if (e.key === "Escape") {
      setMessage("");
    }
  };

  return (
    <div className="flex gap-2 p-2 w-full">
      <input
        type="text"
        placeholder="輸入訊息..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-chat-input-bg-mobile md:bg-chat-input-bg-desktop text-foreground-dark md:text-foreground placeholder:text-chat-placeholder rounded-md px-3 py-2 text-sm focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-chat-button rounded-md text-sm hover:bg-chat-button-hover hover:scale-105 transition-transform active:bg-chat-button-active cursor-pointer"
      >
        送出
      </button>
    </div>
  );
}
