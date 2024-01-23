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
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import ImageUploader from "./ImageUploader";
import { useDropzone } from "react-dropzone";
import { UploadDropzone } from "@/utils/uploadthing";

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

  const [file, setFile] = useState<any>();
  const [selected, setSelected] = useState<boolean>(false);
  const { toast } = useToast();

  function handleChange(image: File) {
    setFile(file);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateFloor(data?.id, values.name, file);

    toast({
      title: "Updated Desk",
      description: "Desk updated successfully.",
    });
  }

  return (
    <>
      <div>
        <UploadDropzone
          className="py-10 px-20 rounded border border-slate-600"
          content={{
            button: "Select",
            allowedContent: selected ? file[0].name : "Floor map",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            setFile(res);
            setSelected(true);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast({
              title: "Uploading Failed!",
            });
          }}
        />
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
              <Button
                variant={"secondary"}
                onClick={async () => {
                  if (file) {
                    const res = await deleteImageByUrl(file[0].key);

                    if (res.success) {
                      toast({
                        description: "Canceled",
                      });
                    }
                  }
                }}
              >
                Cancel
              </Button>
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
