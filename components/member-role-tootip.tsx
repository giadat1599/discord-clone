"use client";

import { MemberRole } from "@prisma/client";

import { ActionTooltip } from "./action-tooltip";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface MemberRoleTootipProps {
  role: MemberRole;
}

const roleTooltipMap = {
  [MemberRole.GUEST]: "",
  [MemberRole.ADMIN]: "Admin",
  [MemberRole.MODERATOR]: "Moderator",
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const MemberRoleTootip = ({ role }: MemberRoleTootipProps) => {
  return (
    <ActionTooltip label={roleTooltipMap[role]}>
      {roleIconMap[role]}
    </ActionTooltip>
  );
};
