import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetMembersProps {
  workspaceId: Id<"workspaces">;
}

const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetMembers;
