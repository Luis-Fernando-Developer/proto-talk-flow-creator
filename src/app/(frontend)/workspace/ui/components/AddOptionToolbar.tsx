"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Plus } from "lucide-react"

type Props = {
  onAddFolder: () => void
  onAddBot: () => void
}

export default function AddOptionToolbar({ onAddFolder, onAddBot }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="group hover:border-green-400 flex items-center justify-center w-20 h-16 rounded-2xl border border-fuchsia-950">
          <Plus className="w-8 h-8 group-hover:text-green-400 text-gray-500"/>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={6}
        className="p-2 bg-white rounded-md shadow-md"
      >
        <DropdownMenu.Item
          onSelect={onAddFolder}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          Adicionar Pasta
        </DropdownMenu.Item>

        <DropdownMenu.Item
          onSelect={onAddBot}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          Adicionar Bot
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}