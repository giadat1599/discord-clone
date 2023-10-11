"use client";

import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { MemberRoleTootip } from "../member-role-tootip";
import Link from "next/link";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();

  const onNavigate = () => {};
  return (
    <Link
      href={`/servers/${server.id}/conversations/${member.id}`}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        {
          "bg-zinc-700/20 dark:bg-zinc-700": params?.memberId === member.id,
        }
      )}
      onClick={onNavigate}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          {
            "text-primary dark:text-zinc-200 dark:group-hover:text-white":
              params?.memberId === member.id,
          }
        )}
      >
        {member.profile.name}
      </p>
      <MemberRoleTootip role={member.role} />
    </Link>
  );
};
