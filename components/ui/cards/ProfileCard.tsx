import React from 'react';

interface ProfileCardProps {
    avatarUrl?: string;
    linkedinUrl?: string; // Added prop
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
    avatarUrl = '/jernej.png',
    miniAvatarUrl,
    name = 'Javi A. Torres',
    title = 'Software Engineer',
    handle = 'javicodes',
    linkedinUrl,
    status = 'Online',
    contactText = 'Contact',
    showUserInfo = true,
    onContactClick,
    className = ''
}) => {
    return (
        <div className={`relative touch-none pointer-events-none md:pointer-events-auto w-full h-full max-h-80 max-w-[300px] lg:max-h-95 border border-surface-200 dark:border-surface-300 aspect-[0.718] group ${className}`}>

            {/* Behind Glow */}
            <div className="absolute inset-0 z-(--z-base) pointer-events-none bg-linear-to-tr from-surface-100 to-card saturate-[1.1]" />

            <div className="relative z-(--z-raised) w-full h-full overflow-hidden border border-white/10 dark:border-surface-400/20 bg-surface-950/5 dark:bg-surface-200/40">

                {/* Background Pattern */}
                <div className="absolute inset-0 z-(--z-base)">
                    <div className="w-full h-full relative bg-brand-500/10 dark:bg-brand-400/15 mask-[radial-gradient(200px_circle_at_center,white,transparent)]">
                        {Array.from({ length: 300 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-950/15 dark:outline-surface-600/20 outline-offset-[-0.25px]"
                                style={{
                                    top: `${i * 16 - 120}px`,
                                    left: "-100%",
                                    width: "300%",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-(--z-raised) w-full h-full grid place-items-center">

                    {/* Main Avatar Image */}
                    <img
                        className="w-full absolute left-1/2 bottom-0 -translate-x-1/2 object-cover"
                        src={avatarUrl}
                        alt={name}
                        loading="lazy"
                    />

                    {/* Top Info (Name/Title) */}
                    <div className="absolute top-[8%] w-full flex flex-col items-center text-center z-(--z-dropdown)">
                        <h3 className="text-subheadline md:text-title-3 lg:text-title-2 font-semibold text-surface-900">
                            {name}
                        </h3>
                        <p className="text-caption-1 md:text-footnote font-medium text-surface-700/90 dark:text-surface-600">
                            {title}
                        </p>
                    </div>

                    {/* Bottom User Info Card */}
                    {showUserInfo && (
                        <div className="absolute bottom-(--space-3) left-(--space-3) right-(--space-3) lg:bottom-(--space-4) lg:left-(--space-4) lg:right-(--space-4) z-(--z-dropdown) flex items-center justify-between backdrop-blur-(--blur-ultra) bg-surface-950/20 dark:bg-surface-50/15 border border-white/10 dark:border-surface-50/10 rounded-lg p-(--space-2) lg:p-(--space-2\.5) gap-2 pointer-events-auto">
                            <div className="flex items-center gap-(--space-2) lg:gap-(--space-2\.5) min-w-0 overflow-hidden">
                                <div className="size-8 lg:size-9 rounded-full overflow-hidden border border-white/10 dark:border-surface-50/10 shrink-0">
                                    <img
                                        className="w-full h-full bg-brand-600/60 dark:bg-brand-400/40 object-cover antialiased"
                                        src={miniAvatarUrl || avatarUrl}
                                        alt={`${handle} avatar`}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-0.5 min-w-0 overflow-hidden">
                                    <span className="text-caption-1 font-medium text-white/90 leading-none truncate w-full">@{handle}</span>
                                    <span className="text-caption-2 text-white/70 leading-none truncate w-full">{status}</span>
                                </div>
                            </div>

                            {linkedinUrl ? (
                                <a
                                    href={linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/10 rounded-md px-(--space-2) lg:px-(--space-3) py-(--space-1) lg:py-(--space-1\.5) text-caption-2 font-semibold text-white/90 backdrop-blur-(--blur-medium) hover:bg-white/10 transition-colors duration-(--duration-fast) ease-(--ease-apple) min-h-7 lg:min-h-8 flex items-center justify-center shrink-0 cursor-pointer text-center whitespace-nowrap"
                                >
                                    {contactText}
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onContactClick}
                                    className="border border-white/10 rounded-md px-(--space-2) lg:px-(--space-3) py-(--space-1) lg:py-(--space-1\.5) text-caption-2 font-semibold text-white/90 backdrop-blur-(--blur-medium) hover:bg-white/10 transition-colors duration-(--duration-fast) ease-(--ease-apple) min-h-7 lg:min-h-8 shrink-0 cursor-pointer whitespace-nowrap"
                                >
                                    {contactText}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
