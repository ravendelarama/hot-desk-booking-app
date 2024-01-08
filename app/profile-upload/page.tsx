"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { toast } = useToast();
  const { update } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          update({
            image: res[0].url,
          });

          toast({
            title: "User Profile",
            description: (
              <p>
                Image Uploaded, <Link href={res[0].url}>click here!</Link>
              </p>
            ),
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        className="p-10 border-none hover:border-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
      />
    </main>
  );
}
