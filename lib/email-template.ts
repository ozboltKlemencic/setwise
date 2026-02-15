import { readFileSync } from 'fs';
import path from 'path';

// ── HTML escape (prevent XSS in email body) ────────────────────────────────────

const ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
};

export function escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

// ── Template loader ────────────────────────────────────────────────────────────

let cachedTemplate: string | null = null;

/**
 * Load an HTML email template from `<project>/email-templates/<name>.html`.
 * The result is cached in memory after the first read.
 */
export function loadEmailTemplate(name: string): string {
    if (cachedTemplate) return cachedTemplate;

    const filePath = path.join(process.cwd(), `${name}.html`);
    cachedTemplate = readFileSync(filePath, 'utf-8');
    return cachedTemplate;
}

// ── Template renderer ──────────────────────────────────────────────────────────

export type EmailTemplateData = Record<string, string>;

/**
 * Replace `{{KEY}}` placeholders in an HTML string with escaped values.
 */
export function renderEmailTemplate(
    html: string,
    data: EmailTemplateData,
): string {
    let rendered = html;
    for (const [key, value] of Object.entries(data)) {
        rendered = rendered.replaceAll(`{{${key}}}`, escapeHtml(value));
    }
    return rendered;
}
