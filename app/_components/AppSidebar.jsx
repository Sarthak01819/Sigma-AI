"use client"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import Image from "next/image"

export function AppSidebar() {

    const { theme, setTheme } = useTheme();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-3">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center ">
                            <Image src={'logo.svg'} alt="logo" width={60} height={60} className="w-[40px] h-[40px]" />
                            <h2 className="text-2xl font-bold">Sigma AI</h2>
                        </div>
                        <div>
                            {theme == 'light' ? <Button onClick={() => setTheme('dark')}><Sun /></Button>
                                : <Button onClick={() => setTheme('light')}><Moon /></Button>}
                        </div>
                    </div>
                    <Button className="w-full mt-4">+ New Chat</Button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className='p-3'>
                        <h2 className="font-bold text-lg">Chat</h2>
                        <p className="text-sm text-gray-400">Sign in  to start chating with multiple AI models </p>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button className="w-full mb-4">Upgrade to Plus</Button>
            </SidebarFooter>
        </Sidebar>
    )
}