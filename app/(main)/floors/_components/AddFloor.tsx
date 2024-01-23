"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addFloor, deleteImageByUrl } from "@/actions/actions";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { toast } from "@/components/ui/use-toast";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

function AddFloor() {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [selected, setSelected] = useState<boolean>(false);

  function handleChange(image: any) {
    setFile(image);
  }

  return (
    <div className="space-y-4">
      <div className="py-5 px-4">
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
      <Input
        placeholder="Floor name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant={"secondary"}
            onClick={async () => {
              if (file) {
                await deleteImageByUrl(file[0].key);
              }
            }}
          >
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant={"success"}
            onClick={async () => {
              await addFloor(name, file);
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
