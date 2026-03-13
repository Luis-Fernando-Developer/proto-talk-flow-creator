"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import FolderIcon from "./FolderIcon"
import BotIcon from "./BotIcon"

import { useWorkspace } from "../../context/WorkspaceContext"
import { WorkspaceItemType } from "@/types/workspace/workspaceTypes"

export default function WorkspaceMain() {

  const router = useRouter()

  const { items } = useWorkspace()

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentBotId, setCurrentBotId] = useState<string | null>(null)

  const currentItems = items.filter(
    item => item.parentId === currentFolderId
  )

  return (
	  <div className="w-full h-full flex px-3 gap-3 ">
      <div className={` pt-3  w-full ${items.length > 0 ? 'flex flex-col ' : 'flex items-center '}`}>
        {currentItems.length > 0 ? (
          <div className='grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8'>
            {currentItems.map(item => (
              <div key={item.id} className='w-fit'>
                {item.type === 'folder' ? (
                  <FolderIcon onClick={() => {console.log("Clicou na pasta:", item.id)
                    router.push(`/workspace/folder/${item.id}`);
                    setCurrentFolderId(item.id)}} title={item.title} description={item.description} />
                ) : (
                  <BotIcon onClick={() => {console.log("Clicou no bot:", item.id)
                    setCurrentBotId(item.id)}} title={item.title} description={item.description} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500 flex w-full flex-col justify-center items-center '>
            <p>Nenhuma pasta criada</p>
            <p>ou</p>
            <p>bot adicionado</p>
          </div>
        )}
      </div>
    </div>
  );
}