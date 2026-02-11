import { forwardRef } from "react"

import { cn } from "@/lib/utils"

const ButtonRotatingGradient = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                
                {...props}
                className={cn(
                    'relative inline-flex overflow-hidden rounded-full p-[2px] ease-in-out duration-(--duration-smooth) focus:scale-95',
                    className
                )}
            >
                <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--brand-200)_0%,var(--brand-500)_60%,var(--brand-200)_100%)]' />
                <span className='relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-brand-600 dark:bg-brand-400 px-(--space-4) py-(--space-2) text-sm font-medium text-white backdrop-blur-(--blur-glass)'>
                    {props.children || "Download"}
                    <div className="absolute top-0 left-0 w-2/5 translate-y-1/3 -translate-x-1/2 h-full bg-white/30 blur-(--blur-medium) rounded-full"></div>
                    <div className="absolute top-0 right-0 w-2/5 -translate-y-1/3 translate-x-1/2 h-full bg-white/30 blur-(--blur-medium) rounded-full"></div>
                </span>
            </button>
        );
    }
);

ButtonRotatingGradient.displayName = "ButtonRotatingGradient";

export default ButtonRotatingGradient;
