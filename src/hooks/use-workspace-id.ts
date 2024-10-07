import { Id } from "@/convex_generated/dataModel";
import { useParams } from "next/navigation";

const UseWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as Id<"workspaces">;
};

export default UseWorkspaceId;
