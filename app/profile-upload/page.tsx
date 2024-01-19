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
      
    </main>
  );
}
