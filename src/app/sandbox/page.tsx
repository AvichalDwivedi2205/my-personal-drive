import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import {mockFolders, mockFiles } from "~/lib/mock-data";    
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export default async function Sandbox(){
    const user = await auth();
    if(!user.userId){
        throw new Error("Unauthorized");
    }
    const folders = await db.select().from(folders_table).where(eq(folders_table.owner_id, user.userId));
    console.log(folders);
    return (
        <div>
            <form action={async () => {
                "use server";
                const user = await auth();
                if(!user.userId){
                    throw new Error("Unauthorized");
                }
                const rootFolder = await db.insert(folders_table).values({
                    name: "root",
                    owner_id: user.userId,
                    parent: null,
                }).$returningId();
                const insertFolders = mockFolders.map(folder => ({
                    name: folder.name,
                    owner_id: user.userId,
                    parent: rootFolder[0]!.id,
                    // ! is to say fuck you to typescript as we know it's not null
                }));
                console.log(insertFolders);
                await db.insert(folders_table).values(insertFolders);
                console.log("Folders created");
                // We will not insert files for now as we already have made the ability to add files
                // const insertFiles = mockFiles.map(file => ({
                //     name: file.name,
                //     owner_id: user.userId,
                //     parent: rootFolder[0]!.id,
                //     url: file.url,
                //     size: parseInt(file.size),
                //     // ! is to say fuck you to typescript as we know it's not null
                // }));
                // await db.insert(files_table).values(insertFiles);
            }}>
                <button type="submit">Create Files</button>
            </form>
        </div>
    )
}