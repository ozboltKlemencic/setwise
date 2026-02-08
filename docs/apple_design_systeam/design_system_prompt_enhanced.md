# PREMIUM DESIGN SYSTEM PROMPT — Enhanced z Apple HIG Deep Research
## Za AI Agent: Ustvarjanje profesionalnega Apple-inspired design systema za Next.js 15

**Verzija:** 2.0 — Verificirano z Apple Developer Documentation (december 2025)

---

## KONTEKST IN CILJ

Ustvari celovit, premium design system za Next.js 15 spletno aplikacijo z Tailwind CSS. Design system mora biti:

- **Apple HIG-inspired**: Temelji na verificiranih Apple Human Interface Guidelines principih
- **Semantic First**: Barve definirane po namenu (purpose), ne po izgledu (appearance)
- **Popolnoma funkcionalen** z dark/light mode + increased contrast podporo
- **Zasnovan na REM enotah** za dostopnost in odzivnost
- **Primary barva**: MODRA (#3b82f6 light / #60a5fa dark — brand, ne system)
- **Ikone**: Lucide React (konsistenten stroke: 2, velikost: 20px default)
- **WCAG AA compliant** za vse color combinations
- **Liquid Glass-aware**: Pripravljen za Apple-ov novi material design

---

## VIRI — PRIORITIZIRANI IN VERIFICIRANI

### Apple Design Guidelines (PRIORITETA 1 — Primarni vir resnice):

| # | Tema | URL | Zadnji Update |
|---|------|-----|---------------|
| 1 | **Color** | https://developer.apple.com/design/human-interface-guidelines/color | Dec 2025 |
| 2 | **Dark Mode** | https://developer.apple.com/design/human-interface-guidelines/dark-mode | Dec 2025 |
| 3 | **Typography** | https://developer.apple.com/design/human-interface-guidelines/typography | 2025 |
| 4 | **Layout** | https://developer.apple.com/design/human-interface-guidelines/layout | 2025 |
| 5 | **Icons** | https://developer.apple.com/design/human-interface-guidelines/icons | 2025 |
| 6 | **Branding** | https://developer.apple.com/design/human-interface-guidelines/branding | 2025 |
| 7 | **Accessibility** | https://developer.apple.com/design/human-interface-guidelines/accessibility | 2025 |
| 8 | **Materials** | https://developer.apple.com/design/human-interface-guidelines/materials | Dec 2025 |

### Apple Design Resources (PRIORITETA 1 — Design Assets):

| # | Resource | URL | Format |
|---|----------|-----|--------|
| 1 | **Design Resources Hub** | https://developer.apple.com/design/resources/ | Hub |
| 2 | **SF Symbols 7** | https://developer.apple.com/sf-symbols/ | macOS App |
| 3 | **Fonts (SF Pro, NY)** | https://developer.apple.com/fonts/ | Downloads |
| 4 | **Icon Composer** | https://developer.apple.com/icon-composer/ | macOS App |
| 5 | **iOS 26 UI Kit** | https://developer.apple.com/design/resources/ | Figma/Sketch |
| 6 | **WWDC 2025: New Design System** | https://developer.apple.com/videos/play/wwdc2025/356/ | Video |
| 7 | **WWDC 2025: Design Foundations** | https://developer.apple.com/videos/play/wwdc2025/359/ | Video |

### Supporting Dark Mode (PRIORITETA 2):
- https://developer.apple.com/documentation/uikit/supporting-dark-mode-in-your-interface
- https://developer.apple.com/videos/play/wwdc2019/214/

---

## 1. BARVNI SISTEM — VERIFICIRANE VREDNOSTI

### 1.1 KRITIČNO PRAVILO: Semantic Colors

**Apple HIG pravi:** *"Dynamic system colors are semantically defined by their purpose, rather than their appearance or color values."*

**Za Next.js:** Vse barve definiraj kot CSS spremenljivke, nikoli kot fiksne Tailwind barve.

```tsx
// NAPAČNO ❌ — hardcoded barve
<div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

// PRAVILNO ✅ — semantic barve
<div className="bg-background text-label">
```

### 1.2 System Background Colors — Verificirane Vrednosti

#### A) System Background (za standardne views)

```css
:root {
  /* System Background Hierarchy */
  --color-background: #FFFFFF;              /* systemBackground */
  --color-secondary-background: #F2F2F7;    /* secondarySystemBackground */
  --color-tertiary-background: #FFFFFF;     /* tertiarySystemBackground */
  
  /* Grouped Background Hierarchy */
  --color-grouped-background: #F2F2F7;           /* systemGroupedBackground */
  --color-secondary-grouped-background: #FFFFFF;  /* secondarySystemGroupedBackground */
  --color-tertiary-grouped-background: #F2F2F7;   /* tertiarySystemGroupedBackground */
}

.dark {
  --color-background: #000000;
  --color-secondary-background: #1C1C1E;
  --color-tertiary-background: #2C2C2E;
  
  --color-grouped-background: #000000;
  --color-secondary-grouped-background: #1C1C1E;
  --color-tertiary-grouped-background: #2C2C2E;
}
```

**Uporaba:**
- `background` → glavno ozadje aplikacije
- `secondary-background` → kartice, modali, panels, grouped content
- `tertiary-background` → nested kartice, elevated list groups

**Grouped backgrounds:** Za Settings-style lists, grouped forms, section containers.

### 1.3 Label Colors (Foreground) — Verificirane Vrednosti

```css
:root {
  --color-label: #000000;                         /* label — 100% */
  --color-secondary-label: rgba(60, 60, 67, 0.6);  /* ~60% alpha */
  --color-tertiary-label: rgba(60, 60, 67, 0.3);   /* ~30% alpha */
  --color-quaternary-label: rgba(60, 60, 67, 0.18); /* ~18% alpha */
  --color-placeholder: rgba(60, 60, 67, 0.3);       /* placeholderText */
  --color-link: #007AFF;                             /* systemBlue */
}

.dark {
  --color-label: #FFFFFF;
  --color-secondary-label: rgba(235, 235, 245, 0.6);
  --color-tertiary-label: rgba(235, 235, 245, 0.3);
  --color-quaternary-label: rgba(235, 235, 245, 0.18);
  --color-placeholder: rgba(235, 235, 245, 0.3);
  --color-link: #0A84FF;
}
```

**Uporaba:**
- `label` → H1-H3, primary body text, button labels
- `secondary-label` → descriptions, helper text, subheadings
- `tertiary-label` → disabled text, timestamps, meta info
- `quaternary-label` → watermarks, extremely subtle text
- `placeholder` → input placeholder text
- `link` → interactive links

### 1.4 Separator Colors

```css
:root {
  --color-separator: rgba(60, 60, 67, 0.29);        /* semi-transparent */
  --color-opaque-separator: #C6C6C8;                 /* opaque */
}

.dark {
  --color-separator: rgba(84, 84, 88, 0.65);
  --color-opaque-separator: #38383A;
}
```

### 1.5 Fill Colors — Verificirane Vrednosti

```css
:root {
  --color-fill: rgba(120, 120, 128, 0.20);           /* ~20% */
  --color-secondary-fill: rgba(120, 120, 128, 0.16); /* ~16% */
  --color-tertiary-fill: rgba(118, 118, 128, 0.12);  /* ~12% */
  --color-quaternary-fill: rgba(116, 116, 128, 0.08); /* ~8% */
}

.dark {
  --color-fill: rgba(120, 120, 128, 0.36);           /* ~36% */
  --color-secondary-fill: rgba(120, 120, 128, 0.32); /* ~32% */
  --color-tertiary-fill: rgba(118, 118, 128, 0.24);  /* ~24% */
  --color-quaternary-fill: rgba(118, 118, 128, 0.18); /* ~18% */
}
```

**POMEMBNO:** Fill se vedno uporablja **preko** background barve (alpha < 1).

### 1.6 Gray System — 6 Nivojev

```css
:root {
  --color-gray: #8E8E93;     /* systemGray — base (enak v light+dark!) */
  --color-gray-2: #AEAEB2;   /* systemGray2 */
  --color-gray-3: #C7C7CC;   /* systemGray3 */
  --color-gray-4: #D1D1D6;   /* systemGray4 */
  --color-gray-5: #E5E5EA;   /* systemGray5 */
  --color-gray-6: #F2F2F7;   /* systemGray6 */
}

.dark {
  --color-gray: #8E8E93;     /* ENAK v dark mode */
  --color-gray-2: #636366;
  --color-gray-3: #48484A;
  --color-gray-4: #3A3A3C;
  --color-gray-5: #2C2C2E;
  --color-gray-6: #1C1C1E;
}
```

### 1.7 System Tint Colors — Verificirane Vrednosti

```css
:root {
  /* Tint Colors — Light Mode */
  --color-system-blue: #007AFF;
  --color-system-green: #34C759;
  --color-system-red: #FF3B30;
  --color-system-orange: #FF9500;
  --color-system-yellow: #FFCC00;
  --color-system-pink: #FF2D55;
  --color-system-purple: #AF52DE;
  --color-system-indigo: #5856D6;
  --color-system-teal: #5AC8FA;
  --color-system-mint: #00C7BE;
  --color-system-cyan: #32ADE6;
  --color-system-brown: #A2845E;
}

.dark {
  /* Tint Colors — Dark Mode (MORE VIBRANT) */
  --color-system-blue: #0A84FF;
  --color-system-green: #30D158;
  --color-system-red: #FF453A;
  --color-system-orange: #FF9F0A;
  --color-system-yellow: #FFD60A;
  --color-system-pink: #FF375F;
  --color-system-purple: #BF5AF2;
  --color-system-indigo: #5E5CE6;
  --color-system-teal: #64D2FF;
  --color-system-mint: #63E6E2;
  --color-system-cyan: #64D2FF;
  --color-system-brown: #AC8E68;
}
```

### 1.8 Brand Primary Color

Za SetWise app uporabljamo modro paleto:

```css
:root {
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;   /* Light mode primary */
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;
  --color-brand-950: #172554;
}

.dark {
  /* V dark mode: brand-400 (#60a5fa) kot primary za vibrancy */
}
```

### 1.9 Semantic Color Mapping (Success/Warning/Error/Info)

```css
:root {
  --color-success: var(--color-system-green);     /* #34C759 → #30D158 */
  --color-warning: var(--color-system-orange);     /* #FF9500 → #FF9F0A */
  --color-error: var(--color-system-red);          /* #FF3B30 → #FF453A */
  --color-info: var(--color-system-blue);          /* #007AFF → #0A84FF */
}
```

---

## 2. DARK MODE — PRAVILA

### 2.1 Ključni Principi

| # | Pravilo | Razlaga |
|---|---------|---------|
| 1 | **NI inverzija** | Dark mode zahteva namenske barve, ne simple inversion |
| 2 | **Elevated = lighter** | V dark mode: višja elevacija = svetlejši ton |
| 3 | **Vibrant foreground** | Foreground barve so bolj žive v dark mode |
| 4 | **Reduced shadow** | Shadows so manj vidne; namesto njih lightness hierarchy |
| 5 | **Increased fill opacity** | Fill colors imajo višjo alpha v dark mode |
| 6 | **Both modes required** | Vedno podpiraj oba modusa (tudi za Liquid Glass) |

### 2.2 Elevation System za Dark Mode

```css
/* Dark mode elevation via background lightness */
.dark {
  --elevation-0: #000000;   /* Base — systemBackground */
  --elevation-1: #1C1C1E;   /* Card, panel — secondarySystemBackground */
  --elevation-2: #2C2C2E;   /* Modal, popover — tertiarySystemBackground */
  --elevation-3: #3A3A3C;   /* Nested elevated — systemGray4 */
  --elevation-4: #48484A;   /* Highest elevation — systemGray3 */
}
```

### 2.3 Shadow System

```css
:root {
  /* Light mode: shadows za globino */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.dark {
  /* Dark mode: višja opacity + elevation backgrounds */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6);
}
```

### 2.4 Theme Provider Setup

```tsx
// app/providers.tsx
'use client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false} // smooth 200ms transition
    >
      {children}
    </ThemeProvider>
  );
}
```

### 2.5 Smooth Transition + Reduced Motion

```css
/* Smooth theme transitions */
* {
  transition: background-color 200ms ease,
              color 200ms ease,
              border-color 200ms ease,
              box-shadow 200ms ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 3. TIPOGRAFIJA — VERIFICIRANE VREDNOSTI

### 3.1 Font Stack

```css
:root {
  /* Display: za headlines, branding */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  
  /* Body: za besedilo, UI */
  --font-body: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
  
  /* Mono: za code */
  --font-mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
}
```

### 3.2 Type Scale — Apple Dynamic Type → Web Preslikava

Temelji na Apple-ovih verificiranih velikostih pri "Large" (default) nastavitvi:

```typescript
fontSize: {
  // Apple Text Style   → pt   → rem      → line-height  → letter-spacing
  'caption-2':  ['0.6875rem', { lineHeight: '0.8125rem',  letterSpacing: '0.01em' }],  // 11px — Caption 2
  'caption-1':  ['0.75rem',   { lineHeight: '1rem',       letterSpacing: '0.01em' }],  // 12px — Caption 1
  'footnote':   ['0.8125rem', { lineHeight: '1.125rem',   letterSpacing: '0.01em' }],  // 13px — Footnote
  'subheadline':['0.9375rem', { lineHeight: '1.25rem',    letterSpacing: '0' }],       // 15px — Subheadline
  'callout':    ['1rem',      { lineHeight: '1.3125rem',  letterSpacing: '0' }],       // 16px — Callout (= base)
  'body':       ['1.0625rem', { lineHeight: '1.375rem',   letterSpacing: '0' }],       // 17px — Body
  'headline':   ['1.0625rem', { lineHeight: '1.375rem',   letterSpacing: '-0.01em' }], // 17px — Headline (semibold!)
  'title-3':    ['1.25rem',   { lineHeight: '1.5625rem',  letterSpacing: '-0.02em' }], // 20px — Title 3
  'title-2':    ['1.375rem',  { lineHeight: '1.75rem',    letterSpacing: '-0.02em' }], // 22px — Title 2
  'title-1':    ['1.75rem',   { lineHeight: '2.125rem',   letterSpacing: '-0.03em' }], // 28px — Title 1
  'large-title':['2.125rem',  { lineHeight: '2.5625rem',  letterSpacing: '-0.04em' }], // 34px — Large Title
  
  // Extended za web (ni del Apple HIG, ampak uporabno)
  'display-sm': ['2.25rem',   { lineHeight: '2.5rem',     letterSpacing: '-0.04em' }], // 36px
  'display':    ['3rem',      { lineHeight: '1',           letterSpacing: '-0.04em' }], // 48px
  'display-lg': ['3.75rem',   { lineHeight: '1',           letterSpacing: '-0.05em' }], // 60px
  'display-xl': ['4.5rem',    { lineHeight: '1',           letterSpacing: '-0.05em' }], // 72px
}
```

### 3.3 Font Weights

```typescript
fontWeight: {
  light:    300,    // Subtle, elegant
  regular:  400,    // Body text
  medium:   500,    // Navigation, emphasized body
  semibold: 600,    // Headlines, button labels — KEY za Apple style
  bold:     700,    // Titles, primary headings
  heavy:    800,    // Hero text, marketing
  black:    900,    // Ultra bold display
}
```

### 3.4 Tracking Pravilo

```
PRAVILO: Večji font = bolj negativen letter-spacing

Display (48px+)  → -0.04em do -0.05em (zelo tight)
Titles (20-34px) → -0.02em do -0.04em
Body (15-17px)   → 0em (nevtralno)
Captions (11-13px) → +0.01em (rahlo razprto za berljivost)
```

---

## 4. SPACING SISTEM — 8pt Grid

### 4.1 Spacing Scale

```typescript
spacing: {
  0:    '0',           // 0px
  px:   '1px',         // 1px — border width
  0.5:  '0.125rem',    // 2px — micro
  1:    '0.25rem',     // 4px — icon gaps
  1.5:  '0.375rem',    // 6px — tight spacing
  2:    '0.5rem',      // 8px — BASE UNIT
  2.5:  '0.625rem',    // 10px
  3:    '0.75rem',     // 12px — small gaps
  3.5:  '0.875rem',    // 14px
  4:    '1rem',        // 16px — standard padding
  5:    '1.25rem',     // 20px — medium gaps
  6:    '1.5rem',      // 24px — section padding
  7:    '1.75rem',     // 28px
  8:    '2rem',        // 32px — large gaps
  9:    '2.25rem',     // 36px
  10:   '2.5rem',      // 40px
  11:   '2.75rem',     // 44px — MINIMUM TOUCH TARGET
  12:   '3rem',        // 48px — hero spacing
  14:   '3.5rem',      // 56px
  16:   '4rem',        // 64px — page sections
  20:   '5rem',        // 80px
  24:   '6rem',        // 96px — major divisions
  28:   '7rem',        // 112px
  32:   '8rem',        // 128px
  36:   '9rem',        // 144px
  40:   '10rem',       // 160px
  44:   '11rem',       // 176px
  48:   '12rem',       // 192px
  52:   '13rem',       // 208px
  56:   '14rem',       // 224px
  60:   '15rem',       // 240px
  64:   '16rem',       // 256px
}
```

### 4.2 Component Spacing Rules

```
Buttons:
  Small:  px-3 py-1.5   (12px / 6px)    min-h-[32px]
  Medium: px-4 py-2      (16px / 8px)    min-h-[40px]
  Large:  px-6 py-3      (24px / 12px)   min-h-[48px]

Cards:
  Padding: p-4 (small), p-6 (medium), p-8 (large)
  Gap:     gap-4 (16px) ali gap-6 (24px) med karticami

Inputs:
  Padding: px-3 py-2.5   (12px / 10px)   min-h-[44px] — TOUCH TARGET!
  
Lists:
  Row height: min-h-[44px]   — Apple minimum!
  Row padding: px-4 py-3     (16px / 12px)

Sections:
  Vertical:   py-12 → py-16 → py-24 (mobile → tablet → desktop)
  Horizontal: px-4 → px-6 → px-8 (mobile → tablet → desktop)
```

### 4.3 Touch Targets — KRITIČNO

```
Apple zahteva: MINIMUM 44 × 44 pt za VSE interaktivne elemente

To vključuje:
- Buttons (min-h-[44px] ali py-3)
- Input fields (min-h-[44px])
- List rows (min-h-[44px])
- Icon buttons (min-w-[44px] min-h-[44px], tudi če je ikona 20px)
- Links v seznamih (celoten row mora biti 44px+)
```

---

## 5. LAYOUT SISTEM

### 5.1 Container System

```typescript
maxWidth: {
  'sm':    '640px',
  'md':    '768px',
  'lg':    '1024px',
  'xl':    '1280px',
  '2xl':   '1536px',
  'prose': '65ch',     // optimal reading width
  'screen': '100vw',
}
```

### 5.2 Breakpoints

```typescript
screens: {
  'sm':  '640px',    // Mobile landscape
  'md':  '768px',    // Tablet portrait
  'lg':  '1024px',   // Tablet landscape / Desktop
  'xl':  '1280px',   // Large desktop
  '2xl': '1536px',   // Extra large desktop
}
```

### 5.3 Grid System

```
Mobile (< 640px):   4-column grid,  16px gutter, 16px margin
Tablet (640-1024):  8-column grid,  20px gutter, 20px margin
Desktop (> 1024):   12-column grid, 24px gutter, 24px margin
```

### 5.4 Safe Areas (za PWA/Mobile)

```css
.safe-area {
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
```

---

## 6. BORDER RADIUS & SHADOWS

### 6.1 Border Radius

```typescript
borderRadius: {
  'none': '0',
  'sm':   '0.375rem',   // 6px  — small elements (badges, chips)
  'DEFAULT': '0.5rem',  // 8px  — default
  'md':   '0.75rem',    // 12px — medium elements
  'lg':   '1rem',       // 16px — buttons, inputs
  'xl':   '1.25rem',    // 20px — cards
  '2xl':  '1.5rem',     // 24px — modals, popovers
  '3xl':  '2rem',       // 32px — hero sections
  'full': '9999px',     // pills, avatars
}
```

**Uporaba:**
```
Badges/Chips:  rounded-sm (6px)
Inputs:        rounded-lg (16px)
Buttons:       rounded-lg (16px)
Cards:         rounded-xl (20px)
Modals:        rounded-2xl (24px)
Hero sections: rounded-3xl (32px)
Pills/Avatars: rounded-full
```

---

## 7. IKONE — Lucide React

### 7.1 Sizes

```typescript
iconSize: {
  'xs':   12,   // Inline micro
  'sm':   16,   // Navigation, inline
  'md':   20,   // DEFAULT — standard
  'lg':   24,   // Prominent icons
  'xl':   32,   // Feature icons
  '2xl':  40,   // Hero icons
}
```

### 7.2 Konsistenten Stroke

```typescript
// PRAVILO: Vse ikone v app morajo imeti ENAK strokeWidth!
// Default: strokeWidth={2}

<Icon size={20} strokeWidth={2} />   // Standard
<Icon size={16} strokeWidth={2} />   // Small (enak stroke!)
<Icon size={24} strokeWidth={2} />   // Large (enak stroke!)
```

### 7.3 Icon + Text Alignment

```tsx
// VEDNO uporabi inline-flex + items-center + gap
<button className="inline-flex items-center gap-2">
  <Search size={20} strokeWidth={2} />
  <span>Search</span>
</button>
```

---

## 8. BRANDING — Apple Approach

### 8.1 Key Color System

Izberi **eno brand barvo** in jo uporabi konsistentno:

```tsx
// Brand barva za VSE interaktivne elemente
<Button className="bg-brand-500 dark:bg-brand-400">Primary Action</Button>
<Link className="text-brand-500 dark:text-brand-400 hover:underline">Learn More</Link>
<TabBarItem className="text-brand-500 dark:text-brand-400" />  // active tab
<Switch className="bg-brand-500 dark:bg-brand-400" />           // toggled on
```

### 8.2 Signature Patterns

```tsx
// Consistent button pattern
const brandButton = `
  rounded-lg              // 16px radius
  px-4 py-2.5             // consistent padding
  min-h-[44px]            // touch target!
  font-semibold           // Apple-style weight
  transition-all duration-200
  hover:brightness-110    // subtle hover
  active:scale-[0.97]     // signature press
  focus-visible:ring-2 focus-visible:ring-brand-500/50
`;

// Consistent card pattern
const brandCard = `
  rounded-xl              // 20px radius
  bg-secondary-background
  p-6                     // consistent padding
  shadow-sm dark:shadow-none
`;
```

---

## 9. ANIMACIJE & TRANSITIONS

### 9.1 Timing

```typescript
transitionDuration: {
  'instant': '100ms',    // micro-interactions
  'quick':   '200ms',    // hover, active, theme switch
  'normal':  '300ms',    // modals, dropdowns, slides
  'smooth':  '500ms',    // page transitions
}
```

### 9.2 Easing

```typescript
transitionTimingFunction: {
  'apple':  'cubic-bezier(0.4, 0, 0.2, 1)',    // Apple default
  'in':     'cubic-bezier(0.4, 0, 1, 1)',
  'out':    'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // bounce
}
```

### 9.3 Keyframes

```typescript
keyframes: {
  fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  slideUp:  { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
  scaleIn:  { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
  slideDown:{ '0%': { transform: 'translateY(-8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
}
```

---

## 10. ACCESSIBILITY — WCAG AA

### 10.1 Contrast Ratios

```
Normal text (< 18px):   ≥ 4.5:1
Large text (≥ 18px):    ≥ 3:1
UI components:          ≥ 3:1
```

### 10.2 Focus States

```css
/* Apple-style focus ring */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--color-brand-500), 0.5);
}
```

### 10.3 Non-Color Indicators

```tsx
// VEDNO dodaj ikone poleg barv za stanja
<Badge variant="success"><CheckCircle size={14} /> Active</Badge>
<Badge variant="error"><XCircle size={14} /> Failed</Badge>
<Badge variant="warning"><AlertTriangle size={14} /> Pending</Badge>
```

### 10.4 Semantic HTML

```tsx
<button>   // za actions (ne <div onClick>!)
<a href>   // za navigation
<input>    // za data entry
<h1>-<h6>  // za heading hierarchy (sequencial!)
aria-label // za ikone brez besedila
role       // za custom interactive elements
```

### 10.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

---

## 11. KOMPONENTE — Specifikacije

### 11.1 Button

```
Variants: primary | secondary | ghost | outline | danger | link
Sizes: sm (32px) | md (40px) | lg (48px)
States: default | hover | active | disabled | loading | focus
Icon support: leading | trailing | icon-only

Colors:
  primary:   bg-brand-500 text-white
  secondary: bg-secondary-background text-label border border-separator
  ghost:     hover:bg-fill text-label
  outline:   border-2 border-brand-500 text-brand-500
  danger:    bg-system-red text-white
  link:      text-link underline-offset-4 hover:underline
```

### 11.2 Card

```
Variants: default | elevated | outlined
Sections: CardHeader | CardBody | CardFooter

Colors:
  default:  bg-secondary-background rounded-xl p-6
  elevated: bg-tertiary-background rounded-xl p-6 shadow-md
  outlined: bg-background rounded-xl p-6 border border-separator
```

### 11.3 Input

```
Types: text | email | password | number | search | textarea
States: default | focused | error | disabled

Colors:
  default:  bg-tertiary-fill text-label placeholder:text-placeholder rounded-lg
  focused:  ring-2 ring-brand-500
  error:    ring-2 ring-system-red
  disabled: opacity-50 cursor-not-allowed
  
Size: min-h-[44px] px-3 py-2.5 (touch target!)
```

### 11.4 Badge

```
Variants: default | primary | success | warning | error
Sizes: sm | md | lg

Colors:
  default: bg-gray-5 text-label
  primary: bg-brand-500 text-white
  success: bg-system-green text-white
  warning: bg-system-orange text-white
  error:   bg-system-red text-white
```

### 11.5 Modal/Dialog

```
Structure: Overlay + Content + Header + Body + Footer
Animation: overlay fade-in (200ms) + content scale-in+slideUp (300ms)

Colors:
  overlay: bg-black/40 backdrop-blur-sm
  content: bg-secondary-background rounded-2xl shadow-xl p-6
```

---

## 12. CHECKPOINTS — KVALITETNI STANDARDI

### ✅ Semantic Colors

```tsx
// NAPAČNO ❌
<div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

// PRAVILNO ✅
<div className="bg-background text-label">
```

### ✅ Dark Mode Elevation

```tsx
// NAPAČNO ❌ — enaka barva za kartice v dark mode
<div className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-lg">

// PRAVILNO ✅ — svetlejša barva + manjša shadow v dark mode
<div className="bg-secondary-background shadow-md dark:shadow-none">
```

### ✅ Touch Targets

```tsx
// NAPAČNO ❌ — premajhen gumb
<button className="px-2 py-1 text-xs">Action</button>

// PRAVILNO ✅ — 44px minimum
<button className="px-4 py-2.5 min-h-[44px] text-sm">Action</button>
```

### ✅ Vibrancy

```tsx
// NAPAČNO ❌ — enaka barva v obeh modusih
<Button className="bg-blue-500 dark:bg-blue-500">Primary</Button>

// PRAVILNO ✅ — bolj vibrantna v dark mode
<Button className="bg-brand-500 dark:bg-brand-400">Primary</Button>
```

### ✅ Non-Color Indicators

```tsx
// NAPAČNO ❌ — samo barva za stanje
<span className="text-green-500">Active</span>

// PRAVILNO ✅ — ikona + barva + besedilo
<span className="text-system-green inline-flex items-center gap-1">
  <CheckCircle size={14} /> Active
</span>
```

---

## 13. PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.460.0",
    "next-themes": "^0.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.7",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 14. PRIORITETEN VRSTNI RED IMPLEMENTACIJE

1. **Setup Files** — globals.css (CSS vars), tailwind.config.ts (semantic colors)
2. **Theme Provider** — providers.tsx (next-themes), layout.tsx
3. **Utility Files** — lib/utils.ts (cn helper), types/components.ts
4. **Core Components** — Button, Card, Input, Badge, Modal
5. **Theme Toggle** — ThemeToggle.tsx z sun/moon ikoni
6. **Documentation** — DESIGN_SYSTEM.md
7. **Examples** — ColorShowcase, ComponentShowcase

**POMEMBNO:**
- NO placeholders
- NO TODO comments  
- Fully implemented code
- Production-ready quality
- Vse barve verificirane z Apple HIG
- WCAG AA testirano
- Touch targets ≥ 44px
- Reduced motion support

---

**Verzija:** 2.0  
**Datum:** 8. februar 2026  
**Status:** VERIFICIRANO z Apple Developer Documentation (december 2025)
