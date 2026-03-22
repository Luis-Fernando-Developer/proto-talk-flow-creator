"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical, Trash2, FolderPen, SquareMenuIcon } from 'lucide-react'
import React from 'react'

interface FolderIconProps {
	id?:	string
	title: string
	description: string
	emojiIcon: string
	onClick?: () => void
	onDrop?: (draggedItemId: string) => void
}

export default function FolderIcon({ id, title, emojiIcon, description, onClick, onDrop }: FolderIconProps) {

  const [optionFolder, setOptionFolder] = React.useState< 'Excluir' | 'Editar'>('Editar');
		const [over, setOver] = React.useState(false);

		function handleDragStart(e: React.DragEvent) {
			if (!id) return;
			e.dataTransfer.setData("text/plain", id);
			e.dataTransfer.effectAllowed = "move";
		}

		function handleDragOver(e: React.DragEvent) {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
			setOver(true);
		}

		function handleDragLeave() {
			setOver(false);
		}

		function handleDrop(e: React.DragEvent) {
			e.preventDefault();
			e.stopPropagation();
			
			setOver(false);
			const draggedId = e.dataTransfer.getData("text/plain");
			if (draggedId && onDrop) onDrop(draggedId);
		}

  return (
			<div
				draggable={true}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnter={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={onClick}
			>
				<Card
					className={`group hover:border-green-400 p-2 flex flex-col bg-[rgb(0,0,0)] gap-0 w-28 max-h-32 h-32 rounded-lg border border-white shadow-[3px_3px_5px_rgba(0,0,0,0.5)] ${over ? "ring-2 ring-blue-400" : ""}`}
				>
					<CardHeader className="p-0 m-0 items-end  flex-row justify-end w-full">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								asChild
								className=" flex items-center justify-end p-0 "
							>
								<SquareMenuIcon className="w-4 h-4 hover:cursor-pointer text-white" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content className="absolute shadow-[3px_3px_5px_rgba(0,0,0,0.5)] -right-4 -top-1.5 bg-gray-600 flex flex-col w-24 max-w-20 z-10 rounded-sm p-1">
								<DropdownMenu.Item
									className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
									onClick={() => setOptionFolder("Excluir")}
								>
									<Trash2 className="w-3 h-3" />
									<span className="text-left flex flex-1">Excluir</span>
								</DropdownMenu.Item>
								<DropdownMenu.Separator className="w-full h-0 flex border border-gray-700/20" />
								<DropdownMenu.Item
									className=" flex w-full text-sm text-white items-center justify-between gap-1 text-left"
									onClick={() => setOptionFolder("Editar")}
								>
									<FolderPen className="w-3 h-3" />
									<span className="text-left flex flex-1">Editar</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</CardHeader>
					<CardContent className=" p-0 pt-3 flex flex-col  w-full h-full items-center overflow-hidden">
						<span className=" w-full text-3xl flex items-center justify-center text-white">
							{emojiIcon}
						</span>
						<span className="text-xs text-gray-400">{title}</span>
					</CardContent>
				</Card>
			</div>
		);
}
