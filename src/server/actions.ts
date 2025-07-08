"use server";
import { auth } from "@clerk/nextjs/server";
// Every export in here becomes an endpoint
import { db } from "./db";
import { files_table } from "./db/schema";
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