import { UseCreateMessage } from "@/features/messages/api/use-create-message";
import UseChannelId from "@/hooks/use-channel-id";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = UseWorkspaceId();
  const channelId = UseChannelId();

  const { mutate: createMessage } = UseCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      await createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        { throwError: true }
      );
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
