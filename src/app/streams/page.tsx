"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiveStreams } from "@/services/api";
import { StreamDetail } from "@/types/interfaces";
import Header from "@/app/components/Header";
import Card from "./components/Card";

export default function Streams() {
  const {
    data: streams,
    isLoading,
    error,
  } = useQuery({ queryKey: ["streams"], queryFn: getLiveStreams });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto pt-28 sm:pt-40 px-10 sm:px-14 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {streams.map((stream: StreamDetail) => (
            <Card
              key={stream.id}
              id={stream.id}
              title={stream.title}
              src={`${process.env.NEXT_PUBLIC_URL}/stream-default.jpg`}
              // src={
              //   stream.thumbnail_url ||
              //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream-default.jpg`
              // }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
