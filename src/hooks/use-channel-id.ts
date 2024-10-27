import { Id } from "@/convex_generated/dataModel";
import { useParams } from "next/navigation";

const UseChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};

export default UseChannelId;
