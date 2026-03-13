import { ArrowLeft, ArrowRight, CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceItemType } from "@/types/workspace/workspaceTypes";

export default function Breadcrumb() {
 const { items } = useWorkspace();
 const router = useRouter();

 const params = useParams();

 const folderId = params?.id as string | undefined;

 function buildPath() {


  if (!folderId) return [];

  const path: WorkspaceItemType[] = [];

  let current: WorkspaceItemType | undefined = items.find(item => item.id === folderId);

  while (current) {
    path.unshift(current);
    const parentId = current.parentId;
    if (!parentId) break;
    current = items.find(item => item.id === parentId);
  }

  return path;
 }

 const path = buildPath();
function handleBack() {
  if (!folderId) return;
  const current =  items.find(i => i.id === folderId);

  const parentId = current?.parentId;
  if (!parentId) {
    router.push(`/workspace`);
    return;
  }
  return router.push(`/workspace/folder/${parentId}`);
 }

 return (
  <div className="p-3 flex items-center ">
   {folderId && (
    <button onClick={handleBack}><ArrowLeft className="w-4 h-4"  /></button>
   )}
    {path.map(folder => (
     <div className="flex items-center justify-center" key={folder.id} onClick={() => router.push(`/workspace/folder/${folder.id}`)}>
      <p className="flex items-center mr-2 ml-2 justify-center"> {folder.title} </p>
      <p className={`${folder.id === folderId ? 'hidden' : 'flex justify-center items-center'}`}> / </p>
     </div>
    ))}
  </div>
 )
}