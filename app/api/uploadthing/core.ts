import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            // const session = await getSession();

            // if (!session?.user) throw new Error("Unauthorized");
            
            // return { userId: session?.user.id };
            return {};
    }).onUploadComplete(async ({ file }) => {
    //   console.log("Upload complete for userId:", metadata.userId);
 
        console.log("file url", file.url);

        
        
        // return { uploadedBy: metadata.userId };
        return {};
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;