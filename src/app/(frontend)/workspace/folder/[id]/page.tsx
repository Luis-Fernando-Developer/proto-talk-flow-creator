"use client"

import { useParams } from "next/navigation"

export default function FolderPage() {
  const params = useParams()
  const folderId = params.id

  return (
    <div>
      <p>Pasta: {folderId}</p>
    </div>
  )
}