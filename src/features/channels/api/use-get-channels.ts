import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

interface UseGetChannelsProps {
  workspaceId: Id<"workspaces">;
}

const UseGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default UseGetChannels;
