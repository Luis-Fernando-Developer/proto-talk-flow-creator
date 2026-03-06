"use client"


import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Plus } from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'
import Folder from './Folder';
import FolderIcon from './FolderIcon';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BotIcon from './BotIcon';
import { useRouter } from 'next/navigation';
import { CreateBotDTO, CreateFolderDTO, WorkspaceItemType } from '@/types/workspace/workspaceTypes';


const FolderComponent: any = Folder;

export default function WorkspaceMain() {
  // type  = | {id: string, type: "folder", title: string, description: string} | {id: string, type: "bot", title: string, description: string}

  

  const router = useRouter();

  const [openModalADD, setOpenModalADD] = useState(false);
  const [addOption, setAddOption] = useState<'folder' | 'bot'>('folder');

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentBotId, setCurrentBotId] = useState<string | null>(null);

  const [typeItem, setTypeItem] = useState<WorkspaceItemType[]>([]);

  // flag para só renderizar a lista real após carregar localStorage
  const [mounted, setMounted] = useState(false);

  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');

  const currentItems = typeItem.filter(
    item => item.parentId === currentFolderId
  );

  // carregar do localStorage antes da pintura para reduzir flash
  useLayoutEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem('workspace_folders_v1');
      if (raw) {
        const parsed = JSON.parse(raw) as WorkspaceItemType[];
        if (Array.isArray(parsed)) setTypeItem(parsed);
      }
    } catch (e) {
      console.error('Falha ao ler pastas do localStorage', e);
    } finally {
      setMounted(true);
    }
  }, []);

  // salvar sempre que folders mudar — só depois do mounted para não sobrescrever
  useEffect(() => {
    if (!mounted) return; // evita gravar antes de carregar do localStorage
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('workspace_folders_v1', JSON.stringify(typeItem));
    } catch (e) {
      console.error('Falha ao salvar pastas no localStorage', e);
    }
  }, [typeItem, mounted]);

  function handlerCreateFolder(data: CreateFolderDTO) {
    const newFolder: WorkspaceItemType = {
      id: crypto.randomUUID(),
      type: "folder",
      indexItem: 0,
      ...data
    }
    setTypeItem(prev => [...prev, newFolder]);
    setFolderName('');
    setFolderDescription('');
    setOpenModalADD(false);
  }

  function handlerCreateBot(data: CreateBotDTO) {
    const newBot: WorkspaceItemType = {
      id: crypto.randomUUID(),
      type: "bot",
      indexItem: 0,
      ...data
    }
    setTypeItem(prev => [...prev, newBot]);
    setBotName('');
    setBotDescription('');
    setOpenModalADD(false);
  }

  // enquanto não montado, renderiza placeholder idêntico ao server (evita mismatch)
  if (!mounted) {
    return (
      <div className='w-full h-full flex flex-col '>
        <DropdownMenu.Root>
          <div className='flex gap-2 w-full h-full px-3 '>
            <DropdownMenu.Trigger  asChild className=' flex w-fit'>
              <div className='pt-3 flex'>
                <button className='group hover:border-green-400 flex items-center justify-center w-20 h-16 rounded-2xl border border-fuchsia-950'>
                  <Plus className='w-8 h-8 group-hover:text-green-400 text-gray-500' />
                </button>
              </div>
            </DropdownMenu.Trigger>

            <div className={` pt-3 w-full flex items-center`}>
              <div className='text-gray-500 flex w-full flex-col justify-center items-center '>
                <p>Nenhuma pasta criada</p>
                <p>ou</p>
                <p>bot adicionado</p>
              </div>
            </div>
          </div>
        </DropdownMenu.Root>
      </div>
    )
  }
  
  return (
    <div className=' w-full '>
      <div className='w-full h-full flex px-3 gap-3'>
        <DropdownMenu.Root>
          <div className='flex gap-2 h-full '>
            <DropdownMenu.Trigger  asChild className=' flex w-fit'>
              <div className='pt-3 flex'>
                <button className='group hover:border-green-400 flex items-center justify-center w-20 h-16 rounded-2xl border border-fuchsia-950'>
                  <Plus className='w-8 h-8 group-hover:text-green-400 text-gray-500' />
                </button>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={6} className='z-10  -right-3 relative p-2 bg-white rounded-md shadow-md'>
              <DropdownMenu.Item onSelect={() => { setAddOption('folder'); setOpenModalADD(true); }} className='p-2 rounded-md hover:bg-gray-100'>
                Adicionar Pasta
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => { setAddOption('bot'); setOpenModalADD(true); }} className='p-2 rounded-md hover:bg-gray-100'>
                Adicionar Bot
              </DropdownMenu.Item>
            </DropdownMenu.Content>

          </div>
          
        </DropdownMenu.Root>
        <div className={` pt-3  w-full ${typeItem.length > 0 ? 'flex flex-col ' : 'flex items-center '}`}>
          {currentItems.length > 0 ? (
            <div className='grid grid-cols-3 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-8'>
              {currentItems.map(item => (
                <div key={item.id} className='w-fit'>
                  {item.type === 'folder' ? (
                    <FolderIcon onClick={() => {console.log("Clicou na pasta:", item.id)
                      router.push(`/workspace/folder/${item.id}`);
                      setCurrentFolderId(item.id)}} title={item.title} description={item.description} />
                  ) : (
                    <BotIcon onClick={() => {console.log("Clicou no bot:", item.id)
                      setCurrentBotId(item.id)}} title={item.title} description={item.description} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-gray-500 flex w-full flex-col justify-center items-center '>
              <p>Nenhuma pasta criada</p>
              <p>ou</p>
              <p>bot adicionado</p>
            </div>
          )}
        </div>
        

        {openModalADD && (
          <div>
            {addOption === 'folder' && (
              <Dialog open={openModalADD} onOpenChange={setOpenModalADD} >
                <DialogContent className='w-full   '>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Pasta</DialogTitle>
                    <DialogDescription>
                      <div className='focus-none bg-gray-100 p-4 w-full h-full '>
                        <input type="text" placeholder="Nome da Pasta" value={folderName} onChange={(e) => setFolderName(e.target.value)} className="border p-2 rounded-md w-full" />
                        <input type="text" placeholder="Descrição da Pasta" value={folderDescription} onChange={(e) => setFolderDescription(e.target.value)} className="border p-2 rounded-md w-full mt-2" />
                        <div className='flex space-x-2'>
                          <button onClick={() => { handlerCreateFolder({  title: folderName, description: folderDescription, parentId: currentFolderId }); setFolderName(''); setFolderDescription(''); }} className="bg-blue-500 text-white p-2 rounded-md mt-2">Criar Pasta</button>
                          <button className="bg-red-500 text-white p-2 rounded-md mt-2" onClick={() => setOpenModalADD(false)}>Cancelar</button>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <Dialog />
                </DialogContent>
              </Dialog>
            )}

            {addOption === 'bot' && (
              <Dialog open={openModalADD} onOpenChange={setOpenModalADD} >
                <DialogContent className='w-full   '>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Bot</DialogTitle>
                    <DialogDescription>
                      <div className='focus-none bg-gray-100 p-4 w-full h-full '>
                        <input type="text" placeholder="Nome do Bot" value={botName} onChange={(e) => setBotName(e.target.value)} className="border p-2 rounded-md w-full" />
                        <input type="text" placeholder="Descrição do Bot" value={botDescription} onChange={(e) => setBotDescription(e.target.value)} className="border p-2 rounded-md w-full mt-2" />
                        <div className='flex space-x-2'>
                          <button onClick={() => { handlerCreateBot({title: botName, description: botDescription, parentId: currentFolderId }); setBotName(''); setBotDescription(''); }} className="bg-blue-500 text-white p-2 rounded-md mt-2">Criar Bot</button>
                          <button className="bg-red-500 text-white p-2 rounded-md mt-2" onClick={() => setOpenModalADD(false)}>Cancelar</button>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <Dialog />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </div>
  )

}