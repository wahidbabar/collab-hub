import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}

export const UseGetWorkspaceInfo = ({ id }: UseGetWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
