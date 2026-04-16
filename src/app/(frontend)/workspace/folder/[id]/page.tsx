"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "../../context/WorkspaceContext";

import { useState } from "react";
import FolderIcon from "../../(content_path_items)/FolderIcon";
import BotIcon from "../../(content_path_items)/BotIcon";
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
			className={`b w-full h-full flex px-0 ${isOver ? "" : ""}`}
		>
			<div
				className={`pt-3 h-full w-full ${
					items.length > 0
						? "flex flex-col w-full items-start justify-start "
						: "flex items-center "
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
		</div>
	);
}
