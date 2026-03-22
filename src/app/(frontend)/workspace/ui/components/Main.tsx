"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import FolderIcon from "./FolderIcon"
import BotIcon from "./BotIcon"

import { useWorkspace } from "../../context/WorkspaceContext"
import { WorkspaceItemType } from "@/types/workspace/workspaceTypes"

export default function WorkspaceMain() {

  const router = useRouter()

  const { items, setItems } = useWorkspace()

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentBotId, setCurrentBotId] = useState<string | null>(null)

  const currentItems = items.filter(
    item => item.parentId === currentFolderId
  )

  useEffect(() => {
    console.log("items atualizados", items)
  }, [items])

  function handleDropRoot(e: React.DragEvent) {
    e.preventDefault()

    if(e.target !== e.currentTarget) return;

    const draggedId = e.dataTransfer.getData("text/plain")
    setItems(prev =>
      prev.map(item =>
        item.id === draggedId ? { ...item, parentId: null } : item
      )
    )
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
	  <div 
      className="w-full h-full flex px-3 gap-3 "
      onDrop={handleDropRoot}
      onDragOver={handleDragOver}
    >
      <div className={` pt-3 h-full  w-full ${items.length > 0 ? 'flex flex-col ' : 'flex items-center '}`}>
        {currentItems.length > 0 ? (

          <div className='grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8'>
            
            {currentItems.map(item => (
              <div key={item.id} className='w-fit'>
                
                {item.type === 'folder' ? (
                  <FolderIcon 
                    id={item.id} 
                    emojiIcon={item.emoji}
                    title={item.title}
                    description={item.description}
                    onClick={() => {
                      router.push(`/workspace/folder/${item.id}`)
                      setCurrentFolderId(item.id);
                    }}
                    onDrop={(draggedId) => {
                      console.log("DROP:", draggedId, "->", item.id)
                       setItems((prev) => {
                        const updated = prev.map((it) =>
                          it.id === draggedId
                            ? { ...it, parentId: item.id }
                            : it
                        )
                        return [...updated]
                       })
                    }}
                  />
                ) : (
                  <BotIcon
                    id={item.id}
                    emojiIcon={item.emoji}
                    title={item.title}
                    description={item.description}
                    onClick={() => {
                      setCurrentBotId(item.id)
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500 flex h-full w-full flex-col justify-center items-center '>
            <p>Nenhuma pasta criada</p>
            <p>ou</p>
            <p>bot adicionado</p>
          </div>
        )}
      </div>
    </div>
  );
}