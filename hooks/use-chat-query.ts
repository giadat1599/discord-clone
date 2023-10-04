import qs from "query-string";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import axios from "axios";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  param: {
    key: "channelId" | "conversationId";
    value: string;
  };
}

export const useChatQuery = ({ queryKey, apiUrl, param }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [param.key]: param.value,
        },
      },
      { skipNull: true }
    );
    const res = await axios.get(url);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
