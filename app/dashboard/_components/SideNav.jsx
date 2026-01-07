"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'


import { Moon, Sun } from "lucide-react"
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


function SideNav() {

  const { setTheme } = useTheme()
  const [menuList, setMenuList] = useState([]);
  const path = usePathname();
  useEffect(() => {
    const role_id = GlobalDataService.getRole()
    const routeIds = ROUTE_ACCESS[role_id];
    const myMenuList = routeIds.map(x => NAVIGATION_ROUTES.find(y => y.id == x)).filter(x => x)
    setMenuList(myMenuList)
  }, [])
  return (
    <div className='border shadow-md h-screen p-5'>
      <Image src={'/logo.svg'}
        width={180}
        height={50}
        alt='logo' />

      <hr className='my-5'></hr>
      {menuList.map((menu, index) => (

        //left sider bar button color
        <Link href={menu.path}>
          <h2 className={`flex items-center gap-3 text-md p-4
        text-slate-500
        hover:bg-primary
        hover:text-white
        cursor-pointer
        rounded-lg
        my-2
        ${path == menu.path && 'bg-primary text-white'}
        `}>
            <menu.icon />
            {menu.name}
          </h2>
        </Link>
      ))}

      <div className="absolute bottom-5 left-6 flex justify-center align-center gap-2">
        <Profile />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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