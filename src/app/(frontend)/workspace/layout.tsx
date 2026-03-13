"use client";

import Header from "./ui/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import AddOptionToolbar from "./ui/components/AddOptionToolbar";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useWorkspace } from "./context/WorkspaceContext";
import { usePathname } from "next/navigation";
import Breadcrumb from "./ui/components/Breadcrumb";

export default function WorkspaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<WorkspaceProvider>
			<WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
		</WorkspaceProvider>
	);
}

function WorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
	const { items, setItems } = useWorkspace();

	const pathname = usePathname();

	const [openModalADD, setOpenModalADD] = useState(false);
	const [addOption, setAddOption] = useState<"folder" | "bot">("folder");

	const [folderName, setFolderName] = useState("");
	const [folderDescription, setFolderDescription] = useState("");

	const [botName, setBotName] = useState("");
	const [botDescription, setBotDescription] = useState("");

	function getCurrentFolderId() {
		if (!pathname.includes("/folder/")) return null;
		return pathname.split("/folder/")[1];
	}

	const currentFolderId = getCurrentFolderId();

	function createFolder() {
		setItems((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				type: "folder",
				indexItem: 0,
				title: folderName,
				description: folderDescription,
				parentId: currentFolderId,
			},
		]);

		setFolderName("");
		setFolderDescription("");
		setOpenModalADD(false);
	}

	function createBot() {
		setItems((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				type: "bot",
				indexItem: 0,
				title: botName,
				description: botDescription,
				parentId: currentFolderId,
			},
		]);

		setBotName("");
		setBotDescription("");
		setOpenModalADD(false);
	}

	return (
		<div>
			<Header />
			<Breadcrumb />

			<main className='flex '>
					<div className="px-3 pt-3 ">
						<AddOptionToolbar
							onAddFolder={() => {
								setAddOption("folder");
								setOpenModalADD(true);
							}}
							onAddBot={() => {
								setAddOption("bot");
								setOpenModalADD(true);
							}}
						/>
					</div>
					<div className=' w-full'>
				{children}
					</div>
				<Toaster />
			</main>

			<Dialog open={openModalADD} onOpenChange={setOpenModalADD}>
				<DialogContent>
					{addOption === "folder" && (
						<>
							<DialogHeader>
								<DialogTitle>Adicionar Nova Pasta</DialogTitle>
							</DialogHeader>

							<input
								placeholder="Nome da pasta"
								value={folderName}
								onChange={(e) => setFolderName(e.target.value)}
								className="border p-2 rounded-md w-full"
							/>

							<input
								placeholder="Descrição"
								value={folderDescription}
								onChange={(e) => setFolderDescription(e.target.value)}
								className="border p-2 rounded-md w-full mt-2"
							/>

							<button
								onClick={createFolder}
								className="bg-blue-500 text-white p-2 rounded-md mt-2"
							>
								Criar pasta
							</button>
						</>
					)}

					{addOption === "bot" && (
						<>
							<DialogHeader>
								<DialogTitle>Adicionar Novo Bot</DialogTitle>
							</DialogHeader>

							<input
								placeholder="Nome do bot"
								value={botName}
								onChange={(e) => setBotName(e.target.value)}
								className="border p-2 rounded-md w-full"
							/>

							<input
								placeholder="Descrição"
								value={botDescription}
								onChange={(e) => setBotDescription(e.target.value)}
								className="border p-2 rounded-md w-full mt-2"
							/>

							<button
								onClick={createBot}
								className="bg-blue-500 text-white p-2 rounded-md mt-2"
							>
								Criar bot
							</button>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
