"use client";

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
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
