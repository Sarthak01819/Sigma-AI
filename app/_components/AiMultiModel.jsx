import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
import { useAuth, useUser } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useSearchParams } from 'next/navigation'

const AiMultiModel = () => {

    const { has } = useAuth();

    // Safe wrapper: some auth contexts may not provide `has` as a function
    const hasPlan = (criteria) => {
        try {
            if (typeof has === 'function') return has(criteria);
        } catch (e) {
            console.warn('Error calling has():', e);
        }
        return false;
    }

    const { user } = useUser();

    const [aiModelList, setAiModelList] = useState(AiModelList)

    const { aiSelectedModel, setAiSelectedModel, messages, setMessages } = useContext(AiSelectedModelContext)

    const onToggleChange = (model, value) => {
        setAiModelList((prev) => {
            return prev.map((m) => m.model === model ? { ...m, enable: value } : m)
        })

        setAiSelectedModel((prev) => ({
            ...prev,
            [model]: {
                ...(prev?.[model] ?? {}),
                enable: value,
            }
        }))
    }

    const onSelectValue = async (parentModel, value) => {
        // Update local selected model state
        setAiSelectedModel(prev => ({
            ...prev,
            [parentModel]: {
                modelId: value,
            }
        }))
    }

    return (
        <div className='flex flex-1 h-[75vh] border-b '>
            {aiModelList.map((model, index) => {
                return <div key={index} className={`flex flex-col border-r h-full ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'} `}>
                    <div className='flex w-full h-[70px] items-center justify-between border-b p-3 '>
                        <div className='flex items-center gap-4'>
                            <Image src={model.icon} alt={'model.name'} width={24} height={24} />
                            {!hasPlan({ plan: 'unlimited_plan' }) && model.enable && <Select defaultValue={aiSelectedModel[model.model].modelId} onValueChange={(value) => onSelectValue(model.model, value)} disabled={model.premium}>
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
                            {model.enable ? <Switch checked={model.enable} disabled={!hasPlan({ plan: 'unlimited_plan' }) && model.premium} onCheckedChange={(v) => onToggleChange(model.model, v)} />
                                : <MessageSquare onClick={() => onToggleChange(model.model, true)} />}
                        </div>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        {!hasPlan({ plan: 'unlimited_plan' }) && model.premium && model.enable && <Button className="w-[50%] mx-auto my-4"><Lock /> Upgrade to Plus</Button>}
                    </div>
                    <div>
                        {model.enable && (!model.premium || hasPlan({ plan: 'unlimited_plan' })) ? (
                            <div className='flex-1 p-4 space-y-2 overflow-auto max-h-[65vh]'>
                                {Array.isArray(messages?.[model.model]) ? (
                                    messages[model.model].map((m, i) => (
                                        <div key={i} className={`p-2 rounded-md ${m.role == 'user' ?
                                            "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
                                            }`}>

                                            {m.role == 'assistant' && (
                                                <span className='block text-xs text-gray-500'>{m.model ?? model.model}</span>
                                            )}
                                            <div className='max-h-[50vh] overflow-auto px-2'>
                                                {m?.content !== 'loading' && m?.content &&
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {m?.content}
                                                    </ReactMarkdown>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-sm text-muted-foreground'>No messages yet.</div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            })}

        </div>
    )
}

export default AiMultiModel