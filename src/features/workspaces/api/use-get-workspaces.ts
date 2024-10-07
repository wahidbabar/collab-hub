import { api } from "@/convex_generated/api";
import { useQuery } from "convex/react";

export const UseGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  return { data, isLoading };
};
