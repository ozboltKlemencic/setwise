import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
    avatarUrl?: string;
    className?: string;
    name?: string;
    role?: string;
    company?: string;
    reviewText?: string;
    rating?: number;
}

const ReviewCardComponent: React.FC<ReviewCardProps> = ({
    avatarUrl,
    className = '',
    name = 'Jane Doe',
    role = 'CEO',
    company = 'TechCorp',
    reviewText = "SetWise has completely transformed how we manage our business. The insights are invaluable and the automation saves us hours every week.",
    rating = 5,
}) => {
    return (
        <div className={`relative touch-none max-w-[500px] lg:max-w-none ${className}`.trim()}>
            <div className="relative z-(--z-base) group h-full cursor-pointer">
                <section className="grid relative overflow-hidden h-full rounded-xl bg-card dark:bg-surface-200 border border-surface-200 dark:border-surface-300 shadow-(--shadow-sm)">
                    <div className="p-(--space-5) flex flex-col justify-between h-full gap-(--space-4)">

                        {/* Rating */}
                        <div className="flex items-center gap-(--space-1)" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    aria-hidden="true"
                                    className={`size-3 ${i < rating ? 'fill-star text-star' : 'fill-surface-200 dark:fill-surface-300 text-surface-200 dark:text-surface-300'}`}
                                />
                            ))}
                        </div>

                        {/* Review Text — Apple HIG footnote */}
                        <p className="text-surface-800 text-footnote leading-relaxed font-medium">
                            &ldquo;{reviewText}&rdquo;
                        </p>

                        {/* User Info */}
                        <div className="flex items-center gap-(--space-3) mt-auto pt-(--space-4) border-t border-surface-200 dark:border-surface-300">
                            {avatarUrl && (
                                <img
                                    src={avatarUrl}
                                    alt={name}
                                    className="size-8 rounded-full object-cover bg-surface-200 dark:bg-surface-300"
                                />
                            )}
                            <div className="flex flex-col">
                                <span className="text-subheadline font-semibold text-surface-900">{name}</span>
                                <span className="text-caption-1 text-surface-500">{role} {company}</span>
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
