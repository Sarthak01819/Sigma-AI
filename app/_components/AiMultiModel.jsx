import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Lock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AiMultiModel = () => {

    const [aiModelList, setAiModelList] = useState(AiModelList)

    const onToggleChange = (model, value) => {
        setAiModelList((prev) => {
            return prev.map((m) => m.model == model ? { ...m, enable: value } : m)
        })
    }

    return (
        <div className='flex flex-1 h-[75vh] border-b '>
            {aiModelList.map((model, index) => {
                return <div key={index} className={`flex flex-col border-r h-full ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'} `}>
                    <div className='flex w-full h-[70px] items-center justify-between border-b p-3 '>
                        <div className='flex items-center gap-4'>
                            <Image src={model.icon} alt={'model.name'} width={24} height={24} />
                            {model.enable && <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={model.subModel[0].name} />
                                </SelectTrigger>
                                <SelectContent>
                                    {model.subModel.map((subModel, index) => (
                                        <SelectItem key={index} value={subModel.name}>{subModel.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>}
                        </div>
                        <div>
                            {model.enable ? <Switch checked={model.enable} onCheckedChange={(v) => onToggleChange(model.model, v)} />
                                : <MessageSquare onClick={() => onToggleChange(model.model, true)} />}
                        </div>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        { model.premium && model.enable && <Button className="w-[50%] mx-auto my-4"><Lock /> Upgrade to Plus</Button>}
                    </div>
                </div>
            })}

        </div>
    )
}

export default AiMultiModel