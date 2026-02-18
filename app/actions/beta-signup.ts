'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { contactFormSchema, type FormState } from '@/lib/validations';
import { rateLimiters, getClientIP } from '@/lib/rate-limit';
import { loadEmailTemplate, renderEmailTemplate, escapeHtml } from '@/lib/email-template';
import enMessages from '@/messages/en.json';
import slMessages from '@/messages/sl.json';

const resend = new Resend(process.env.RESEND_API_KEY);
type Locale = 'sl' | 'en';

type BetaSignupMessages = {
    server: {
        tooManyAttempts: string;
        honeypotSuccess: string;
        tooManyByEmail: string;
        captchaFailed: string;
        userSubject: string;
        sendFailed: string;
        success: string;
        unexpected: string;
    };
    emailTemplate: Record<string, string>;
};

const MESSAGES_BY_LOCALE: Record<Locale, BetaSignupMessages> = {
    en: enMessages.BetaSignup as BetaSignupMessages,
    sl: slMessages.BetaSignup as BetaSignupMessages,
};

type RecaptchaVerificationResult = {
    valid: boolean;
    success: boolean;
    score: number | null;
    action: string | null;
    errorCodes: string[];
};

async function verifyRecaptchaV3(token: string, ip?: string): Promise<RecaptchaVerificationResult> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        return { valid: false, success: false, score: null, action: null, errorCodes: ['missing-secret'] };
    }

    const body = new URLSearchParams({
        secret,
        response: token,
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        return { valid: false, success: false, score: null, action: null, errorCodes: [`http-${response.status}`] };
    }
    const result = (await response.json()) as {
        success?: boolean;
        score?: number;
        action?: string;
        'error-codes'?: string[];
    };

    const scorePass = typeof result.score === 'number' ? result.score >= 0.5 : true;
    const actionPass = result.action ? result.action === 'beta_signup' : true;
    return {
        valid: Boolean(result.success) && scorePass && actionPass,
        success: Boolean(result.success),
        score: typeof result.score === 'number' ? result.score : null,
        action: result.action ?? null,
        errorCodes: result['error-codes'] ?? [],
    };
}

const ADMIN_COPY = {
    title: 'New Beta Signup',
    labels: {
        email: 'Email',
        platform: 'Platform',
        trainer: 'Trainer',
        ipAddress: 'IP Address',
        yes: 'Yes',
        no: 'No',
    },
    subject: (email: string, platform: string, isTrainer: boolean) =>
        `New Beta Signup – ${email} (${platform}${isTrainer ? ', trainer' : ''})`,
};

export async function sendBetaSignupEmail(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const locale = formData.get('locale') === 'sl' ? 'sl' : 'en';
    const betaSignupMessages = MESSAGES_BY_LOCALE[locale];
    const copy = betaSignupMessages.server;

    try {
        // ── 1. Rate limit by IP ────────────────────────────────────────────────
        const headersList = await headers();
        const ip = getClientIP(headersList);

        const ipLimit = await rateLimiters.byIP(ip);
        if (!ipLimit.success) {
            const waitSeconds = Math.ceil((ipLimit.reset - Date.now()) / 1000);
            return {
                errors: {
                    _form: [copy.tooManyAttempts.replace('{seconds}', String(waitSeconds))],
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

        const recaptchaToken = String(formData.get('recaptchaToken') ?? '');
        console.log(`[reCAPTCHA] tokenLength=${recaptchaToken.length}`);

        const result = contactFormSchema.safeParse(rawData);

        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const data = result.data;

        // ── 3. Honeypot check ──────────────────────────────────────────────────
        if ((formData.get('website') ?? '') !== '') {
            console.log('[Security] Honeypot triggered – IP:', ip);
            return { success: true, message: copy.honeypotSuccess };
        }

        // ── 4. reCAPTCHA v3 verification ──────────────────────────────────────
        const recaptchaResult = await verifyRecaptchaV3(recaptchaToken, ip);
        console.log(
            `[reCAPTCHA] success=${recaptchaResult.success} score=${recaptchaResult.score ?? 'n/a'} action=${recaptchaResult.action ?? 'n/a'} errors=${recaptchaResult.errorCodes.join(',') || 'none'} ip=${ip}`,
        );

        if (!recaptchaResult.valid) {
            return {
                errors: {
                    _form: [copy.captchaFailed],
                },
            };
        }

        // ── 5. Rate limit by email ─────────────────────────────────────────────
        const emailLimit = await rateLimiters.byEmail(data.email);
        if (!emailLimit.success) {
            return {
                errors: {
                    _form: [copy.tooManyByEmail],
                },
            };
        }

        // ── 6. Prepare emails ────────────────────────────────────────────────
        const toEmail = process.env.BETA_SIGNUP_TO_EMAIL ?? 'delivered@resend.dev';
        const adminRecipients = [toEmail, 'jernejsdev@gmail.com']
            .map((email) => email.trim())
            .filter((email) => email.length > 0);

        // Admin notification — clean summary of signup data
        const adminHtml = `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #171717;">
                <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 24px;">${ADMIN_COPY.title}</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">${ADMIN_COPY.labels.email}</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${escapeHtml(data.email)}</td></tr>
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">${ADMIN_COPY.labels.platform}</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${escapeHtml(data.platform)}</td></tr>
                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 14px;">${ADMIN_COPY.labels.trainer}</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${data.isTrainer ? ADMIN_COPY.labels.yes : ADMIN_COPY.labels.no}</td></tr>
                    <tr><td style="padding: 10px 0; color: #737373; font-size: 14px;">${ADMIN_COPY.labels.ipAddress}</td><td style="padding: 10px 0; font-weight: 600; font-size: 14px;">${escapeHtml(ip)}</td></tr>
                </table>
            </div>
        `;

        // User welcome email — full branded template
        const welcomeHtml = renderEmailTemplate(loadEmailTemplate('email'), betaSignupMessages.emailTemplate);

        // ── 7. Send via Resend ─────────────────────────────────────────────────

        // Send notification to admin
        const { error } = await resend.emails.send({
            from: 'SetWise <info@setwise.app>',
            to: adminRecipients,
            replyTo: data.email,
            subject: ADMIN_COPY.subject(data.email, data.platform, data.isTrainer),
            html: adminHtml,
        });

        // Send welcome email to the user
        const { error: userError } = await resend.emails.send({
            from: 'SetWise <info@setwise.app>',
            to: [data.email],
            subject: copy.userSubject,
            html: welcomeHtml,
        });

        if (error || userError) {
            console.error('[Resend Error]', error ?? userError);
            return {
                errors: {
                    _form: [copy.sendFailed],
                },
            };
        }

        // ── 8. Success ─────────────────────────────────────────────────────────
        console.log(`[Beta Signup] Sent for ${data.email}  (${data.platform})`);

        return {
            success: true,
            message: copy.success,
        };
    } catch (error) {
        console.error('[Server Action Error]', error);
        return {
            errors: {
                _form: [copy.unexpected],
            },
        };
    }
}
