"use client";

import UseGetChannel from "@/features/channels/api/use-get-channel";
import UseChannelId from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import ChannelHeader from "./channel-header";

const ChannelIdPage = () => {
  const channelId = UseChannelId();

  const { data: channel, isLoading: channelLoading } = UseGetChannel({
    channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channelName={channel.name} />
    </div>
  );
};

export default ChannelIdPage;
