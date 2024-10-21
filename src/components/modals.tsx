"use client";

import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import React, { useEffect, useState } from "react";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
