import React from 'react';

interface ProfileCardProps {
    avatarUrl?: string;
    miniAvatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    showUserInfo?: boolean;
    onContactClick?: () => void;
    className?: string;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl = 'https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-04-zm6M8gEw8b8V8h8k8k8k8k8k8k8k8k.png', // Fallback or placeholder
    miniAvatarUrl,
    name = 'Javi A. Torres',
    title = 'Software Engineer',
    handle = 'javicodes',
    status = 'Online',
    contactText = 'Contact',
    showUserInfo = true,
    onContactClick,
    className = ''
}) => {
    return (
        <div className={`relative touch-none  w-full h-full max-h-[380px] border border-neutral-200/80   aspect-[0.718] group ${className}`}>
            {/* Behind Glow */}
            <div
                className="absolute inset-0 z-0 pointer-events-none bg-linear-to-tr  from-neutral-100 to-white saturate-[1.1] "

            />

            <div className="relative z-[1] w-full h-full  overflow-hidden border border-white/10  bg-black/5">
                {/* Background Gradient & Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full relative bg-blue-500/10 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)]">

                        {Array.from({ length: 300 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(0,0,0,0.15)] outline-offset-[-0.25px]"
                                style={{
                                    top: `${i * 16 - 120}px`,
                                    left: "-100%",
                                    width: "300%",
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 w-full h-full grid place-items-center">

                    {/* Main Avatar Image */}
                    <img
                        className="w-full absolute left-1/2 bottom-0 -translate-x-1/2 object-cover"
                        src={avatarUrl}
                        alt={name}
                        loading="lazy"
                    />

                    {/* Top Info (Name/Title) */}
                    <div className="absolute top-[8%] w-full flex flex-col items-center text-center z-20">
                        <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight ">
                            {name}
                        </h3>
                        <p className="text-[13px] font-medium text-neutral-700/90  tracking-wide">
                            {title}
                        </p>
                    </div>

                    {/* Bottom User Info Card */}
                    {showUserInfo && (
                        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between backdrop-blur-xl bg-black/20 border border-white/10 rounded-md p-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                                    <img
                                        className="w-full h-full bg-blue-600/60 object-cover"
                                        src={miniAvatarUrl || avatarUrl}
                                        alt="mini avatar"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <div className="text-xs font-medium text-white/90 leading-none">@{handle}</div>
                                    <div className="text-[10px] text-white/70 leading-none">{status}</div>
                                </div>
                            </div>
                            <button
                                onClick={onContactClick}
                                className="border border-white/10 rounded px-3 py-1.5 text-[10px] font-semibold text-white/90 backdrop-blur-md hover:bg-white/10 transition-colors"
                            >
                                {contactText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
