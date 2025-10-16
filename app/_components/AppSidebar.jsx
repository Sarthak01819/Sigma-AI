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
import { Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes";
import Image from "next/image"
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";

export function AppSidebar() {

    const { theme, setTheme } = useTheme();
    const { user } = useUser();

    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        user && GetChatHistory();
    }, [user])

    const GetChatHistory = async () => {
        const q = query(collection(db, 'chatHistory'), where("userEmail", "==", user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, doc.data());
            setChatHistory(prev => [...prev, doc.data()])
        });
    }

    const GetLastUserMessageFromChat = (chat) => {
    const allMessages = Object.values(chat.messages || {}).flat();
    const userMessages = allMessages.filter(msg => msg.role === 'user');
    const lastUserMsgObj = userMessages[userMessages.length - 1];

    // Safely get the content (handles both array or string cases)
    let lastUserMsg = null;
    if (lastUserMsgObj) {
        if (Array.isArray(lastUserMsgObj.content)) {
            lastUserMsg = lastUserMsgObj.content[0]?.text || null;
        } else if (typeof lastUserMsgObj.content === 'string') {
            lastUserMsg = lastUserMsgObj.content;
        }
    }

    const lastUpdated = chat.lastUpdated || Date.now();
    const formattedDate = moment(lastUpdated).fromNow();

    return {
        chatId: chat.chatId,
        message: lastUserMsg,
        lastMsgDate: formattedDate,
    };
};


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
                    {user ?
                        <Link href={'/'}>
                            <Button className="w-full mt-4">+ New Chat</Button>
                        </Link> :
                        <SignInButton mode="modal">
                            <Button className={"w-full mt-4 cursor-pointer"}>Sign In to start</Button>
                        </SignInButton>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className='py-3 relative '>
                        <h2 className="font-bold text-lg px-2 ">Chat</h2>
                        {!user && <p className="text-sm text-gray-400">Sign in  to start chating with multiple AI models </p>}

                        <div className="w-full px-2 max-h-[40vh] absolute overflow-y-auto">
                            {chatHistory.map((chat, index) => (
                                <Link href={'?chatId=' + chat.chatId} key={index} className="p-3 mt-3 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex justify-between items-center">
                                    <p className="text-sm line-clamp-1">{GetLastUserMessageFromChat(chat).message}</p>
                                    <p className="text-sm line-clamp-1">{GetLastUserMessageFromChat(chat).lastMsgDate}</p>
                                </Link>
                            ))}

                        </div>

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