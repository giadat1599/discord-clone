"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

type FormType = z.infer<typeof formSchema>;

export const EditServerModal = () => {
  const router = useRouter();
  const { onClose, isOpen, type, data } = useModal();
  const { server } = data;

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isSubmitting = formMethods.formState.isSubmitting;

  useEffect(() => {
    if (server) {
      formMethods.setValue("name", server.name);
      formMethods.setValue("imageUrl", server.imageUrl);
    }
  }, [server, formMethods]);

  const onSubmit: SubmitHandler<FormType> = async (values) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      formMethods.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseModal = () => {
    formMethods.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen && type === "editServer"} onOpenChange={onCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center text-bold">
            Edit your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={formMethods.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={formMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs text-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
