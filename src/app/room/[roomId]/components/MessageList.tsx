"use client";
export default function MessageList({ messages }: { messages: string[] }) {
  return (
    <div className="overflow-y-auto flex flex-col space-y-1 px-2 pb-2 max-h-[40vh]">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="bg-white/90 md:bg-transparent md:text-white text-xs md:text-sm rounded-md px-3 py-1 w-fit max-w-full"
        >
          {msg}
        </div>
      ))}
    </div>
  );
}
