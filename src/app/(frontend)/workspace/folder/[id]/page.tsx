// "use client"

// import { useParams, useRouter } from "next/navigation"
// import { useWorkspace } from "../../context/WorkspaceContext"

// import { useState } from "react"
// import FolderIcon from "../../ui/components/FolderIcon"
// import BotIcon from "../../ui/components/BotIcon"

// export default function FolderPage() {

// 	const router = useRouter();
// 	const params = useParams();

// 	const folderId = params.id as string;

// 	const { items, setItems } = useWorkspace();

// 	const [currentBotId, setCurrentBotId] = useState<string | null>(null);

// 	const currentFolder = items.find((item) => item.id === folderId);

// 	const currentItems = items.filter(
// 		(item) => item.parentId === folderId
// 	);

// 	function handleDropRoot(e: React.DragEvent) {
// 		e.preventDefault();

// 		if (e.target !== e.currentTarget) return;

// 		const draggedId = e.dataTransfer.getData("text/plain");
// 		setItems((prev) =>
// 			prev.map((item) =>
// 				item.id === draggedId ? { ...item, parentId: null } : item,
// 			),
// 		);
// 	}

// 	function handleDragOver(e: React.DragEvent) {
// 		e.preventDefault();
// 	}

// 	return (
// 		<div
// 				onDrop={handleDropRoot}
// 				onDragOver={handleDragOver}
// 				className="w-full h-full flex px-3 gap-3"
// 		>
// 			<div className={` pt-3 h-full  w-full ${items.length > 0 ? 'flex flex-col items-start justify-start ' : 'flex items-start'}`}>

// 					{currentItems.length > 0 ? (
// 						<div className="grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8">
// 						{currentItems.map((item) => (
// 							<div key={item.id} className='w-fit'>
// 								{item.type === "folder" ? (
// 									<FolderIcon
// 											id={item.id}
// 											emojiIcon={item.emoji}
// 											title={item.title}
// 											description={item.description}
// 											onClick={() => {
// 													router.push(`/workspace/folder/${item.id}`)
// 													// setCurrentFolderId(item.id);
// 											}}
// 											onDrop={(draggedId) => {
// 													console.log("DROP:", draggedId, "->", item.id)
// 														setItems((prev) => {
// 															const updated = prev.map((it) =>
// 																	it.id === draggedId
// 																			? { ...it, parentId: item.id }
// 																			: it
// 															)
// 															return [...updated]
// 														})
// 											}}
// 									/>
// 								) : (
// 									<BotIcon
// 										onClick={() => {
// 											console.log("Clicou no bot:", item.id);
// 											setCurrentBotId(item.id);
// 										}}
// 										title={item.title}
// 										emojiIcon={item.emoji ?? "🤖"}
// 										description={item.description}
// 									/>
// 								)}
// 							</div>
// 						))}
// 					</div>
// 					) : (
// 						<div className="text-gray-500 flex w-full h-full flex-col justify-start items-center ">
// 							<p>Nenhuma pasta criada</p>
// 							<p>ou</p>
// 							<p>bot adicionado</p>
// 						</div>
// 					)}
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "../../context/WorkspaceContext";

import { useState } from "react";
import FolderIcon from "../../ui/components/FolderIcon";
import BotIcon from "../../ui/components/BotIcon";
import { useDroppable } from "@dnd-kit/core";

export default function FolderPage() {
	const router = useRouter();
	const params = useParams();
	const folderId = params.id as string;

	const { items } = useWorkspace();
	const [currentBotId, setCurrentBotId] = useState<string | null>(null);

	const currentItems = items.filter((item) => item.parentId === folderId);

	// 🔥 ROOT DA GRID (IMPORTANTE)
	const { setNodeRef, isOver } = useDroppable({
		id: "GRID_ROOT_FOLDER",
		data: {
			zone: "GRID",
		},
	});

	return (
		<div
			ref={setNodeRef}
			className={`w-full h-full flex px-3 gap-3 ${isOver ? "bg-gray-100" : ""}`}
		>
			{currentItems.length > 0 ? (
				<div className="grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8">
					{currentItems.map((item) => (
						<div key={item.id} className="w-fit">
							{item.type === "folder" ? (
								<FolderIcon
									id={item.id}
									emojiIcon={item.emoji}
									title={item.title}
									description={item.description}
									onCLick={() => {
										router.push(`/workspace/folder/${item.id}`);
									}}
								/>
							) : (
								<BotIcon
									id={item.id}
									onClick={() => {
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
				<div className="text-gray-500 flex w-full h-full flex-col justify-start items-center">
					<p>Nenhuma pasta criada</p>
					<p>ou</p>
					<p>bot adicionado</p>
				</div>
			)}
		</div>
	);
}
