import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModel from './AiMultiModel'

const ChatInputBox = () => {
  return (
    <div className='relative min-h-screen'>
        {/* Page Content */}
        <div>
            <AiMultiModel />
        </div>
        {/* Fixed Chat Input Box at the bottom */}
        <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4 '>
            <div className='w-full rounded-xl shadow-md max-w-2xl p-4'>
                <input type="text" name="" id="" placeholder='Ask me anything...' className='border-0 outline-none w-full' />
                <div className='mt-3'>
                    <Button variant={'ghost'} size={'icon'}><Paperclip className='h-5 w-5' /></Button>
                    <div className='flex gap-3 float-right'>
                        <Button variant={'ghost'} size={'icon'}><Mic /></Button>
                        <Button size={'icon'} className={''}><Send /> </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInputBox