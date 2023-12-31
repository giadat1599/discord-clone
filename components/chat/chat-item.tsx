"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useRouter, useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAvatar } from "../user-avatar";
import { MemberRoleTootip } from "../member-role-tootip";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const formMethods = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const isMessageDeletable = !deleted && (isAdmin || isModerator || isOwner);
  const isMessageEditable = !deleted && isOwner && !fileUrl;
  const isFilePDF = fileUrl && fileType === "pdf";
  const isFileImage = fileUrl && !isFilePDF;
  const isSubmiting = formMethods.formState.isSubmitting;

  const onMemberCLick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onUpdateMessage: SubmitHandler<FormType> = async (data) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, data);
      formMethods.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    formMethods.reset({
      content,
    });
  }, [content, formMethods]);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={() => onMemberCLick()}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={() => onMemberCLick()}
              >
                {member.profile.name}
              </p>
              <MemberRoleTootip role={member.role} />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isFileImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isFilePDF && (
            <div>
              <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                  PDF File
                </a>
              </div>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn("text-sm text-zinc-600 dark:text-zinc-300", {
                "italic text-zinc-500 dark:text-zinc-400 text-sm mt-1": deleted,
              })}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit(onUpdateMessage)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={formMethods.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isSubmiting}
                            {...field}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isSubmiting}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {isMessageDeletable && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-md">
          {isMessageEditable && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
