"use server";
import { auth } from "@clerk/nextjs/server";
// Every export in here becomes an endpoint
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { env } from "~/env";
import { cookies } from "next/headers";

const ut = new UTApi({
    token: env.UPLOADTHING_TOKEN,
});

export async function deleteFile(fileId:number){
    const session = await auth();
    
    if(!session.userId) throw new Error("Unauthorized");

    const [file] = await db
       .select().from(files_table)
       .where(and(eq(files_table.id, fileId), eq(files_table.owner_id, session.userId)));

    if(!file) return { error: "File not found" };

    const result = await ut.deleteFiles([file.url.replace("https://avsqy96xor.ufs.sh/f", "")]);
    console.log(result);

    const deletedFile = await db.delete(files_table).where(eq(files_table.id, fileId));
    console.log(deletedFile);

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function deleteFolder(folderId: number) {
    const session = await auth();
    
    if (!session.userId) throw new Error("Unauthorized");

    // Check if folder exists and belongs to user
    const [folder] = await db
        .select().from(folders_table)
        .where(and(eq(folders_table.id, folderId), eq(folders_table.owner_id, session.userId)));

    if (!folder) return { error: "Folder not found" };

    // Recursively delete all files and subfolders
    await deleteFolderRecursive(folderId, session.userId);

    // Delete the folder itself
    await db.delete(folders_table).where(eq(folders_table.id, folderId));

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

async function deleteFolderRecursive(folderId: number, userId: string) {
    // Get all files in this folder
    const files = await db
        .select().from(files_table)
        .where(and(eq(files_table.parent, folderId), eq(files_table.owner_id, userId)));

    // Delete all files from uploadthing and database
    for (const file of files) {
        try {
            await ut.deleteFiles([file.url.replace("https://avsqy96xor.ufs.sh/f", "")]);
        } catch (error) {
            console.error("Error deleting file from uploadthing:", error);
        }
        await db.delete(files_table).where(eq(files_table.id, file.id));
    }

    // Get all subfolders
    const subfolders = await db
        .select().from(folders_table)
        .where(and(eq(folders_table.parent, folderId), eq(folders_table.owner_id, userId)));

    // Recursively delete subfolders
    for (const subfolder of subfolders) {
        await deleteFolderRecursive(subfolder.id, userId);
        await db.delete(folders_table).where(eq(folders_table.id, subfolder.id));
    }
}