"use client";

import { useWorkspace } from "./WorkspaceContext";
import {
	DndContext,
	pointerWithin,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

export default function DnDProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setItems } = useWorkspace();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const draggedId = active.id as string;
		const overId = over.id as string;

		if (draggedId === overId) return;

		const activeZone = active.data.current?.zone as string | undefined;
		const overZone = over.data.current?.zone as string | undefined;

		const overIsGridRoot =
			overId === "GRID_ROOT_MAIN" || overId === "GRID_ROOT_FOLDER";

		const overIsSidebarRoot = overId === "SIDEBAR_ROOT";

		// 🔥 TODA LÓGICA AGORA ACONTECE AQUI DENTRO
		setItems((prev) => {
			const activeItem = prev.find((item) => item.id === draggedId);
			const overItem = prev.find((item) => item.id === overId);

			if (!activeItem) return prev;

			function isDescendant(folderId: string, possibleChildId: string) {
				const visited = new Set<string>();
				let current = prev.find((item) => item.id === possibleChildId);

				while (current?.parentId && !visited.has(current.id)) {
					visited.add(current.id);
					if (current.parentId === folderId) return true;
					current = prev.find((item) => item.id === current!.parentId);
				}

				return false;
			}

			// ❌ Sidebar NÃO pode ir pra grid
			if (activeZone === "SIDEBAR" && overZone === "GRID") {
				return prev;
			}

			// ✅ GRID → ROOT
			if (overIsGridRoot) {
				if (activeZone === "GRID") {
					return prev.map((item) =>
						item.id === draggedId ? { ...item, parentId: null } : item,
					);
				}
				return prev;
			}

			// ✅ QUALQUER COISA → SIDEBAR ROOT
			if (overIsSidebarRoot) {
				return prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: null } : item,
				);
			}

			if (!overItem) return prev;

			// ❌ não pode dropar em bot
			if (overItem.type === "bot") return prev;

			// ❌ evitar loop de hierarquia
			if (isDescendant(draggedId, overId) || isDescendant(overId, draggedId)) {
				return prev;
			}

			// ✅ SIDEBAR → SIDEBAR
			if (activeZone === "SIDEBAR" && overZone === "SIDEBAR") {
				return prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				);
			}

			// ✅ GRID → GRID
			if (activeZone === "GRID" && overZone === "GRID") {
				return prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				);
			}

			// ✅ GRID → SIDEBAR
			if (activeZone === "GRID" && overZone === "SIDEBAR") {
				return prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				);
			}

			return prev;
		});
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragEnd={handleDragEnd}
		>
			{children}
		</DndContext>
	);
}
