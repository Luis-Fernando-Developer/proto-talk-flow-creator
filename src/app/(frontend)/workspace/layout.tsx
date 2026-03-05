import React from 'react'
import Header from './ui/components/Header'
import { Toaster } from '@/components/ui/toaster'



export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>
        {children}
        <Toaster />
      </main>
    </div>
  )
}
