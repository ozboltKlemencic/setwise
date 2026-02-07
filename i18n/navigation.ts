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
