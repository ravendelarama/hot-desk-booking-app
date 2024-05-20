"use client";

"use client";

import { getAvatar, updateAvatar } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback, useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

export default function AvatarModal() {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      const src = res[0].url.split("/");
      setImage(src[src.length - 1]);

      await updateAvatar(image);
      toast({
        title: "Avatar",
        description: "Updated Successfully!",
      });
    },
    onUploadError: () => {
      toast({
        variant: "destructive",
        title: "Avatar",
        description: "Uploading Failed!",
      });
    },
    onUploadBegin: () => {
      toast({
        title: "Avatar",
        description: "Updated Successfully!",
      });
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const { data: session } = useSession();
  const { data: avatar } = useQuery({
    queryKey: ["avatar"],
    queryFn: async () => {
      return await getAvatar();
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Avatar>
            <AvatarImage src={avatar?.image!} />
            <AvatarFallback>
              {session?.user?.firstName.charAt(0)}
              {session?.user?.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avatar</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          {files.length > 0 && files[0].name ? (
            <div className="w-full py-10 flex justify-center items-center">
              <Button
                variant={"default"}
                onClick={() => {
                  startUpload(files);
                }}
              >
                Upload {files[0].name}
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="mt-2 flex justify-center items-center p-10 border border-dashed border-[#53BDFF] rounded-full w-full"
            >
              <input {...getInputProps()} />
              <div className="w-full flex flex-col justify-center items-center gap-3">
                <h3 className="text-2xl font-bold">
                  <HiOutlineUpload className="h-12 w-12 text-[#53BDFF] text-center" />
                </h3>
                <h4 className="text-center text-sm">Drop files here!</h4>
                <p>{files.length > 0 && files[0].name}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
