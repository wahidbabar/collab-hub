import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseResetJoinCode } from "@/features/workspaces/api/use-reset-join-code";
import UseConfirm from "@/hooks/use-confirm";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspaceName: string;
  joinCode: string;
}

const InviteModal = ({
  open,
  setOpen,
  workspaceName,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = UseWorkspaceId();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const { mutate, isPending } = UseResetJoinCode();

  const handleResetCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess() {
          toast.success("Invite code regenerated");
        },
        onError() {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {workspaceName}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              variant="ghost"
              size="sm"
              onClick={handleResetCode}
            >
              New code <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;