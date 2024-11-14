import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetChannelsProps {
  workspaceId: Id<"workspaces">;
}

const useGetChannels = ({ workspaceId }: useGetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetChannels;
