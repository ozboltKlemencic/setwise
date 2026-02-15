'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { contactFormSchema, type FormState } from '@/lib/validations';
import { rateLimiters, getClientIP } from '@/lib/rate-limit';
import { loadEmailTemplate, renderEmailTemplate, escapeHtml } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);
type Locale = 'sl' | 'en';

const COPY: Record<
    Locale,
    {
        tooManyAttempts: (waitSeconds: number) => string;
        honeypotSuccess: string;
        tooManyByEmail: string;
        userSubject: string;
        sendFailed: string;
        success: string;
        unexpected: string;
    }
> = {
    en: {
        tooManyAttempts: (waitSeconds) => `Too many attempts. Please try again in ${waitSeconds} seconds.`,
        honeypotSuccess: "Thank you! We'll notify you when your spot is ready.",
        tooManyByEmail: 'Too many requests with this email. Please try later.',
        userSubject: 'Welcome to SetWise Beta!',
        sendFailed: 'Failed to send email. Please try again.',
        success: "Thank you! We'll notify you when your spot is ready. (Check your spam folder if you don't see it.)",
        unexpected: 'An unexpected error occurred. Please try again.',
    },
    sl: {
        tooManyAttempts: (waitSeconds) => `Preveč poskusov. Poskusite znova čez ${waitSeconds} sekund.`,
        honeypotSuccess: 'Hvala! Obvestili vas bomo, ko bo vaše mesto pripravljeno.',
        tooManyByEmail: 'Preveč zahtev s tem e-poštnim naslovom. Poskusite kasneje.',
        userSubject: 'Dobrodošli v SetWise beta!',
        sendFailed: 'Pošiljanje e-pošte ni uspelo. Poskusite znova.',
        success: 'Hvala! Obvestili vas bomo, ko bo vaše mesto pripravljeno. (Če e-pošte ne vidite, preverite vsiljeno pošto.)',
        unexpected: 'Prišlo je do nepričakovane napake. Poskusite znova.',
    },
};

