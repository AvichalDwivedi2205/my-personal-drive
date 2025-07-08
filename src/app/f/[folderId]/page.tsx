import DriveContents from "../../drive-contents";
import { QUERIES } from "~/server/db/queries";


export default async function GoogleDriveClone(props:{
    params: Promise<{ folderId : string }>
}){
  const params = await props.params;
  
  const parsedFolderId = parseInt(params.folderId);
  if(isNaN(parsedFolderId)){
    return <div>Invalid folder ID</div>;
  }

  const filesPromise = QUERIES.getFiles(parsedFolderId);
  const foldersPromise = QUERIES.getFolders(parsedFolderId);
  const parentsPromise = QUERIES.getAllParentsForFolder(parsedFolderId);
  const [files, folders, parents] = await Promise.all([filesPromise, foldersPromise, parentsPromise]);

  return <DriveContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />
}

// This page cannot be static because folderId is a dynamic parameter
// and we need to fetch the files and folders for that folder