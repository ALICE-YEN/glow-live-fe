"use client";
export default function ChatInput() {
  return (
    <div className="flex gap-2 p-2 w-full">
      <input
        type="text"
        placeholder="輸入訊息..."
        className="flex-1 bg-chat-input-bg-mobile md:bg-chat-input-bg-desktop text-foreground-dark md:text-foreground placeholder:text-chat-placeholder rounded-md px-3 py-2 text-sm focus:outline-none"
      />
      <button className="px-4 py-2 bg-chat-button rounded-md text-sm hover:bg-chat-button-hover active:bg-chat-button-active">
        送出
      </button>
    </div>
  );
}
