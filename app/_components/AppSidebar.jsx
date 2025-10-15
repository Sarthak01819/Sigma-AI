"use client"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useUser } from "@clerk/nextjs";
import { Bolt, Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes";
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress";

export function AppSidebar() {

    const { theme, setTheme } = useTheme();
    const { user } = useUser();

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
                    {user ? <Button className="w-full mt-4">+ New Chat</Button> :
                    <SignInButton mode="modal">
                        <Button className={"w-full mt-4 cursor-pointer"}>Sign In to start</Button>
                    </SignInButton>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className='p-3'>
                        <h2 className="font-bold text-lg">Chat</h2>
                        {!user&&<p className="text-sm text-gray-400">Sign in  to start chating with multiple AI models </p>}
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {!user ? <SignInButton mode="modal">
                    <Button className={"w-full mb-4 cursor-pointer"}>Sign In / Sign Up</Button>
                </SignInButton>
                    :
                    <div>
                        <UsageCreditProgress />
                        <Button className={'flex my-4 w-full'} variant={''}>
                            <Zap /><h2>Upgrade to plus</h2>
                        </Button>
                        <Button className={'flex w-full my-5'} variant={'ghost'}>
                            <User2 /><h2>Settings</h2>
                        </Button>
                    </div>
                }
            </SidebarFooter>
        </Sidebar>
    )
}