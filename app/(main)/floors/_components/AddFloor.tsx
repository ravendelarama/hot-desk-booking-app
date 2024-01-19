"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addFloor } from "@/actions/actions";

function AddFloor() {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<any>(null);

  function handleChange(image: any) {
    setFile(image);
  }

  return (
    <>
      <Input
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <ImageUploader handleChange={handleChange} />
      <Button
        onClick={async () => {
          await addFloor(name, file as File);
        }}
      >
        Create a floor
      </Button>
    </>
  );
}

export default AddFloor;
