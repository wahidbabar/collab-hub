import { Button } from "@/components/ui/button";
import { UseGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Info, Loader, Search } from "lucide-react";
import React, { useEffect } from "react";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = UseGetWorkspace({
    id: workspaceId,
  });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-2-[640px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <span className="text-white text-sm">Search {workspace?.name}</span>
          )}
        </Button>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
