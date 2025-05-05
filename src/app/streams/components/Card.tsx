"use client";

import { useRouter } from "next/navigation";

interface CardProps {
  id: number;
  src: string;
  title?: string;
}

export default function Card({ id, title, src }: CardProps) {
  const router = useRouter();

  return (
    <div
      className="rounded-lg overflow-hidden cursor-pointer group"
      onClick={() => router.push(`/streams/${id}`)}
    >
      <div className="relative w-full h-[224px]">
        <img
          src={src}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-sm font-semibold truncate">{title}</p>
        </div>
      </div>
    </div>
  );
}
