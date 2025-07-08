import "server-only";

import { db } from "~/server/db";
import { 
  files_table as filesSchema, 
  folders_table as foldersSchema,
  type DB_FileType,
  type DB_FolderType,
} from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";

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
    }
}