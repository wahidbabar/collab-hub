import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetWorkspaceProps {
  id: Id<"workspaces">;
}

export const UseGetWorkspace = ({ id }: UseGetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