const EMAIL_TEMPLATE_COPY: Record<Locale, Record<string, string>> = {
    en: {
        NAV_FEATURES: 'Features',
        NAV_GUIDES: 'Guides',
        NAV_WEBSITE: 'Website',
        HERO_BADGE: 'Early Beta Access',
        HERO_TITLE_LINE1: 'Welcome to',
        HERO_TITLE_LINE2: 'SetWise',
        HERO_SUBTITLE:
            "You’ve been granted access to SetWise.Choose your device below to install and get started.",
        INSTALL_ANDROID_TITLE: 'Android Installation',
        INSTALL_ANDROID_LINK: 'Link to install on Android',
        INSTALL_IOS_TITLE: 'iOS Installation',
        INSTALL_IOS_LINK: 'Link to install on iOS',
        COMMUNITY_DISCORD_TITLE: 'Discord Server',
        COMMUNITY_DISCORD_DESC: 'Chat with members, get quick help, and stay updated with announcements.',
        COMMUNITY_FACEBOOK_TITLE: 'Facebook Group',
        COMMUNITY_FACEBOOK_DESC: 'Join the group, share your training journey, and connect with the community.',
        FOOTER_TAGLINE: 'Organize smarter. Ship faster. Stay in sync.',
        FOOTER_RESOURCES: 'Resources',
        FOOTER_COMMUNITY: 'Community',
        FOOTER_CHANGELOG: 'Changelog',
        FOOTER_SUPPORT: 'Support',
        FOOTER_GUIDES: 'Guides',
        FOOTER_FAQ: 'FAQ',
        FOOTER_COMPANY: 'Company',
        FOOTER_ABOUT_US: 'About Us',
        FOOTER_OUR_TEAM: 'Our Team',
        FOOTER_CONTACT: 'Contact',
        FOOTER_LEGAL: 'Legal',
        FOOTER_PRIVACY_POLICY: 'Privacy Policy',
        FOOTER_TERMS_OF_USE: 'Terms of Use',
        FOOTER_COOKIES: 'Cookies',
    },
    sl: {
        NAV_FEATURES: 'Funkcije',
        NAV_GUIDES: 'Vodiči',
        NAV_WEBSITE: 'Spletna stran',
        HERO_BADGE: 'Zgodnji beta dostop',
        HERO_TITLE_LINE1: 'Dobrodošli v',
        HERO_TITLE_LINE2: 'SetWise',
        HERO_SUBTITLE:
            'Dobili ste dostop do SetWise. Izberite svojo napravo spodaj za namestitev in začetek.',
        INSTALL_ANDROID_TITLE: 'Namestitev za Android',
        INSTALL_ANDROID_LINK: 'Povezava za namestitev na Android',
        INSTALL_IOS_TITLE: 'Namestitev za iOS',
        INSTALL_IOS_LINK: 'Povezava za namestitev na iOS',
        COMMUNITY_DISCORD_TITLE: 'Discord strežnik',
        COMMUNITY_DISCORD_DESC: 'Klepetajte s člani, hitro dobite pomoč in spremljajte nova obvestila.',
        COMMUNITY_FACEBOOK_TITLE: 'Facebook skupina',
        COMMUNITY_FACEBOOK_DESC: 'Pridružite se skupini, delite svoj napredek in se povežite s skupnostjo.',
        FOOTER_TAGLINE: 'Organizirajte pametneje. Objavljajte hitreje. Ostanite usklajeni.',
        FOOTER_RESOURCES: 'Viri',
        FOOTER_COMMUNITY: 'Skupnost',
        FOOTER_CHANGELOG: 'Dnevnik sprememb',
        FOOTER_SUPPORT: 'Podpora',
        FOOTER_GUIDES: 'Vodiči',
        FOOTER_FAQ: 'Pogosta vprašanja',
        FOOTER_COMPANY: 'Podjetje',
        FOOTER_ABOUT_US: 'O nas',
        FOOTER_OUR_TEAM: 'Naša ekipa',
        FOOTER_CONTACT: 'Kontakt',
        FOOTER_LEGAL: 'Pravno',
        FOOTER_PRIVACY_POLICY: 'Politika zasebnosti',
        FOOTER_TERMS_OF_USE: 'Pogoji uporabe',
        FOOTER_COOKIES: 'Piškotki',
    },
};

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
    const copy = COPY[locale];

    try {
        // ── 1. Rate limit by IP ────────────────────────────────────────────────
        const headersList = await headers();
        const ip = getClientIP(headersList);

        const ipLimit = await rateLimiters.byIP(ip);
        if (!ipLimit.success) {
            const waitSeconds = Math.ceil((ipLimit.reset - Date.now()) / 1000);
            return {
                errors: {
                    _form: [copy.tooManyAttempts(waitSeconds)],
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
            return { success: true, message: copy.honeypotSuccess };
        }

        // ── 4. Rate limit by email ─────────────────────────────────────────────
        const emailLimit = await rateLimiters.byEmail(data.email);
        if (!emailLimit.success) {
            return {
                errors: {
                    _form: [copy.tooManyByEmail],
                },
            };
        }

        // ── 5. Prepare emails ────────────────────────────────────────────────
        const toEmail = process.env.BETA_SIGNUP_TO_EMAIL ?? 'delivered@resend.dev';

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
        const welcomeHtml = renderEmailTemplate(loadEmailTemplate('email'), EMAIL_TEMPLATE_COPY[locale]);

        // ── 6. Send via Resend ─────────────────────────────────────────────────

        // Send notification to admin
        const { error } = await resend.emails.send({
            from: 'SetWise <info@tapetnistvo-dem-tap.com>',
            to: [toEmail],
            replyTo: data.email,
            subject: ADMIN_COPY.subject(data.email, data.platform, data.isTrainer),
            html: adminHtml,
        });

        // Send welcome email to the user
        const { error: userError } = await resend.emails.send({
            from: 'SetWise <info@tapetnistvo-dem-tap.com>',
            to: [data.email],
            subject: copy.userSubject,
            html: welcomeHtml ,
        });

        if (error || userError) {
            console.error('[Resend Error]', error ?? userError);
            return {
                errors: {
                    _form: [copy.sendFailed],
                },
            };
        }

        // ── 7. Success ─────────────────────────────────────────────────────────
        console.log(`[Beta Signup] Sent for ${data.email} (${data.platform})`);

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
