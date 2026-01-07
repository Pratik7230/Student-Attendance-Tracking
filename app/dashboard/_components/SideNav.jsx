"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'


import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlobalDataService } from '@/app/_services/globalDataService'
import Profile from './Profile'
import { NAVIGATION_ROUTES, ROUTE_ACCESS } from '@/app/constants'


function SideNav({ isMobile = false, onClose }) {

  const { setTheme } = useTheme()
  const [menuList, setMenuList] = useState([]);
  const path = usePathname();
  useEffect(() => {
    const role_id = GlobalDataService.getRole()
    const routeIds = ROUTE_ACCESS[role_id];
    const myMenuList = routeIds.map(x => NAVIGATION_ROUTES.find(y => y.id == x)).filter(x => x)
    setMenuList(myMenuList)
  }, [])

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  }

  return (
    <div className={`border shadow-md h-screen p-3 md:p-5 ${isMobile ? 'w-full' : ''} overflow-y-auto`}>
      <div className='flex items-center justify-between mb-3 md:mb-0'>
        <Image src={'/logo.svg'}
          width={isMobile ? 120 : 180}
          height={isMobile ? 35 : 50}
          alt='logo'
          className='object-contain' />
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <hr className='my-3 md:my-5'></hr>
      <div className='flex flex-col gap-1 md:gap-0'>
        {menuList.map((menu, index) => (
          <Link key={index} href={menu.path} onClick={handleLinkClick}>
            <h2 className={`flex items-center gap-2 md:gap-3 text-sm md:text-md p-3 md:p-4
          text-slate-500
          hover:bg-primary
          hover:text-white
          cursor-pointer
          rounded-lg
          my-1 md:my-2
          ${path == menu.path && 'bg-primary text-white'}
          `}>
              <menu.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="truncate">{menu.name}</span>
            </h2>
          </Link>
        ))}
      </div>

      <div className={`${isMobile ? 'relative mt-5' : 'absolute bottom-5 left-3 md:left-6'} flex justify-center items-center gap-2`}>
        <Profile />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SideNav