import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { z } from "zod";

const f = createUploadthing();



// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
  .input(z.object({
    folderId: z.number(),
  }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({input}) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError("Unauthorized");
      const folder = await QUERIES.getFolderById(input.folderId);
      if(!folder){
        throw new UploadThingError("Folder not found");
      }
      if(folder.owner_id !== user.userId){
        throw new UploadThingError("Unauthorized");
      }
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      await MUTATIONS.createFile({
        file:{
          name:file.name,
          size:file.size,
          url:file.ufsUrl,
          parent:metadata.parentId,
        },
        userId:metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Order is this
// User clicks button
// A request is made to mu server to make sure they are allowed to upload
// Once done, it sends a url to the user. they do not see it and it just runs in the client side code where the file gets sent to
// The user then sends the file to the url and then the upload is completed