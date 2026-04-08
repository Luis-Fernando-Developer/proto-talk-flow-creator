import { useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "../../context/WorkspaceContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export default function FoldersSidebarNavigation() {
	const { items } = useWorkspace();
	const router = useRouter();
	const pathName = usePathname();

	const [openFolders, setOpenFolders] = useState<string[]>([]);

	function toggleFolder(id: string) {
		setOpenFolders((prev) =>
			prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
		);
	}

	function getCurrentFolderId() {
		if (!pathName.includes("/folder/")) return null;
		return pathName.split("/folder/")[1];
	}

	const currentFolderId = getCurrentFolderId();

	function folderHasSelectedDescendant(folderId: string) {
		if (!currentFolderId) return false;

		let node = items.find((it) => it.id === currentFolderId);
		while (node) {
			if (node.parentId === folderId) return true;
			const parentId = node.parentId;
			node = parentId ? items.find((it) => it.id === parentId) : undefined;
		}
		return false;
	}

	const { setNodeRef: setSidebarRootRef, isOver: isSidebarRootOver } =
		useDroppable({
			id: "SIDEBAR_ROOT",
			data: {
				zone: "SIDEBAR",
			},
		});

	function renderTree(parentId: string | null, level = 0) {
		return items
			.filter((item) => item.parentId === parentId && item.type === "folder")
			.map((folder) => (
				<SidebarFolderRow
					key={folder.id}
					folder={folder}
					level={level}
					isOpen={openFolders.includes(folder.id)}
					onToggle={() => toggleFolder(folder.id)}
					isSelected={currentFolderId === folder.id}
					childSelected={folderHasSelectedDescendant(folder.id)}
					renderTree={renderTree}
					hasChildren={items.some(
						(item) => item.parentId === folder.id && item.type === "folder",
					)}
				/>
			));
	}

	const hasFolders = items.some((item) => item.type === "folder");
	if (!hasFolders) return null;

	return (
		<div
			ref={setSidebarRootRef}
			className={`pt-3 max-w-44 min-w-44 px-2 bg-gray-800 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 border border-red-600 ${
				isSidebarRootOver ? "bg-blue-800/50" : ""
			}`}
		>
			{isSidebarRootOver ? (
				<div className="mb-3 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
					Solte aqui para mover para o nível principal
				</div>
			) : null}
			{renderTree(null)}
		</div>
	);

	function SidebarFolderRow({
		folder,
		level,
		isOpen,
		onToggle,
		isSelected,
		childSelected,
		renderTree,
		hasChildren,
	}: {
		folder: {
			id: string;
			title: string;
			emoji?: string;
		};
		level: number;
		isOpen: boolean;
		onToggle: () => void;
		isSelected: boolean;
		childSelected: boolean;
		renderTree: (parentId: string | null, level?: number) => any;
		hasChildren: boolean;
	}) {
		const { attributes, listeners, setNodeRef, isDragging, transform } =
			useDraggable({
				id: folder.id,
				data: {
					zone: "SIDEBAR",
					itemType: "folder",
				},
			});

		const { setNodeRef: setDropRef, isOver } = useDroppable({
			id: folder.id,
			data: {
				zone: "SIDEBAR",
				itemType: "folder",
			},
		});

		const style: CSSProperties = {
			opacity: isDragging ? 0.5 : 1,
			transform: transform
				? `translate3d(${transform.x}px, ${transform.y}px, 0)`
				: undefined,
		};

		const containerBg = isSelected
			? "bg-gray-700"
			: childSelected
				? "bg-gray-600"
				: "bg-white";
		const titleColor =
			isSelected || childSelected ? "text-white" : "text-gray-500";

		return (
			<div
				ref={(node) => {
					setNodeRef(node);
					setDropRef(node);
				}}
				style={{ paddingLeft: `${level * 12 + 4}px`, ...style }}
				className={`rounded-lg flex flex-col space-y-1 mb-2 ${isOver ? "bg-blue-100" : ""}`}
			>
				<div
					onClick={() => {
						if (isDragging) return;
						router.push(`/workspace/folder/${folder.id}`);
					}}
					className={`flex items-center rounded-lg shadow-[1px_1px_5px_1px] shadow-black gap-1 px-1 py-1 cursor-pointer ${containerBg}`}
					{...attributes}
				>
					<div {...listeners} className="flex items-center gap-1">
						<span>{folder.emoji || ""}</span>
					</div>
					<span
						className={`flex-1 text-sm overflow-hidden mr-2 text-ellipsis whitespace-nowrap ${titleColor}`}
					>
						{folder.title}
					</span>
					{hasChildren ? (
						<span
							onClick={(e) => {
								e.stopPropagation();
								onToggle();
							}}
							className="text-sm"
						>
							{isOpen ? (
								<ChevronDown className="w-4 h-4 text-gray-200" />
							) : (
								<ChevronRight className="w-4 h-4 text-gray-200" />
							)}
						</span>
					) : null}
				</div>
				{isOpen ? renderTree(folder.id, level + 1) : null}
			</div>
		);
	}
}
