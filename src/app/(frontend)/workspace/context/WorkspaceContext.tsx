"use client"

import { createContext, useContext, useState } from "react";

type typeItem = {
 id: string
 title: string
 description: string
 parentId: string | null
 type: "folder" | "bot"
}

type WorkspaceContextType = {
 items: typeItem[]
 setItems: React.Dispatch<React.SetStateAction<typeItem[]>>
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
 
 const [items, setItems] = useState<typeItem[]>([]);

 return (
   <WorkspaceContext.Provider value={{ items, setItems }}>
     {children}
   </WorkspaceContext.Provider>
 )
}

export function useWorkspace() {
 const context = useContext(WorkspaceContext);
 if (!context) {
   throw new Error("useWorkspace must be used within a WorkspaceProvider");
 }
 return context;
};