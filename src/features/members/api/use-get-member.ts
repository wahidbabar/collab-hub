import { api } from "@/convex_generated/api";
import { Id } from "@/convex_generated/dataModel";
import { useQuery } from "convex/react";

interface useGetMemberProps {
  memberId: Id<"members">;
}

const UseGetMember = ({ memberId }: useGetMemberProps) => {
  const data = useQuery(api.members.getById, { memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default UseGetMember;
