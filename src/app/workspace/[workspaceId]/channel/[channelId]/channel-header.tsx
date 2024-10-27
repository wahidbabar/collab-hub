import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel";
import { UseUpdateChannel } from "@/features/channels/api/use-update-channel";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import UseChannelId from "@/hooks/use-channel-id";
import UseConfirm from "@/hooks/use-confirm";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface ChannelHeaderProps {
  channelName: string;
}

const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  const router = useRouter();
  const channelId = UseChannelId();
  const workspaceId = UseWorkspaceId();
  const [value, setValue] = useState(channelName);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDeleteDialog, confirmDelete] = UseConfirm(
    "Are you sure?",
    "This action is irreversible"
  );

  const { data: member } = UseCurrentMember({
    workspaceId,
  });
  const { mutate: updateChannel, isPending: updatingChannel } =
    UseUpdateChannel();
  const { mutate: deleteChannel, isPending: deletingChannel } =
    useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleUpdateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { channelId, name: value },
      {
        onSuccess() {
          toast.success("channel updated");
          setEditOpen(false);
        },
        onError() {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleDeleteChannel = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteChannel(
      {
        channelId,
      },
      {
        onSuccess() {
          router.replace(`/workspace/${workspaceId}`);
          toast.success("channel deleted");
        },
        onError() {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDeleteDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate"># {channelName}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {channelName}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleUpdateChannel}>
                    <Input
                      value={value}
                      disabled={updatingChannel}
                      onChange={handleChange}
                      required
                      autoFocus
                      min={3}
                      maxLength={80}
                      placeholder="e.g. 'plan-budget'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={updatingChannel}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={updatingChannel}>Save</Button>
                    </DialogFooter>
                  </form>{" "}
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  disabled={deletingChannel}
                  onClick={handleDeleteChannel}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ChannelHeader;
