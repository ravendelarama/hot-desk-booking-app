"use client";

"use client";

import { getAvatar, getCurrentUser, updateAvatar } from "@/actions/user";
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
import { MdModeEdit } from "react-icons/md";
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

      await updateAvatar(src[src.length - 1]);
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

  const { data: currentUser } = useQuery({
    queryKey: ["avatar"],
    queryFn: async () => {
      return await getCurrentUser();
    },
    refetchInterval: 1000 * 10,
  });

  return (
    <div className="flex justify-start items-center gap-10">
      <Dialog>
        <DialogTrigger className="relative">
          <div className="relative">
            <Avatar className="w-[6rem] h-[6rem]">
              <AvatarImage
                className="w-full h-full object-cover"
                src={
                  !currentUser?.image?.includes("https")
                    ? `https://utfs.io/f/${currentUser?.image!}`
                    : currentUser?.image!
                }
              />
              <AvatarFallback>
                {currentUser?.firstName?.charAt(0)}
                {currentUser?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <MdModeEdit className="h-16 w-16 text-transparent transform duration-75 ease-in absolute top-[20%] right-[20%] hover:text-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avatar</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center items-center">
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
                className="mt-2 flex justify-center items-center p-10 border border-dashed border-[#53BDFF] rounded-full w-fit"
              >
                <input {...getInputProps()} />
                <div className="w-full flex flex-col justify-center items-center gap-3">
                  <h3 className="text-2xl font-bold">
                    <HiOutlineUpload className="h-12 w-12 text-[#53BDFF] text-center" />
                  </h3>
                  {/* <h4 className="text-center text-sm">Drop files here!</h4> */}
                  {files.length > 0 && <p>{files[0].name}</p>}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col h-full">
        <p className="text-foreground font-semibold text-lg">
          {currentUser?.firstName!} {currentUser?.lastName!}
        </p>
        <p className="text-foreground text-sm">{currentUser?.email!}</p>
      </div>
    </div>
  );
}
