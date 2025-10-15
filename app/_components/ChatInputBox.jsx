import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useState } from 'react'
import AiMultiModel from './AiMultiModel'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import axios from 'axios'

const ChatInputBox = () => {

    const [userInput, setUserInput] = useState()

    const { aiSelectedModel, setAiSelectedModel, messages, setMessages } = useContext(AiSelectedModelContext)


    const handleSend = async () => {
        if (!userInput.trim()) return;

        // 1️⃣ Add user message to all enabled models
        setMessages((prev) => {
            const updated = { ...prev };
            Object.keys(aiSelectedModel).forEach((modelKey, modelInfo) => {
                if (aiSelectedModel[modelKey].enable !== false && aiSelectedModel[modelKey].modelId) {
                    updated[modelKey] = [
                        ...(updated[modelKey] ?? []),
                        { role: "user", content: userInput },
                    ];
                }
            });
            return updated;
        });

        const currentInput = userInput; // capture before reset
        setUserInput("");

        // 2️⃣ Fetch response from each enabled model
        Object.entries(aiSelectedModel).forEach(async ([parentModel, modelInfo]) => {
            if (!modelInfo.modelId || aiSelectedModel[parentModel].enable == false) return;

            // Add loading placeholder before API call
            setMessages((prev) => ({
                ...prev,
                [parentModel]: [
                    ...(prev[parentModel] ?? []),
                    { role: "assistant", content: "Thinking...", model: parentModel, loading: true },
                ],
            }));


            try {
                const result = await axios.post("/api/ai-multi-model", {
                    model: modelInfo.modelId,
                    msg: [{ role: "user", content: currentInput }],
                    parentModel,
                });

                const { aiResponse, model } = result.data;

                // 3️⃣ Add AI response to that model’s messages
                setMessages((prev) => {
                    const updated = [...(prev[parentModel] ?? [])];
                    const loadingIndex = updated.findIndex((m) => m.loading);

                    if (loadingIndex !== -1) {
                        updated[loadingIndex] = {
                            role: "assistant",
                            content: aiResponse,
                            model,
                            loading: false,
                        };
                    } else {
                        // fallback if no loading msg found
                        updated.push({
                            role: "assistant",
                            content: aiResponse,
                            model,
                            loading: false,
                        });
                    }

                    return { ...prev, [parentModel]: updated };
                });
            } catch (err) {
                console.error(err);
                setMessages((prev) => ({
                    ...prev,
                    [parentModel]: [
                        ...(prev[parentModel] ?? []),
                        { role: "assistant", content: "⚠️ Error fetching response." },
                    ],
                }));
            }
        });
    };


    return (
        <div className='relative min-h-screen'>
            {/* Page Content */}
            <div>
                <AiMultiModel />
            </div>
            {/* Fixed Chat Input Box at the bottom */}
            <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4 '>
                <div className='w-full rounded-xl shadow-md max-w-2xl p-4'>
                    <input type="text" name="" id="" placeholder='Ask me anything...' className='border-0 outline-none w-full' onChange={(event) => setUserInput(event.target.value)} />
                    <div className='mt-3'>
                        <Button variant={'ghost'} size={'icon'}><Paperclip className='h-5 w-5' /></Button>
                        <div className='flex gap-3 float-right'>
                            <Button variant={'ghost'} size={'icon'}><Mic /></Button>
                            <Button size={'icon'} className={''} onClick={handleSend}><Send /> </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInputBox