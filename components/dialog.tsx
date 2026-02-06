import { X } from 'lucide-react'
import { Iphone } from '@/components/ui/mobileDevices/Phone'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'

const DialogStickyFooterDemo = ({ trigger }: { trigger?: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <Button variant='outline'>Sticky Footer Dialog</Button>}
            </DialogTrigger>
            <DialogContent showCloseButton={false} className='max-h-screen w-full border-none bg-transparent p-0 shadow-none sm:max-w-[640px]  overflow-visible flex items-center justify-center'>
                <DialogTitle className="sr-only">Phone Preview</DialogTitle>
                <DialogClose className="absolute cursor-pointer -top-10 md:-top-10 right-0 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm text-white border border-white/20">
                    <X className="size-4 md:size-8" />
                    <span className="sr-only">Close</span>
                </DialogClose>
                <div className='w-full h-full max-w-[80%] sm:max-w-[400px] dark'>
                    <Iphone src="/workout.png" className="w-full h-full sm:max-w-[400px] drop-shadow-2xl" />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogStickyFooterDemo
