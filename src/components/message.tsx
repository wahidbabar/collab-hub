import React from "react";
import { Doc, Id } from "@/convex_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./hint";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";
import { UseUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UseDeleteMessage } from "@/features/messages/api/use-delete-message";
import UseConfirm from "@/hooks/use-confirm";
import { UseToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import ThreadBar from "./thread-bar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | null | undefined;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadName?: string;
  threadImage?: string;
  threadTimestamp?: number;
}

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  threadCount,
  threadName,
  threadImage,
  threadTimestamp,
  hideThreadButton,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();

  const [ConfirmDialog, confirm] = UseConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );

  const { mutate: toggleReaction, isPending: togglingReaction } =
    UseToggleReaction();
  const { mutate: updateMessage, isPending: updatingMessage } =
    UseUpdateMessage();
  const { mutate: deleteMessage, isPending: deletingMessage } =
    UseDeleteMessage();

  const isPending = updatingMessage || togglingReaction;

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      { messageId: id, body },
      {
        onSuccess() {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError() {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDeleteMessage = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMessage(
      { messageId: id },
      {
        onSuccess() {
          toast.success("Message deleted");

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError() {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleToggleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError() {
          toast.error("Failed to set reaction");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[[#f2c74433]]",
            deletingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200 "
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdateMessage}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    {"(edited)"}
                  </span>
                ) : null}
                <Reactions
                  reactions={reactions}
                  onChange={handleToggleReaction}
                />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {isEditing || (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDeleteMessage}
              handleReaction={handleToggleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[[#f2c74433]]",
          deletingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200 "
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>
                {authorName.charAt(0).toLowerCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdateMessage}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold text-primary hover:underline"
                  onClick={() => onOpenProfile(memberId)}
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">
                  {"(edited)"}
                </span>
              ) : null}
              <Reactions
                reactions={reactions}
                onChange={handleToggleReaction}
              />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDeleteMessage}
            handleReaction={handleToggleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
