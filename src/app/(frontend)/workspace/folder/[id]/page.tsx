"use client"

import { useParams, useRouter } from "next/navigation"
import { useWorkspace } from "../../context/WorkspaceContext"

import { useState } from "react"
import FolderIcon from "../../ui/components/FolderIcon"
import BotIcon from "../../ui/components/BotIcon"



export default function FolderPage() {
	const router = useRouter();
	const params = useParams();
	const folderId = params.id as string;

	const { items, setItems } = useWorkspace();

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
	const [currentBotId, setCurrentBotId] = useState<string | null>(null);
	const currentFolder = items.find((item) => item.id === folderId);
	const currentItems = items.filter((item) => item.parentId === folderId);

	return (
		<div className="w-full h-full flex px-3 gap-3">
			{currentItems.length > 0 ? (
				<div
					className={` pt-3 w-full h-full ${items.length > 0 ? "flex " : "flex items-center "}`}
				>
					{currentItems.map((item) => (
						<div
							key={item.id}
							className="grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8"
						>
							{item.type === "folder" ? (
								<FolderIcon
									id={item.id}
									emojiIcon={item.emoji ?? "📁"}
									title={item.title}
									description={item.description}
									onClick={() => {
										console.log("Clicou na pasta:", item.id);
										router.push(`/workspace/folder/${item.id}`);
										setCurrentFolderId(item.id);
									}}
									onDrop={(draggedId) => {
										// move item arrastado para dentro desta pasta
										setItems((prev) =>
											prev.map((it) =>
												it.id === draggedId ? { ...it, parentId: item.id } : it,
											),
										);
									}}
								/>
							) : (
								<BotIcon
									onClick={() => {
										console.log("Clicou no bot:", item.id);
										setCurrentBotId(item.id);
									}}
									title={item.title}
									emojiIcon={item.emoji ?? "🤖"}
									description={item.description}
								/>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-gray-500 flex w-full h-full flex-col justify-center items-center ">
					<p>Nenhuma pasta criada</p>
					<p>ou</p>
					<p>bot adicionado</p>
				</div>
			)}
		</div>
	);
}