import { Button } from "@/components/ui/button";
import { Id } from "@/convex_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import UseGetMessage from "../api/use-get-message";
import Message from "@/components/message";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import { UseCreateMessage } from "../api/use-create-message";
import { UseGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import UseChannelId from "@/hooks/use-channel-id";
import Quill from "quill";
import { toast } from "sonner";
import { UseGetMessages } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format } from "date-fns";
import { formatDateLabel } from "@/components/message-list";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const channelId = UseChannelId();
  const workspaceId = UseWorkspaceId();

  const { results, status, loadMore } = UseGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  const { data: currentMember } = UseCurrentMember({ workspaceId });
  const { data: message, isLoading: messageLoading } = UseGetMessage({
    messageId,
  });

  const { mutate: generateUploadUrl } = UseGenerateUploadUrl();
  const { mutate: createMessage } = UseCreateMessage();

  const editorRef = useRef<Quill | null>(null);

  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        parentMessageId: messageId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (messageLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 store-[1.5] " />
          </Button>
        </div>
        <div className="flex my-auto items-center justify-center">
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
        <div className="flex flex-col gap-y-2 my-auto items-center justify-center">
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
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];
              const isCompact =
                !!previousMessage &&
                previousMessage?.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(previousMessage._creationTime)
                ) < TIME_THRESHOLD;
              return (
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
                  threadCount={message.threadCount}
                  threadName={message.threadName}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                  isEditing={editingId === message._id}
                  isCompact={isCompact}
                  setEditingId={setEditingId}
                  hideThreadButton
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
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
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          placeholder="Reply..."
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};

export default Thread;
