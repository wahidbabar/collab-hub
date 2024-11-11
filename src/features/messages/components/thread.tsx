import { Button } from "@/components/ui/button";
import { Id } from "@/convex_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import React, { useState } from "react";
import UseGetMessage from "../api/use-get-message";
import Message from "@/components/message";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import UseWorkspaceId from "@/hooks/use-workspace-id";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = UseWorkspaceId();
  const { data: currentMember } = UseCurrentMember({ workspaceId });
  const { data: message, isLoading: messageLoading } = UseGetMessage({
    messageId,
  });

  if (messageLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 store-[1.5] " />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
        ;
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 store-[1.5] " />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 store-[1.5] " />
        </Button>
      </div>
      <Message
        key={message._id}
        id={message._id}
        memberId={message.memberId}
        authorImage={message.user.image}
        authorName={message.user.name}
        isAuthor={message.memberId === currentMember?._id}
        reactions={message.reactions}
        body={message.body}
        image={message.image}
        updatedAt={message.updatedAt}
        createdAt={message._creationTime}
        // threadCount={message.threadCount}
        // threadImage={message.threadImage}
        // threadTimestamp={message.threadTimestamp}
        isEditing={editingId === message._id}
        setEditingId={setEditingId}
        hideThreadButton
      />{" "}
    </div>
  );
};

export default Thread;
