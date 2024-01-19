"use client";

import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

function ImageUploader({
  handleChange,
}: {
  handleChange: (file: any) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm">Image</p>
      <FileUploader
        handleChange={handleChange}
        name="image"
        multiple={false}
        types={fileTypes}
      />
    </div>
  );
}

export default ImageUploader;
