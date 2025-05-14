import XIcon from "@heroicons/react/24/outline/XMarkIcon";

export default function CloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="absolute top-4 right-4 z-20 cursor-pointer"
      aria-label="關閉直播間"
      onClick={onClick}
    >
      <XIcon
        className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform"
        stroke="white"
        strokeWidth={2}
      />
    </button>
  );
}
