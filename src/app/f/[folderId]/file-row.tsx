"use client";

import { type Folder, type File } from "~/lib/mock-data"
import { Folder as FolderIcon, FileIcon, Trash2Icon, Loader2} from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import type { files_table, folders_table } from "~/server/db/schema"
import { deleteFile, deleteFolder } from "~/server/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function FileRow(props: {file: typeof files_table.$inferSelect}) {
    const { file } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteFile(file.id);
            router.refresh();
        } catch (error) {
            console.error("Error deleting file:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
      <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
              <Link href={file.url} 
              className="flex items-center text-gray-100 hover:text-blue-400 transition-colors"
              target="_blank"
              >
              <FileIcon className="mr-3" size={20} />
              {file.name}
              </Link>
          </div>
          <div className="col-span-2 text-gray-400">{"file"}</div>
          <div className="col-span-2 text-gray-400">{file.size}</div>
          <div className="col-span-2 text-gray-400">
            <Button 
                variant="ghost" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-600/20 hover:text-red-400 transition-colors"
            >
                {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Trash2Icon className="mr-2" size={16} />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
      </div>
      </li>
    )
  }

export function FolderRow(props: {folder: typeof folders_table.$inferSelect}) {
    const { folder } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteFolder(folder.id);
            router.refresh();
        } catch (error) {
            console.error("Error deleting folder:", error);
        } finally {
            setIsDeleting(false);
        }
    };

  return (
    <li key={folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition-colors">
    <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center">
            <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400 transition-colors"
            >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
            </Link>
        </div>
        <div className="col-span-2 text-gray-400">{"folder"}</div>
        <div className="col-span-2 text-gray-400">{"2 MB"}</div>
        <div className="col-span-2 text-gray-400">
            <Button 
                variant="ghost" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-600/20 hover:text-red-400 transition-colors"
            >
                {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Trash2Icon className="mr-2" size={16} />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
        </div>
    </div>
    </li>
  )
}

