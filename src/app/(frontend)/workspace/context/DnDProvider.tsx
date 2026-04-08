"use client";

import { useWorkspace } from "./WorkspaceContext";
import {
	DndContext,
	closestCenter,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useMemo } from "react";

export default function DnDProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { items, setItems } = useWorkspace();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 👈 precisa mover 8px pra virar drag
			},
		}),
	);

	function isDescendant(folderId: string, possibleChildId: string) {
		const visited = new Set<string>();
		let current = items.find((item) => item.id === possibleChildId);
		while (current?.parentId && !visited.has(current.id)) {
			visited.add(current.id);
			if (current.parentId === folderId) return true;
			current = items.find((item) => item.id === current!.parentId);
		}
		return false;
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const draggedId = active.id as string;
		const overId = over.id as string;
		if (draggedId === overId) return;

		const activeZone = active.data.current?.zone as string | undefined;
		const overZone = over.data.current?.zone as string | undefined;

		const activeItem = items.find((item) => item.id === draggedId);
		const overItem = items.find((item) => item.id === overId);

		const overIsGridRoot = overId === "GRID_ROOT";
		const overIsSidebarRoot = overId === "SIDEBAR_ROOT";

		if (!activeItem) return;

		// sidebar items cannot be dropped into grid
		if (activeZone === "SIDEBAR" && overZone === "GRID") return;

		// moving into grid root
		if (overIsGridRoot) {
			if (activeZone === "GRID") {
				setItems((prev) =>
					prev.map((item) =>
						item.id === draggedId ? { ...item, parentId: null } : item,
					),
				);
			}
			return;
		}

		// moving into sidebar root (top-level)
		if (overIsSidebarRoot) {
			setItems((prev) =>
				prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: null } : item,
				),
			);
			return;
		}

		if (!overItem) return;
		if (overItem.type === "bot") return;

		if (activeZone === "SIDEBAR" && overZone === "SIDEBAR") {
			if (isDescendant(draggedId, overId) || isDescendant(overId, draggedId))
				return;
			setItems((prev) =>
				prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				),
			);
			return;
		}

		if (activeZone === "GRID" && overZone === "GRID") {
			if (isDescendant(draggedId, overId) || isDescendant(overId, draggedId))
				return;
			setItems((prev) =>
				prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				),
			);
			return;
		}

		if (activeZone === "GRID" && overZone === "SIDEBAR") {
			if (isDescendant(draggedId, overId) || isDescendant(overId, draggedId))
				return;
			setItems((prev) =>
				prev.map((item) =>
					item.id === draggedId ? { ...item, parentId: overItem.id } : item,
				),
			);
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			{children}
		</DndContext>
	);
}
