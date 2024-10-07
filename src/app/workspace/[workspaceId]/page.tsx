import React from "react";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspacePage = ({ params: { workspaceId } }: WorkspacePageProps) => {
  return <div>Workspace Id: {workspaceId}</div>;
};

export default WorkspacePage;
