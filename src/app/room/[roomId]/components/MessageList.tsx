"use client";
export default function MessageList({ messages }: { messages: string[] }) {
  return (
    <div className="overflow-y-auto flex flex-col space-y-1 px-2 pb-2 max-h-[40vh]">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="bg-chat-bubble-mobile md:bg-chat-bubble-desktop text-foreground-dark md:text-foreground text-xs md:text-sm rounded-md px-3 py-1 w-fit max-w-full"
        >
          {msg}
        </div>
      ))}
    </div>
  );
}
