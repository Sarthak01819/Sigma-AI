"use client"

import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

const Provider = ({ children, ...props }) => {

    const {user} = useUser();

    useEffect(() => {
        if (user) {
            CreateNewuser();
        }
    }, [user])

    const CreateNewuser = async () => {
        // If user exists?
        const userRef = doc(db, 'users',user.primaryEmailAddress?.emailAddress);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()){
            console.log('User already exists');
            return;
        }
        else {
            // Create a new user
            const userData = {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                createdAt: new Date(),
                remainingMsg: 5, // Only for free  users
                plan: 'free',
                credits: 1000, // Paid users
            };
            await setDoc(userRef, userData);
            console.log('New user created');
        }

        // If not create a new user
    }

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            {...props}>
            <SidebarProvider>
                <AppSidebar />

                <div className='w-full'>
                    <AppHeader />
                    {children}
                </div>
            </SidebarProvider>
        </NextThemesProvider>
    )
}

export default Provider