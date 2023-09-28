"use client";

import { MemberRole } from "@prisma/client";
import { PropsWithChildren } from "react";
import { ActionTooltip } from "./action-tooltip";

interface MemberRoleTootipProps extends PropsWithChildren {
  role: MemberRole;
}

const roleTooltipMap = {
  [MemberRole.GUEST]: "",
  [MemberRole.ADMIN]: "Admin",
  [MemberRole.MODERATOR]: "Moderator",
};

export const MemberRoleTootip = ({ role, children }: MemberRoleTootipProps) => {
  return <ActionTooltip label={roleTooltipMap[role]}>{children}</ActionTooltip>;
};
