import { api } from "@/convex_generated/api";
import { useQuery } from "convex/react";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  return { data, isLoading };
};
