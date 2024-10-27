import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetChannelProps {
  channelId: Id<"channels">;
}

const UseGetChannel = ({ channelId }: UseGetChannelProps) => {
  const data = useQuery(api.channels.getById, { channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default UseGetChannel;
