import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Create type-safe navigation utilities
export const {
    Link,
    redirect,
    usePathname,
    useRouter,
    getPathname,
} = createNavigation(routing);

function normalizePathname(pathname: string): string {
    if (!pathname) {
        return '/';
    }

    const normalized = pathname.replace(/\/+$/, '');
    return normalized === '' ? '/' : normalized;
}

export function isPathActive(
    currentPathname: string,
    targetPathname: string,
    options?: { exact?: boolean },
): boolean {
    const current = normalizePathname(currentPathname);
    const target = normalizePathname(targetPathname);

    if (options?.exact || target === '/') {
        return current === target;
    }

    return current === target || current.startsWith(`${target}/`);
}
