"use client";

import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import React from "react";

const WorkspacePage = () => {
  const workspaceId = UseWorkspaceId();

  return <div>Workspace Page</div>;
};

export default WorkspacePage;
