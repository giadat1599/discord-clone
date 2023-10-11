"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import Link from "next/link";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <Link
        className="group relative flex items-center"
        href={`/servers/${id}`}
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            {
              "group-hover:h-[20px] h-[8px]": params?.serverId !== id,
              "h-[36px]": params?.serverId === id,
            }
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            {
              "bg-primary/10 text-primary rounded-[16px]":
                params?.serverId === id,
            }
          )}
        >
          <Image fill src={imageUrl} alt="Server" />
        </div>
      </Link>
    </ActionTooltip>
  );
};
