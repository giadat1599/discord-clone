"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessagesSkeletonProps {
  number?: number;
}

export default function ChatMessagesSkeleton({
  number = 5,
}: ChatMessagesSkeletonProps) {
  return (
    <div className="flex flex-1 flex-col p-4 space-y-4">
      <div className="flex-1" />
      {new Array(number).fill(null).map((_, i) => (
        <div className="flex items-center space-x-4" key={i}>
          <Skeleton className="h-12 w-12 rounded-full dark:bg-zinc-700 bg-zinc-200" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] dark:bg-zinc-700 bg-zinc-200" />
            <Skeleton className="h-4 w-[200px] dark:bg-zinc-700 bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
