"use client";
//Client side behaviour is something that happens after the page loads like useEffect, onClicks or any function where we expaect code to run on a user's device

import { useState, useMemo } from "react"
import { mockFiles, mockFolders } from "../lib/mock-data"
import { Upload, ChevronRight, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { FileRow, FolderRow } from "./file-row"
import type { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/ui/uploadthing";
import { useRouter } from "next/navigation";

export default function DriveContents(props:{
    files:typeof files_table.$inferSelect[];
    folders:typeof folders_table.$inferSelect[];
    parents:typeof folders_table.$inferSelect[];
    currentFolderId:number;
    // infers from the actual definition in the table
}) {

  const navigate = useRouter();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const handleUploadComplete = (res: any[]) => {
    console.log("Upload completed:", res);
    setUploadStatus('success');
    setUploadMessage(`Successfully uploaded ${res.length} file(s)!`);
    
    // Show success for 2 seconds, then refresh and reset
    setTimeout(() => {
      setUploadStatus('idle');
      setUploadMessage('');
      navigate.refresh();
    }, 2000);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setUploadStatus('error');
    setUploadMessage(`Upload failed: ${error.message}`);
    
    // Reset error after 5 seconds
    setTimeout(() => {
      setUploadStatus('idle');
      setUploadMessage('');
    }, 5000);
  };

  const handleUploadBegin = () => {
    console.log("Upload started");
    setUploadStatus('uploading');
    setUploadMessage('Uploading file...');
  };

  const getUploadButtonContent = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Upload Complete!
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Upload Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </span>
        );
    }
  };

  const getUploadButtonClass = () => {
    switch (uploadStatus) {
      case 'uploading':
        return "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg cursor-not-allowed opacity-75";
      case 'success':
        return "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg";
      case 'error':
        return "bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/f/1"
              className="text-gray-300 hover:text-white mr-2"
            >
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
          {props.folders.map((folder) => (
              <FolderRow folder={folder} key={folder.id} />
            ))}
            {props.files.map((file) => (
              <FileRow file={file} key={file.id}/>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex flex-col items-center space-y-4">
          <UploadButton 
            endpoint="imageUploader"
            onUploadBegin={handleUploadBegin}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            appearance={{
              button: getUploadButtonClass(),
              allowedContent: "text-gray-400 text-sm mt-2"
            }}
            content={{
              button: getUploadButtonContent(),
              allowedContent: uploadStatus === 'idle' ? "Images up to 4MB" : ""
            }}
            input={{
              folderId: props.currentFolderId,
            }}
          />
          
          {/* Status message */}
          {uploadMessage && (
            <div className={`text-sm px-4 py-2 rounded-lg ${
              uploadStatus === 'success' ? 'bg-green-900/20 text-green-400 border border-green-700' :
              uploadStatus === 'error' ? 'bg-red-900/20 text-red-400 border border-red-700' :
              uploadStatus === 'uploading' ? 'bg-blue-900/20 text-blue-400 border border-blue-700' :
              'bg-gray-900/20 text-gray-400 border border-gray-700'
            }`}>
              {uploadMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ?? does works like this - If it values exists then it will use that value otherwise if it is nullish that is null or undefined then the second value is returned