import React from 'react'
import Header from './ui/components/Header'
import { Toaster } from '@/components/ui/toaster'
import { WorkspaceProvider } from './context/WorkspaceContext'



export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div>
        <Header />
        <main>
          {children}
          <Toaster />
        </main>
      </div>
    </WorkspaceProvider>
  )
}
