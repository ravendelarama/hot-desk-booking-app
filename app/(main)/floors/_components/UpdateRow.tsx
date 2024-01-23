"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import {
  addFloor,
  deleteImageByUrl,
  mutateDesk,
  mutateFloor,
  mutateUser,
} from "@/actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { DeskStatus } from "@prisma/client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { HiOutlineUpload } from "react-icons/hi";

export const formSchema = z.object({
  name: z.string(),
});

function UpdateRow({
  data,
}: {
  data: {
    id: string;
    name: string;
    image?: string;
  };
}) {
  // file uploading to do, client error when calling the server action
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      alert("upload has begun");
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const image = startUpload(files);
    if (image) {
      await mutateFloor(data?.id, values.name, image);
    }

    toast({
      title: "Updated Desk",
      description: "Desk updated successfully.",
    });
  }

  return (
    <>
      <div
        {...getRootProps()}
        className="flex justify-center items-center p-10 border border-dashed border-[#53BDFF] rounded-md w-full"
      >
        <input {...getInputProps()} />
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <HiOutlineUpload className="h-12 w-12 text-[#53BDFF] text-center" />
          <h4 className="text-center text-sm">Drop files here!</h4>
          <p>{files.length > 0 && files[0].name}</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row justify-end gap-5 item-center">
            <DialogClose asChild>
              <Button variant={"secondary"}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"success"} type="submit">
                Save
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </>
  );
}

export default UpdateRow;
