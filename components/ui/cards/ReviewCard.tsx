import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(to bottom, #4c75fc, #2a52d9)';

interface ReviewCardProps {
    avatarUrl?: string;
    innerGradient?: string;
    className?: string;
    name?: string;
    role?: string;
    company?: string;
    reviewText?: string;
    rating?: number;
}

const ReviewCardComponent: React.FC<ReviewCardProps> = ({
    avatarUrl,
    innerGradient,
    className = '',
    name = 'Jane Doe',
    role = 'CEO',
    company = 'TechCorp',
    reviewText = "SetWise has completely transformed how we manage our business. The insights are invaluable and the automation saves us hours every week.",
    rating = 5,
}) => {

    const cardRadius = '12px';

    const cardStyle = useMemo(
        () => ({
            '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
            '--card-radius': cardRadius,
        }),
        [innerGradient, cardRadius]
    );

    return (
        <div
            className={`relative touch-none ${className}`.trim()}
            style={{ ...cardStyle } as React.CSSProperties}
        >
            <div className="relative z-1 group h-full cursor-pointer">
                <section
                    className="grid relative overflow-hidden h-full"
                    style={{
                        borderRadius: cardRadius,
                        background: 'rgba(255, 255, 255, 1)', // White background for review card
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <div className="p-5 flex flex-col justify-between h-full gap-4">

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`size-3 ${i < rating ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-gray-200 text-gray-200'}`}
                                />
                            ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-[#37322F] text-[13px] leading-relaxed font-medium">
                            "{reviewText}"
                        </p>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                            {avatarUrl && (
                                <img
                                    src={avatarUrl}
                                    alt={name}
                                    className="size-8 rounded-full object-cover bg-gray-100"
                                />
                            )}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[#1F2937]">{name}</span>
                                <span className="text-xs text-[#6B7280]">{role}, {company}</span>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

const ReviewCard = React.memo(ReviewCardComponent);
export default ReviewCard;
