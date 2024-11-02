import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const UseGetMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, parentMessageId, conversationId },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
