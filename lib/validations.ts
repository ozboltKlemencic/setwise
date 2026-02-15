import { z } from 'zod';

// ── Disposable email domain check ──────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'yopmail.com',
    'sharklasers.com',
    'guerrillamailblock.com',
    'grr.la',
    'dispostable.com',
    'trashmail.com',
]);

function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

// ── Contact / Signup form schema ───────────────────────────────────────────────

export const contactFormSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .refine((email) => !isDisposableEmail(email), {
            message: 'Please use a valid email address',
        }),
    platform: z.enum(['ios', 'android', 'both'], {
        required_error: 'Platform selection is required',
    }),
    isTrainer: z
        .string()
        .optional()
        .transform((val) => val === 'on' || val === 'true'),
    honeypot: z.string().max(0, 'Bot detected'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ── Server action return type ──────────────────────────────────────────────────

export type FormState = {
    errors?: {
        email?: string[];
        platform?: string[];
        isTrainer?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
} | null;
