import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}

export const useGetWorkspaceInfo = ({ id }: useGetWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
