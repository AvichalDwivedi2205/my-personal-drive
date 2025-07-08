import "server-only";

import { db } from "~/server/db";
import { 
  files_table as filesSchema, 
  folders_table as foldersSchema,
  type DB_FileType,
  type DB_FolderType,
} from "~/server/db/schema";
import { eq, asc, isNull, and } from "drizzle-orm";

export const QUERIES = {

    getAllParentsForFolder: async function (folderId:number) {
        const parents = [];
        let currentId: number | null = folderId;
        while(currentId!==null){
            const folder = await db
                .select()
                .from(foldersSchema)
                .where(eq(foldersSchema.id, currentId));
            if(!folder[0]){
                throw new Error("Folder not found");
            }
            parents.unshift(folder[0]);
            currentId = folder[0].parent;
        }
        return parents;
    },


    getFiles: function (folderId:number){
    return db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, folderId))
    .orderBy(asc(filesSchema.createdAt));
    },

    getFolders: function (folderId:number){
    return db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, folderId))
    .orderBy(asc(foldersSchema.createdAt));
    },

    getFolderById: async function (folderId:number){
        const folder = await db.select().from(foldersSchema).where(eq(foldersSchema.id, folderId));
        return folder[0];
    },

    getRootFolderForUser: async function (userId:string){
        const folder = await db
        .select()
        .from(foldersSchema)
        .where(and
            (eq(foldersSchema.owner_id, userId), 
            isNull(foldersSchema.parent)
        ));
        return folder[0];
    }
}

// This page cannot be static because folderId is a dynamic parameter
// and we need to fetch the files and folders for that folder

export const MUTATIONS = {
    createFile: async function (input: {file:{
        name:string;
        size:number;
        url:string;
        parent:number
    },
    userId:string
}) {
     return await db.insert(filesSchema).values(
        {
            ...input.file,
            owner_id: input.userId
        }
    );
    },

    onboardUser: async function (userId:string){
        const rootFolder = await db.insert(foldersSchema).values({
            name: "root",
            owner_id: userId,
            parent: null
        }).$returningId();

        const rootFolderId = rootFolder[0]!.id;
        await db.insert(foldersSchema).values([
        {
            name: "Your Mom's Pictures",
            owner_id: userId,
            parent: rootFolderId
        },
        {
            name: "Images",
            owner_id: userId,
            parent: rootFolderId
        },
        {
            name: "Documents",
            owner_id: userId,
            parent: rootFolderId
        }
    ]);
        return rootFolderId;
    }
}