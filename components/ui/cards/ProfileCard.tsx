import React, { useMemo } from 'react';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(to bottom, #4c75fc, #4c75fc)';

interface ProfileCardProps {
    avatarUrl?: string;
    iconUrl?: string;
    grainUrl?: string;
    innerGradient?: string;
    behindGlowEnabled?: boolean;
    behindGlowColor?: string;
    behindGlowSize?: string;
    className?: string;
    miniAvatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    showUserInfo?: boolean;
    onContactClick?: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl = '<Placeholder for avatar URL>',
    iconUrl = '<Placeholder for icon URL>',
    grainUrl = '<Placeholder for grain URL>',
    innerGradient,
    behindGlowEnabled = true,
    behindGlowColor,
    behindGlowSize,
    className = '',
    miniAvatarUrl,
    name = 'Javi A. Torres',
    title = 'Software Engineer',
    handle = 'javicodes',
    status = 'Online',
    contactText = 'Contact',
    showUserInfo = true,
    onContactClick
}) => {

    const cardRadius = '0px';

    const cardStyle = useMemo(
        () => ({
            '--icon': iconUrl ? `url(${iconUrl})` : 'none',
            '--grain': grainUrl ? `url(${grainUrl})` : 'none',
            '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
            '--behind-glow-color': behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
            '--behind-glow-size': behindGlowSize ?? '50%',
            '--card-radius': cardRadius,
        }),
        [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize, cardRadius]
    );

    return (
        <div
            className={`relative touch-none ${className}`.trim()}
            style={{ ...cardStyle } as React.CSSProperties}
        >
            {behindGlowEnabled && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
                        filter: 'blur(50px) saturate(1.1)',
                        opacity: 0.8
                    }}
                />
            )}
            <div className="relative z-[1] group">

                <section
                    className="grid relative overflow-hidden"
                    style={{
                        height: '100%',
                        maxHeight: '380px',
                        aspectRatio: '0.718',
                        borderRadius: 0,
                        background: 'rgba(0,0,0,0)',
                    }}
                >
                    {/* Blurred Gradient Background*/}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: 'var(--inner-gradient)',
                            borderRadius: cardRadius,
                            filter: 'blur(28px)',
                            transform: 'scale(1.2)', // Scale up to cover edges
                        }}
                    />

                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <div className="w-full h-full relative">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(25,68,185,0.2)] outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    {/* Content Container */}
                    <div
                        className="relative z-10 shadow-[0px_0px_3px_3px_rgba(60,60,60,0.2)] border border-[rgba(55,50,47,0.12)]"
                        style={{
                            borderRadius: 0,
                            display: 'grid',
                            gridArea: '1 / -1',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {/* Avatar content */}
                        <div
                            className="overflow-visible"
                            style={{
                                gridArea: '1 / -1',
                                borderRadius: cardRadius,
                                pointerEvents: 'none',
                            }}
                        >
                            <img
                                className="w-full absolute left-1/2 bottom-[-1px]"
                                src={avatarUrl}
                                alt={`${name || 'User'} avatar`}
                                loading="lazy"
                                style={{
                                    transformOrigin: '50% 100%',
                                    transform: 'translateX(-50%)',
                                    borderRadius: cardRadius,
                                }}
                                onError={e => {
                                    const t = e.target as HTMLImageElement;
                                    t.style.display = 'none';
                                }}
                            />
                            {showUserInfo && (
                                <div
                                    className="absolute z-[2] flex items-center justify-between backdrop-blur-[30px] border border-white/10 pointer-events-auto"
                                    style={
                                        {
                                            '--ui-inset': '16px',
                                            '--ui-radius-bias': '6px',
                                            bottom: 'var(--ui-inset)',
                                            left: 'var(--ui-inset)',
                                            right: 'var(--ui-inset)',
                                            background: 'rgba(0, 0, 0, 0.2)',
                                            borderRadius: '6px',
                                            padding: '10px 12px'
                                        } as React.CSSProperties
                                    }
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="rounded-full overflow-hidden border border-white/10 flex-shrink-0"
                                            style={{ width: '36px', height: '36px' }}
                                        >
                                            <img
                                                className="w-full h-full bg-blue-600/60 object-cover rounded-full"
                                                src={miniAvatarUrl || avatarUrl}
                                                alt={`${name || 'User'} mini avatar`}
                                                loading="lazy"
                                                style={{ display: 'block', gridArea: 'auto', borderRadius: '50%', pointerEvents: 'auto' }}
                                                onError={e => {
                                                    const t = e.target as HTMLImageElement;
                                                    t.style.opacity = '0.5';
                                                    t.src = avatarUrl;
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="text-xs font-medium text-white/90 leading-none">@{handle}</div>
                                            <div className="text-[10px] text-white/70 leading-none">{status}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="border border-white/10 rounded-md px-3 py-2 text-[10px] font-semibold text-white/90 cursor-pointer backdrop-blur-[10px] transition-all duration-200 ease-out "
                                        onClick={onContactClick}
                                        style={{ pointerEvents: 'auto', display: 'block', gridArea: 'auto', borderRadius: '6px' }}
                                        type="button"
                                        aria-label={`Contact ${name || 'user'}`}
                                    >
                                        {contactText}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Details content */}
                        <div
                            className="max-h-full overflow-hidden text-center relative z-[5]"
                            style={{
                                gridArea: '1 / -1',
                                borderRadius: cardRadius,
                                pointerEvents: 'none'
                            }}
                        >
                            <div className="w-full absolute flex flex-col" style={{ top: '8%', display: 'flex', gridArea: 'auto' }}>
                                <h3
                                    className="font-semibold m-0 tracking-tight"
                                    style={{
                                        fontSize: '24px',
                                        // Simple white text for better visibility on blue gradient, or keep the gradient text if desired. 
                                        // User asked to reset gradient "od modre do bele" (blue to white) for background. 
                                        // Text visibility might be an issue on white bottom, but top is blue.
                                        color: '#ffffff',
                                        display: 'block',
                                        gridArea: 'auto',
                                        borderRadius: '0',
                                        pointerEvents: 'auto',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {name}
                                </h3>
                                <p
                                    className="font-medium whitespace-nowrap mx-auto w-min"
                                    style={{
                                        position: 'relative',
                                        fontSize: '13px',
                                        margin: '2px auto 0',
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        display: 'block',
                                        gridArea: 'auto',
                                        borderRadius: '0',
                                        pointerEvents: 'auto',
                                        letterSpacing: '0.01em'
                                    }}
                                >
                                    {title}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
