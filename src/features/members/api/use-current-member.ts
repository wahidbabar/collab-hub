import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface useCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}

export const useCurrentMember = ({ workspaceId }: useCurrentMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
