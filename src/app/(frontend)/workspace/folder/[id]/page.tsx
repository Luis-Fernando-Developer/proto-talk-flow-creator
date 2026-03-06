"use client"

import { useParams } from "next/navigation"
import { useWorkspace } from "../../context/WorkspaceContext"



export default function FolderPage() {
  const params = useParams()
  const folderId = params.id as string

  const { items } = useWorkspace()

  const currentFolder = items.find(item => item.id === folderId)
  const currentItems = items.filter(item => item.parentId === folderId)

  return (
			<div>
				<p>Pasta: {currentFolder ? currentFolder.title : "carregando..."}</p>
				<div>
					{currentItems.map((item) => (
						<div key={item.id}>
							<h2>{item.title}</h2>
							<p>{item.description}</p>
							<span>{item.type}</span>
						</div>
					))}
				</div>
			</div>
		);
}