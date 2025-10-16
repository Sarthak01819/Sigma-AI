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

    // messages is an object keyed by model name -> array of messages
    const [messages, setMessages] = useState({})

    const { user } = useUser();

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress
        if (user && email) {
            CreateNewuser();
        }
    }, [user])

        useEffect(() => {
            if(aiSelectedModel) {
                updatedAIModelSelectionPref();
            }
        }, [aiSelectedModel])

    const updatedAIModelSelectionPref = async () => {
        try {
            const email = user?.primaryEmailAddress?.emailAddress
            if (!email) return
            const docRef = doc(db, 'users', email)
            // write the current selected model preferences to the user document (merge so other fields remain)
            await setDoc(docRef, { selectedModelPref: aiSelectedModel }, { merge: true })
        } catch (err) {
            console.error('Failed to update AI model selection preference:', err)
        }
    }
    

    const CreateNewuser = async () => {
        // If user exists?
        const email = user?.primaryEmailAddress?.emailAddress
        if (!email) return
        const userRef = doc(db, 'users', email)
        const userSnap = await getDoc(userRef)

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