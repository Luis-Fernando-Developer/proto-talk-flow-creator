// "use client"

// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import * as Dialog from '@radix-ui/react-dialog';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import { EllipsisVertical, Trash2, FolderPen, SquareMenuIcon, CirclePowerIcon } from 'lucide-react'
// import React from 'react'

// interface BotIconProps {
// 	id?: string;
// 	title: string;
// 	description: string;
// 	emojiIcon: string;
// 	onClick?: () => void;
// 	onDrop?: (draggedItemId: string) => void;
// }

// export default function BotIcon({ id, title, description, emojiIcon, onClick }: BotIconProps) {

//   const [isBotActive, setIsBotActive] = React.useState(true);
//   const [optionBot, setOptionBot] = React.useState< 'Excluir' | 'Editar'>('Editar');

//   return (
// 			<Card
// 				onClick={onClick}
// 				className=" group hover:border-green-400 p-2 flex flex-col bg-[rgb(70,1,92)] gap-0 w-28 max-h-32 h-32 rounded-lg border border-white shadow-[3px_3px_5px_rgba(0,0,0,0.5)]"
// 			>
// 				<CardHeader className="p-0 m-0 items-end  flex-row justify-center w-full">
// 					<DropdownMenu.Root>
// 						<div
// 							className={`flex w-full items-center p-0 gap-0.5 text-sm h-5 ${isBotActive ? "text-green-400" : "text-red-400"}`}
// 						>
// 							{isBotActive ? (
// 								<CirclePowerIcon className="w-4 h-4 text-white p-0 rounded-full bg-green-400" />
// 							) : (
// 								<CirclePowerIcon className="w-4 h-4 text-white p-0 rounded-full bg-red-400" />
// 							)}
// 							{isBotActive ? "On" : "Off"}
// 						</div>
// 						<DropdownMenu.Trigger
// 							asChild
// 							className=" flex items-center justify-end p-0 "
// 						>
// 							<SquareMenuIcon className="w-5 h-5 hover:cursor-pointer text-white" />
// 						</DropdownMenu.Trigger>
// 						<DropdownMenu.Content className="absolute shadow-[3px_3px_5px_rgba(0,0,0,0.5)] -right-4 -top-1.5 bg-gray-600 flex flex-col w-24 max-w-20 z-10 rounded-sm p-1">
// 							{/* <DropdownMenu.Item className='divide-y-2 text-sm text-white' onClick={() => setOptionFolder('Renomear')}> Renomear</DropdownMenu.Item> */}
// 							<DropdownMenu.Item
// 								className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
// 								onClick={() => setOptionBot("Excluir")}
// 							>
// 								<Trash2 className="w-3 h-3" />
// 								<span className="text-left flex flex-1">Excluir</span>
// 							</DropdownMenu.Item>
// 							<DropdownMenu.Separator className="w-full h-0 flex border border-gray-700/20" />
// 							<DropdownMenu.Item
// 								className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
// 								onClick={() => setOptionBot("Editar")}
// 							>
// 								<FolderPen className="w-3 h-3" />
// 								<span className="text-left flex flex-1">Editar</span>
// 							</DropdownMenu.Item>
// 						</DropdownMenu.Content>
// 					</DropdownMenu.Root>
// 				</CardHeader>
// 				<CardContent className=" p-0 pt-3 flex flex-col  w-full h-full items-center overflow-hidden">
// 					<span className=" w-full text-2xl flex items-center justify-center text-white">
// 						{emojiIcon}
// 					</span>
// 					<span className="text-xs text-gray-400">{title}</span>
// 				</CardContent>
// 			</Card>
// 		);
// }

"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
	Trash2,
	FolderPen,
	SquareMenuIcon,
	CirclePowerIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

interface BotIconProps {
	id?: string;
	title: string;
	description: string;
	emojiIcon: string;
	onClick?: () => void;
}

export default function BotIcon({
	id,
	title,
	emojiIcon,
	onClick,
}: BotIconProps) {
	const [optionBot, setOptionBot] = useState<"Excluir" | "Editar">("Editar");

	const [isBotActive, setIsBotActive] = React.useState(true);

	const { attributes, listeners, setNodeRef, isDragging, transform } =
		useDraggable({
			id: id || title,
			data: {
				zone: "GRID",
				itemType: "bot",
			},
		});

	const style: React.CSSProperties = {
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 10 : undefined,
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
	};
	return (
		<div
			ref={setNodeRef}
			onClick={(e) => {
				if (isDragging) return; // 🔥 impede conflito
				onClick?.();
			}}
			style={style}
			// className={isDragging ? "opacity-80" : ""}
		>
			<Card className="group hover:border-green-400 p-2 flex flex-col bg-[rgb(70,1,92)] gap-0 w-28 max-h-32 h-32 rounded-lg border border-white shadow-[3px_3px_5px_rgba(0,0,0,0.5)]">
				{/* 🔥 HANDLE */}
				<div
					{...listeners}
					{...attributes}
					className="cursor-grab active:cursor-grabbing w-full h-full flex flex-col justify-between "
				>
					<CardHeader className=" p-0 flex flex-row items-center h-fit space-y-0">
						<div
							className={`flex flex-1 gap-1 items-center text-sm h-5 ${isBotActive ? "text-green-400" : "text-red-400"}`}
						>
							<CirclePowerIcon
								className={`w-4 h-4 text-white rounded-full ${isBotActive ? "bg-green-400" : "bg-red-400"}`}
							/>
							{isBotActive ? "On" : "Off"}
						</div>

						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								asChild
								className=" flex items-center justify-center p-0 "
							>
								<SquareMenuIcon className="w-5 h-5 hover:cursor-pointer text-white" />
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

					<CardContent className=" w-full flex-col items-center justify-center p-0 m-0 flex flex-1">
						<span className="text-2xl ">{emojiIcon || "📁"}</span>
						<span className="text-sm text-center text-gray-400">{title}</span>
					</CardContent>
				</div>
			</Card>
		</div>
	);
}
