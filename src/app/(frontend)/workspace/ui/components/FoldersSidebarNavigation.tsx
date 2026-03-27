
import { useState } from "react"
import { usePathname, useRouter }  from "next/navigation"
import { useWorkspace } from "../../context/WorkspaceContext"
import { ChevronDown, ChevronDownCircle, ChevronRight, ChevronRightCircle } from "lucide-react"

export default function FoldersSidebarNavigation() {

  const {items} = useWorkspace()
  const router = useRouter()
  const pathName = usePathname()

  const [openFolders, setOpenFolders] = useState<string[]>([])

  function toggleFolder(id: string ){
    setOpenFolders(prev => 
      prev.includes(id)
      ? prev.filter(f => f !== id)
      : [...prev, id]
    )
  }

  function getCurrentFolderId() {
    if (!pathName.includes("/folder/")) return null
    return pathName.split("/folder/")[1]
  }

  const currentFolderId = getCurrentFolderId()

  
  function renderTree(parentId: string | null, level = 0 ) {
        // verifica se o folderId é ancestral do folder atualmente selecionado
    function folderHasSelectedDescendant(folderId: string) {
      if (!currentFolderId) return false;
      let node = items.find(it => it.id === currentFolderId);
      while (node) {
        if (node.parentId === folderId) return true;
        const parentId = node.parentId;
        node = parentId ? items.find(it => it.id === parentId) : undefined;
      }
      return false;
    }


    return items
    .filter(item => item.parentId === parentId &&  item.type === "folder")
    .map(folder => {
      const isOpen = openFolders.includes(folder.id)
      
      const hasChildren = items.some(
        item => item.parentId === folder.id && item.type === "folder"
      )

						const isSelected = currentFolderId === folder.id
      const childSelected = folderHasSelectedDescendant(folder.id)

						// container/background e cor do título:
      // - selecionado -> bg-gray-700
      // - não selecionado mas com filho selecionado -> bg-gray-600 (destaque mais sutil)
      // - caso contrário -> branco
      const containerBg = isSelected ? "bg-gray-700" : childSelected ? "bg-gray-600" : "bg-white"
      const titleColor = isSelected || childSelected ? "text-white" : "text-gray-500"

						// classes do chevron (mantendo quatro estados + destaque de pai com filho selecionado)
						const borderClass = isSelected ? "border border-white" : "border border-black"
      let stateClass = ""
      if (isOpen && isSelected) {
        stateClass = "bg-green-600 text-white"
      } else if (!isOpen && isSelected) {
        stateClass = "bg-green-800 text-white"
      } else if (isOpen && !isSelected) {
        stateClass = "bg-green-400 text-white"
      } else if (childSelected) {
        // pai de item selecionado (quando não está selecionado) — cor diferenciada
        stateClass = "bg-yellow-500 text-black"
      } else {
        stateClass = "bg-green-400 text-white border border-red-400"
      }
      const iconClass = `w-4 h-4 rounded-full ${borderClass} ${stateClass}`


      return (
							<div
								key={folder.id}
								style={{ paddingLeft: `${level * 5 + 2}px` }}
								className=" rounded-lg flex flex-col space-y-1 mb-2 gap-0"
							>
								<div
									onClick={() => {
										router.push(`/workspace/folder/${folder.id}`);
									}}
									className={`flex items-center  rounded-lg shadow-[1px_1px_5px_1px] shadow-black gap-1 px-1 py-1 cursor-pointer ${containerBg} `}
									// style={{ paddingLeft: `${level * 12 + 4 }px` }}
								>
									<span className="">{folder.emoji || "📁"}</span>
									<span className={`flex w-full text-sm text-left overflow-hidden mr-2 text-ellipsis whitespace-nowrap ${titleColor} `}>
										{folder.title}
									</span>
									{hasChildren && (
										<span
											onClick={(e) => {
												e.stopPropagation();
												toggleFolder(folder.id);
											}}
											className="text-sm"


											

										>
											{isOpen ? (
												<ChevronDown className={iconClass} />
											) : (
												<ChevronRight className={iconClass} />
											)}
										</span>
									)}
								</div>

								{isOpen && renderTree(folder.id, level + 1)}
							</div>
						);
    })
  }

  const hasFolders = items.some(item => item.type === "folder")

  if (!hasFolders) return null


  return (
    <div className='pt-3 max-w-44 min-w-44 px-2 bg-gray-800 h-full overflow-y-auto	scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 border border-red-600'>
      {renderTree(null)}
    </div>
  )
}
