import { Id } from "@/convex_generated/dataModel";
import { useParams } from "next/navigation";

const UseMemberId = () => {
  const params = useParams();
  return params.memberId as Id<"members">;
};

export default UseMemberId;
