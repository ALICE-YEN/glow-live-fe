"use client";

export default function StreamInfoBar({
  username,
  isFollowing,
  onFollow,
}: {
  username: string;
  isFollowing: boolean;
  onFollow: () => void;
}) {
  return (
    <div className="absolute top-4 left-4 z-20 flex items-center bg-black/30 md:bg-white/30 rounded-md px-4 py-2">
      <span className="text-white font-extrabold mr-3 cursor-pointer">
        {username}
      </span>
      {!isFollowing && (
        <button
          className="bg-white text-chat-button text-sm font-semibold px-3 py-1 rounded-md hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
          aria-label="追蹤主播"
          onClick={onFollow}
        >
          追蹤
        </button>
      )}
    </div>
  );
}
