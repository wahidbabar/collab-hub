import { Button } from "@/components/ui/button";
import UseWorkspaceId from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";

const sidebarItemVariance = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariance>["variant"];
}

const SidebarItem = ({
  label,
  id: channelId,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = UseWorkspaceId();
  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariance({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${channelId}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
