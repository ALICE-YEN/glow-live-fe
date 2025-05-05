"use client";
import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { throttle } from "lodash";
import { GiftDetail } from "@/types/interfaces";

export default function EmojiPanel({ gifts }: { gifts: GiftDetail[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<
    { id: number; emoji: string; x: number; y: number; offsetX: number }[]
  >([]);

  const handleClick = (gift: GiftDetail) => {
    triggerFloatingEmoji(gift);
    throttledSendGift(gift);
  };

  const triggerFloatingEmoji = (gift: GiftDetail) => {
    const id = Date.now();
    const offsetX = (Math.random() - 0.5) * 80;

    const button = buttonRefs.current[gift.id];
    const container = containerRef.current;

    if (button && container) {
      const btnRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const x = btnRect.left - containerRect.left + btnRect.width / 2;
      const y = btnRect.top - containerRect.top;

      setFloatingEmojis((prev) => [
        ...prev,
        { id, emoji: gift.emoji, x, y, offsetX },
      ]);

      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 700);
    }
  };

  const throttledSendGift = useMemo(() => {
    return throttle((gift: GiftDetail) => {
      console.log(`🎁 Sending gift: ${gift.emoji}`);
      // fetch('/api/send-gift', { method: 'POST', body: JSON.stringify({ emoji }) })
    }, 1000);
  }, []); // 每秒最多執行一次

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-2 flex-shrink-0">
      <div className="overflow-x-auto">
        <div className="flex min-w-fit justify-center gap-4" ref={containerRef}>
          {(gifts ?? []).map((gift, idx) => (
            <motion.button
              key={idx}
              ref={(el) => (buttonRefs.current[gift.id] = el)}
              onClick={() => handleClick(gift)}
              whileTap={{ scale: 1.3 }}
              whileHover={{ scale: 1.2 }}
              className="text-2xl md:text-3xl cursor-pointer select-none drop-shadow transition-transform"
            >
              {gift.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {floatingEmojis.map(({ id, emoji, x, y, offsetX }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: -100,
              x: offsetX,
              scale: 1.4,
            }}
            exit={{ opacity: 0, y: -140, scale: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute pointer-events-none text-3xl"
            style={{
              top: y,
              left: x,
              transform: "translate(-50%, 0%)",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
