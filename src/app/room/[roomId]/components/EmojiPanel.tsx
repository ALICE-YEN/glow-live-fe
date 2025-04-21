"use client";

const emojis = ["❤️", "🎁", "🔥", "👏"];

export default function EmojiPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex justify-center gap-4 flex-shrink-0">
      {emojis.map((emoji, idx) => (
        <button
          key={idx}
          className="text-xl transition-transform duration-150 hover:scale-125 hover:drop-shadow-lg"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
