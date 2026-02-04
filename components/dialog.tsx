import { ChevronLeftIcon } from 'lucide-react'
import { Iphone } from '@/components/ui/mobileDevices/Phone'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const DialogStickyFooterDemo = ({ trigger }: { trigger?: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <Button variant='outline'>Sticky Footer Dialog</Button>}
            </DialogTrigger>
            <DialogContent className='max-h-screen w-full border-none bg-transparent p-0 shadow-none sm:max-w-[400px]'>
                <Iphone className="w-full h-full drop-shadow-2xl">
                    <div className='flex h-full w-full flex-col bg-white'>
                        <DialogHeader className='contents space-y-0 text-left'>
                            <ScrollArea className='flex-1 overflow-y-auto'>
                                <DialogTitle className='px-6 pt-12 pb-6'>Product Information</DialogTitle>
                                <DialogDescription asChild>
                                    <div className='px-6 pb-6'>
                                        <div className='[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold text-sm'>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Product Name:</strong> SuperTech 2000
                                                </p>
                                                <p>
                                                    The SuperTech 2000 is a high-performance device designed for tech enthusiasts and professionals
                                                    alike, offering superior functionality and innovative features.
                                                </p>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Specifications:</strong>
                                                </p>
                                                <ul>
                                                    <li>Processor: 3.6GHz Octa-Core</li>
                                                    <li>Memory: 16GB RAM</li>
                                                    <li>Storage: 1TB SSD</li>
                                                    <li>Display: 15.6&rdquo; 4K UHD</li>
                                                    <li>Battery Life: 12 hours</li>
                                                    <li>Weight: 2.1kg</li>
                                                </ul>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Key Features:</strong>
                                                </p>
                                                <ul>
                                                    <li>Ultra-fast processing speed for intensive tasks</li>
                                                    <li>Long battery life, perfect for on-the-go professionals</li>
                                                    <li>Sleek and portable design</li>
                                                    <li>Advanced cooling system</li>
                                                    <li>Excellent build quality for durability</li>
                                                </ul>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Price:</strong>
                                                </p>
                                                <p>$2,499.99 (Includes 1-year warranty)</p>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Customer Reviews:</strong>
                                                </p>
                                                <p>
                                                    &rdquo;Absolutely fantastic device! The performance is exceptional, and it handles all of my
                                                    design software without any lag.&rdquo; - John D.
                                                </p>
                                                <p>
                                                    &rdquo;Best purchase I&apos;ve made in years. The display quality is stunning, and the battery
                                                    lasts all day.&rdquo; - Sarah L.
                                                </p>
                                                <p>
                                                    &rdquo;The SuperTech 2000 is a game-changer in the tech industry. Worth every penny!&rdquo; - Emma
                                                    W.
                                                </p>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Return Policy:</strong>
                                                </p>
                                                <p>
                                                    If you&apos;re not satisfied with your purchase, we offer a 30-day return policy. Return the
                                                    product within 30 days of purchase for a full refund.
                                                </p>
                                            </div>
                                            <div className='space-y-1'>
                                                <p>
                                                    <strong>Warranty:</strong>
                                                </p>
                                                <p>
                                                    Comes with a standard 1-year warranty covering defects in materials and workmanship. Extended
                                                    warranty plans are available.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </DialogDescription>
                            </ScrollArea>
                        </DialogHeader>
                        <DialogFooter className='flex-row items-center justify-end border-t px-6 py-4 bg-gray-50/50 backdrop-blur-sm mt-auto'>
                            <DialogClose asChild>
                                <Button variant='outline' size="sm">
                                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            </DialogClose>
                            <Button type='button' size="sm">Read More</Button>
                        </DialogFooter>
                    </div>
                </Iphone>
            </DialogContent>
        </Dialog>
    )
}

export default DialogStickyFooterDemo
