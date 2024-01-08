import { getSession } from "@/lib/next-auth";
import prisma from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const session = await getSession();

        // If you throw, the user will not be able to upload
        if (!session?.user) throw new Error("Unauthorized");
    
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: session?.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
        console.log("file url", file.url);

        const profile = await prisma.user.update({
            where: {
                id: metadata.userId
            },
            data: {
                image: file.url
            }
        });
        

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;