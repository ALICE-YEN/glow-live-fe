"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { createStream } from "@/services/api";
import type { CreateStreamBody } from "@/types/api";

export default function Header() {
  const [showDetailedHeader, setShowDetailedHeader] = useState(false);

  const queryClient = useQueryClient();

  const router = useRouter();

  const createStreamMutation = useMutation({
    mutationFn: (body: CreateStreamBody) => createStream(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["streams"]);
      toast.success("建立直播成功！");
      router.push(`/host/streams/${response.id}`);
    },
    onError: (error) => {
      console.error("建立直播失敗：", error);
      toast.error("建立直播失敗，請稍後重試");
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowDetailedHeader(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreateStream = () => {
    const body: CreateStreamBody = {
      title: "新直播",
      // description: "",
      // thumbnailUrl: "",
    };
    createStreamMutation.mutate(body);
  };

  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full z-10 duration-300 mx-auto flex justify-between items-center px-6 sm:px-10 lg:px-16 ${
          showDetailedHeader
            ? "bg-background shadow border-b border-foreground py-2.5"
            : "bg-transparent py-10 sm:py-16"
        }`}
      >
        <Link
          href="/streams"
          className={`font-bold transition-transform duration-300 ${
            showDetailedHeader
              ? "translate-y-0 text-xl lg:text-2xl"
              : "text-2xl sm:text-3xl lg:text-4xl"
          }`}
        >
          Glow Live
        </Link>

        <motion.button
          className="px-3 py-2 sm:text-lg font-bold rounded-full border cursor-pointer"
          onClick={handleCreateStream}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="mx-auto max-w-[1000px]">開起直播 →</div>
        </motion.button>
      </header>
    </div>
  );
}
