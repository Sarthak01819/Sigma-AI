import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { use, useContext, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Lock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { useUser } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

const AiMultiModel = () => {

    const { user } = useUser();

    const [aiModelList, setAiModelList] = useState(AiModelList)

    const { aiSelectedModel, setAiSelectedModel } = useContext(AiSelectedModelContext)

    const onToggleChange = (model, value) => {
        setAiModelList((prev) => {
            return prev.map((m) => m.model == model ? { ...m, enable: value } : m)
        })
    }

    const onSelectValue = async (parentModel, value) => {
        setAiSelectedModel(prev => ({
            ...prev,
            [parentModel]: {
                modelId: value,
            }
        }))
        // Update the firebase database
        const docRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
        await updateDoc(docRef, {
            selectedModelPref: aiSelectedModel,
        });
    }

    return (
        <div className='flex flex-1 h-[75vh] border-b '>
            {aiModelList.map((model, index) => {
                return <div key={index} className={`flex flex-col border-r h-full ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'} `}>
                    <div className='flex w-full h-[70px] items-center justify-between border-b p-3 '>
                        <div className='flex items-center gap-4'>
                            <Image src={model.icon} alt={'model.name'} width={24} height={24} />
                            {model.enable && <Select defaultValue = {aiSelectedModel[model.model].modelId} onValueChange={(value) => onSelectValue(model.model, value)} disabled={model.premium}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={aiSelectedModel[model.model].modelId} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Free</SelectLabel>
                                        {model.subModel.map((subModel, index) => subModel.premium == false && (
                                            <SelectItem key={index} value={subModel.id}>{subModel.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Premium</SelectLabel>
                                        {model.subModel.map((subModel, index) => subModel.premium == true && (
                                            <SelectItem key={index} value={subModel.id} disabled={subModel.premium}>{subModel.name} {subModel.premium && <Lock className='h-3 w-3' />}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>}
                        </div>
                        <div>
                            {model.enable ? <Switch checked={model.enable} onCheckedChange={(v) => onToggleChange(model.model, v)} />
                                : <MessageSquare onClick={() => onToggleChange(model.model, true)} />}
                        </div>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        {model.premium && model.enable && <Button className="w-[50%] mx-auto my-4"><Lock /> Upgrade to Plus</Button>}
                    </div>
                </div>
            })}

        </div>
    )
}

export default AiMultiModel