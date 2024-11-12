"use client";

import React, { useEffect, useState } from "react";
import UseMemberId from "@/hooks/use-member-id ";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import { UseCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversations";
import { AlertTriangle, Loader } from "lucide-react";
import { Id } from "@/convex_generated/dataModel";
import { toast } from "sonner";
import Conversation from "./conversation";

const MemberIdPage = () => {
  const workspaceId = UseWorkspaceId();
  const memberId = UseMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = UseCreateOrGetConversations();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to get conversation");
        },
      }
    );
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return <Conversation conversationId={conversationId} />;
};

export default MemberIdPage;
