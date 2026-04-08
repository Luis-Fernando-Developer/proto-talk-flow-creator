"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { Menu } from "lucide-react"
import React, { useState, useCallback } from "react";
import { Trash2, FolderPen, SquareMenuIcon } from "lucide-react";

function FolderIconComponent({
	id,
	title,
	emojiIcon,
	router,
	setCurrentFolderId,
}: any) {
	const [optionBot, setOptionBot] = useState<"Excluir" | "Editar">("Editar");

	const onClick = useCallback(() => {
		router.push(`/workspace/folder/${id}`);
		setCurrentFolderId(id);
	}, [router, id, setCurrentFolderId]);

	const {
		attributes,
		listeners,
		setNodeRef: setDragRef,
		isDragging,
		transform,
	} = useDraggable({
		id,
		data: {
			zone: "GRID",
			itemType: "folder",
		},
	});

	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id,
		data: {
			zone: "GRID",
			itemType: "folder",
		},
	});

	const style: React.CSSProperties = {
		opacity: isDragging ? 0.5 : 1,
		border: isOver ? "2px dashed #1e40af" : undefined,
		zIndex: isDragging ? 10 : undefined,
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
	};

	return (
		<div
			ref={(node) => {
				setDragRef(node);
				setDropRef(node);
			}}
			style={style}
			// className={isDragging ? "opacity-80" : ""}
		>
			<Card
				onClick={(e) => {
					e.stopPropagation();
					if (isDragging) return; // 🔥 impede conflito
					onClick?.();
				}}
				className={`p-2 w-28 h-32 flex flex-col ${isOver ? "bg-green-300" : ""} ${isDragging ? "bg-green-400/40" : ""} `}
			>
				{/* 🔥 HANDLE DE DRAG */}
				<div
					{...listeners}
					{...attributes}
					className="cursor-grab active:cursor-grabbing w-full h-full flex flex-col justify-between "
				>
					<CardHeader className=" p-0 relative items-end justify-end">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								asChild
								className=" flex items-center justify-end p-0 "
							>
								<SquareMenuIcon className="w-5 h-5 hover:cursor-pointer text-black" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content className="absolute shadow-[3px_3px_5px_rgba(0,0,0,0.5)] -right-4 -top-1.5 bg-gray-600 flex flex-col w-24 max-w-20 z-10 rounded-sm p-1">
								{/* <DropdownMenu.Item className='divide-y-2 text-sm text-white' onClick={() => setOptionFolder('Renomear')}> Renomear</DropdownMenu.Item> */}
								<DropdownMenu.Item
									className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
									onClick={() => setOptionBot("Excluir")}
								>
									<Trash2 className="w-3 h-3" />
									<span className="text-left flex flex-1">Excluir</span>
								</DropdownMenu.Item>
								<DropdownMenu.Separator className="w-full h-0 flex border border-gray-700/20" />
								<DropdownMenu.Item
									className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
									onClick={() => setOptionBot("Editar")}
								>
									<FolderPen className="w-3 h-3" />
									<span className="text-left flex flex-1">Editar</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</CardHeader>

					<CardContent className=" w-full flex-col  items-center justify-center p-0 m-0 flex flex-1">
						<span className="text-3xl ">{emojiIcon || "📁"}</span>
						<span className="text-sm text-center text-gray-700">{title}</span>
					</CardContent>
				</div>
			</Card>
		</div>
	);
}

export default React.memo(FolderIconComponent);
