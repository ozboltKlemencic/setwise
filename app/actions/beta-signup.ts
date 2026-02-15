'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { contactFormSchema, type FormState } from '@/lib/validations';
import { rateLimiters, getClientIP } from '@/lib/rate-limit';
import { loadEmailTemplate, escapeHtml } from '@/lib/email-template';

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

        // ── 5. Prepare emails ────────────────────────────────────────────────
        const toEmail = process.env.BETA_SIGNUP_TO_EMAIL ?? 'delivered@resend.dev';

        // Admin notification — clean summary of signup data
        const adminHtml = `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #171717;">
                <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 24px;">New Beta Signup</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${escapeHtml(data.email)}</td></tr>
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">Platform</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${escapeHtml(data.platform)}</td></tr>
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">Trainer</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${data.isTrainer ? 'Yes' : 'No'}</td></tr>
                    <tr><td style="padding: 10px 0; color: #737373; font-size: 14px;">IP Address</td><td style="padding: 10px 0; font-weight: 600; font-size: 14px;">${escapeHtml(ip)}</td></tr>
                </table>
            </div>
        `;

        // User welcome email — full branded template
        const welcomeHtml = loadEmailTemplate('email');

        // ── 6. Send via Resend ─────────────────────────────────────────────────

        // Send notification to admin
        const { error } = await resend.emails.send({
            from: 'SetWise <info@tapetnistvo-dem-tap.com>',
            to: [toEmail],
            replyTo: data.email,
            subject: `New Beta Signup – ${data.email} (${data.platform}${data.isTrainer ? ', trainer' : ''})`,
            html: adminHtml,
        });

        // Send welcome email to the user
        const { error: userError } = await resend.emails.send({
            from: 'SetWise <info@tapetnistvo-dem-tap.com>',
            to: [data.email],
            subject: 'Welcome to SetWise Beta!',
            html: welcomeHtml ,
        });

        if (error || userError) {
            console.error('[Resend Error]', error ?? userError);
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
