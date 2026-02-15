'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { contactFormSchema, type FormState } from '@/lib/validations';
import { rateLimiters, getClientIP } from '@/lib/rate-limit';
import { loadEmailTemplate, renderEmailTemplate } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBetaSignupEmail(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    try {
        // ── 1. Rate limit by IP ────────────────────────────────────────────────
        const headersList = await headers();
        const ip = getClientIP(headersList);

        const ipLimit = await rateLimiters.byIP(ip);
        if (!ipLimit.success) {
            const waitSeconds = Math.ceil((ipLimit.reset - Date.now()) / 1000);
            return {
                errors: {
                    _form: [`Too many attempts. Please try again in ${waitSeconds} seconds.`],
                },
            };
        }

        // ── 2. Parse & validate ────────────────────────────────────────────────
        const rawData = {
            email: formData.get('email'),
            platform: formData.get('platform'),
            isTrainer: formData.get('isTrainer'),
            honeypot: formData.get('website') ?? '',
        };

        const result = contactFormSchema.safeParse(rawData);

        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const data = result.data;

        // ── 3. Honeypot check ──────────────────────────────────────────────────
        if ((formData.get('website') ?? '') !== '') {
            console.log('[Security] Honeypot triggered – IP:', ip);
            return { success: true, message: 'Thank you! We\'ll notify you when your spot is ready.' };
        }

        // ── 4. Rate limit by email ─────────────────────────────────────────────
        const emailLimit = await rateLimiters.byEmail(data.email);
        if (!emailLimit.success) {
            return {
                errors: {
                    _form: ['Too many requests with this email. Please try later.'],
                },
            };
        }

        // ── 5. Load & render email template ────────────────────────────────────
        const htmlTemplate = loadEmailTemplate('email');
        const htmlContent = renderEmailTemplate(htmlTemplate, {
            EMAIL: data.email,
            PLATFORM: data.platform,
        });

        // ── 6. Send via Resend ─────────────────────────────────────────────────
        const toEmail = process.env.BETA_SIGNUP_TO_EMAIL ?? 'delivered@resend.dev';

        const { error } = await resend.emails.send({
            from: 'SetWise <tapetnistvo-dem-tap.com>',
            to: [toEmail],
            replyTo: data.email,
            subject: `New Beta Signup – ${data.email} (${data.platform}${data.isTrainer ? ', trainer' : ''})`,
            html: htmlContent,
        });

        if (error) {
            console.error('[Resend Error]', error);
            return {
                errors: {
                    _form: ['Failed to send email. Please try again.'],
                },
            };
        }

        // ── 7. Success ─────────────────────────────────────────────────────────
        console.log(`[Beta Signup] Sent for ${data.email} (${data.platform})`);

        return {
            success: true,
            message: 'Thank you! We\'ll notify you when your spot is ready.',
        };
    } catch (error) {
        console.error('[Server Action Error]', error);
        return {
            errors: {
                _form: ['An unexpected error occurred. Please try again.'],
            },
        };
    }
}
