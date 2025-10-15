"use client"

import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { DefaultModel } from '@/shared/AiModelsShared'
import { UserDetailContext } from '@/context/UserDetailContext'

const Provider = ({ children, ...props }) => {

    const [aiSelectedModel, setAiSelectedModel] = useState(DefaultModel)

    const [userDetail, setUserDetail] = useState()

    const [messages, setMessages] = useState()

    const { user } = useUser();

    useEffect(() => {
        if (user) {
            CreateNewuser();
        }
    }, [user])

    useEffect(() => {
      if(aiSelectedModel) {
        updatedAIModelSelectionPref();
      }
    }, [aiSelectedModel])

    const updatedAIModelSelectionPref = async () => {
        const docRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
        const updated = {
            ...aiSelectedModel,
            [parentModel]: { modelId: value }
        }
        await updateDoc(docRef, {
            selectedModelPref: updated,
        });
    }
    

    const CreateNewuser = async () => {
        // If user exists?
        const userRef = doc(db, 'users', user.primaryEmailAddress?.emailAddress);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log('User already exists');
            const userInfo = userSnap.data();
            setAiSelectedModel(userInfo?.selectedModelPref??DefaultModel);
            setUserDetail(userInfo);
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
            setUserDetail(userData);
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
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <AiSelectedModelContext.Provider value={{ aiSelectedModel, setAiSelectedModel, messages, setMessages }}>
                    <SidebarProvider>
                        <AppSidebar />
                        <div className='w-full'>
                            <AppHeader />
                            {children}
                        </div>
                    </SidebarProvider>
                </AiSelectedModelContext.Provider>
            </UserDetailContext.Provider>
        </NextThemesProvider>
    )
}

export default Provider