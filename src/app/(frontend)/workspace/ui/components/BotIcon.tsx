"use client"

import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical, Trash2, FolderPen } from 'lucide-react'
import React from 'react'

interface BotIconProps {
  title: string
  description: string
  onClick?: () => void
}

export default function BotIcon({ title, description, onClick }: BotIconProps) {

    // after:content-['']
    // after:absolute
    // after:-top-[1.5px]
    // after:-left-[1px]
    // after:w-[17px]
    // after:h-[8px]
    // after:bg-gray-950       
    // after:rounded-tl-md
    // after:border
    // after:border-gray-700
    // after:border-t-gray-700
    // after:border-r-0
    // after:border-b-0
    // after:-z-10

  const [optionBot, setOptionBot] = React.useState< 'Excluir' | 'Editar'>('Editar');

  return (
    <div className="relative z-0 w-24 h-16 bg-gray-400 border">
          <div className="relative z-20 flex  items-center ">
            <DropdownMenu.Root >
              <DropdownMenu.Trigger asChild>
                <EllipsisVertical className="absolute z-10 right-0.5 w-3 h-2 top-0 text-white cursor-pointer" />
              </DropdownMenu.Trigger>
    
              <DropdownMenu.Content className=" flex flex-col w-24 max-w-20 z-10 rounded-md p-1">
                {/* <DropdownMenu.Item className='divide-y-2 text-sm text-white' onClick={() => setOptionFolder('Renomear')}> Renomear</DropdownMenu.Item> */}
                <DropdownMenu.Item className=' flex w-full text-sm text-white items-center justify-between gap-1 text-left' onClick={() => setOptionBot('Excluir')}><Trash2 className='w-3 h-3' /> <span className='text-left flex flex-1'>Excluir</span></DropdownMenu.Item>
                <DropdownMenu.Separator className='w-full h-0 flex border border-gray-700/20' />
                <DropdownMenu.Item className=' flex w-full text-sm text-white items-center justify-between gap-1 text-left' onClick={() => setOptionBot('Editar')}><FolderPen className='w-3 h-3' /> <span className='text-left flex flex-1'>Editar</span></DropdownMenu.Item>
              </DropdownMenu.Content>
    
            </DropdownMenu.Root>
            <div className=' relative px-1 flex flex-col  w-full justify-between h-full py-2 overflow-hidden'>
              <span className="text-[10px]">{title}</span>
              <p className=' text-[10px] w-full text-xs text-gray-500 overflow-hidden text-nowrap overflow-ellipsis flex-wrap max-h-4'>{description}</p>
            </div>
          </div>
        </div>
  )
}
