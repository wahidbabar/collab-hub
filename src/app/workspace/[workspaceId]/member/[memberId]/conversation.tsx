import { Id } from "@/convex_generated/dataModel";
import useGetMember from "@/features/members/api/use-get-member";
import { UseGetMessages } from "@/features/messages/api/use-get-messages";
import UseMemberId from "@/hooks/use-member-id ";
import { AlertTriangle, Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import MessageList from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";

interface ConversationProps {
  conversationId: Id<"conversations">;
}

const Conversation = ({ conversationId }: ConversationProps) => {
  const memberId = UseMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({ memberId });
  const { results, status, loadMore } = UseGetMessages({ conversationId });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member.user.name}
        memberImage={member.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member.user.image}
        memberName={member.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member.user.name}`}
        conversationId={conversationId}
      />
    </div>
  );
};

export default Conversation;
