import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetMessageProps {
  messageId: Id<"messages">;
}

const UseGetMessage = ({ messageId }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, { messageId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default UseGetMessage;
