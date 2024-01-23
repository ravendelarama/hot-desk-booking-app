"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addFloor } from "@/actions/actions";
import { toast } from "@/components/ui/use-toast";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { HiOutlineUpload } from "react-icons/hi";

function AddFloor() {
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
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

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="flex justify-center items-center p-10 border border-dashed border-[#53BDFF] rounded-md w-full"
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
      <Input
        placeholder="Floor name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"}>Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant={"success"}
            onClick={async () => {
              const image = startUpload(files);
              if (image) {
                await addFloor(name, image);
              }
            }}
          >
            Continue
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

export default AddFloor;
