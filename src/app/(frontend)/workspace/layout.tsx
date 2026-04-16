"use client";

import DnDProvider from "./context/DnDProvider";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import Header from "./(content_path_items)/Header";

export default function WorkspaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<WorkspaceProvider>
			<DnDProvider>
				<Header />
				{children}
			</DnDProvider>
		</WorkspaceProvider>
	);
}
