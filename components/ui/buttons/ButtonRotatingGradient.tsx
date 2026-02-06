import { forwardRef } from "react"

const ButtonRotatingGradient = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    (props, ref) => {
        return (
            <button
                ref={ref}
                {...props}
                className='relative inline-flex  overflow-hidden rounded-full p-[2px] ease-in-out duration-300 focus:scale-95'
            >
                <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ccdbfc_0%,#155dfc_60%,#ccdbfc_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                <span className='relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-blue-600 px-4 py-2 text-sm font-medium dark:text-neutral-50 text-white backdrop-blur-3xl'>
                    Download
                    <div className="absolute top-0 left-0 w-2/5 translate-y-1/3 -translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                    <div className="absolute top-0 right-0 w-2/5 -translate-y-1/3 translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                </span>
            </button>
        );
    }
);

ButtonRotatingGradient.displayName = "ButtonRotatingGradient";

export default ButtonRotatingGradient;

