"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FolderIcon from "./FolderIcon";
import BotIcon from "./BotIcon";
import { useDroppable } from "@dnd-kit/core";

import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceMain() {
	const router = useRouter();

	const { items, setItems } = useWorkspace();

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
	const [currentBotId, setCurrentBotId] = useState<string | null>(null);

	const currentItems = items.filter((item) => item.parentId === currentFolderId);

	const { setNodeRef, isOver } = useDroppable({
		id: "GRID_ROOT_MAIN",
		data: {
			zone: "GRID",
		},
	});

	useEffect(() => {
		console.log("items atualizados", items);
	}, [items]);

	return (
		<div
			ref={setNodeRef}
			className={`w-full h-full flex px-3 gap-3 ${isOver ? "bg-blue-50" : ""}`}
		>
			<div
				className={` pt-3 h-full  w-full ${
					items.length > 0
						? "flex flex-col items-start justify-start h-full border-2 border-yellow-400 "
						: "flex items-center border-2 border-black"
				}`}
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
										router={router}
										setCurrentFolderId={setCurrentFolderId}
									/>
								) : (
									<BotIcon
										id={item.id}
										emojiIcon={item.emoji}
										title={item.title}
										description={item.description}
										onClick={() => {
											setCurrentBotId(item.id);
										}}
									/>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="text-gray-500 flex h-full w-full flex-col justify-center items-center ">
						<p>Nenhuma pasta criada</p>
						<p>ou</p>
						<p>bot adicionado</p>
					</div>
				)}
			</div>
		</div>
	);
}
