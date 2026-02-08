# STROKOVNO POROČILO: Apple Human Interface Guidelines - Color & Branding
## Poglobljena analiza za premium design system Next.js

**Datum:** 8. februar 2026  
**Namen:** Dopolnitev Premium Design System prompta z Apple HIG principi  
**Obseg:** Analiza barv, brandinga, semantic colors, Wide Color (P3) in dark mode

---

## IZVRŠNI POVZETEK

Apple Human Interface Guidelines predstavlja celovit sistem za oblikovanje uporabniških vmesnikov, ki temelji na treh ključnih stebrih:
1. **Semantic Color System** - barve definirane po namenu, ne po izgledu
2. **Dynamic Adaptation** - avtomatsko prilagajanje light/dark mode
3. **Subtle Branding** - minimalistična uporaba logotipov, poudarek na custom colors in fontih

Ključna ugotovitev za Next.js design system: Apple **ne uporablja absolutnih RGB vrednosti**, ampak **semantične barve**, ki se dinamično prilagajajo kontekstu (light/dark mode, accessibility, Wide Color displays).

---

## 1. BARVNI SISTEM - POGLOBLJENA ANALIZA

### 1.1 Semantic Colors - Filozofija in Implementacija

**Koncept:** Barve so definirane po **namenu** (purpose), ne po **videzu** (appearance).

#### Primeri semantic colors:
```
- systemBackground → osnovna barva ozadja (svetla/temna)
- label → glavna barva besedila (črna/bela)
- secondaryLabel → sekundarno besedilo (gray-600/gray-400)
- tertiaryLabel → tercialno besedilo (gray-400/gray-500)
- link → interaktivna povezava (blue-600/blue-400)
- separator → ločilne črte (gray-200/gray-700)
- systemFill → polnila za UI elemente (alpha transparency)
```

**Pomembno za Next.js implementacijo:**
- **NE** uporabljaj fiksnih barv kot `bg-gray-100` za ozadje
- **UPORABI** CSS spremenljivke: `bg-system-background`
- **IMPLEMENTIRAJ** dynamic switching z next-themes

#### Praktični primer implementacije:
```css
/* globals.css - PRAVILNA implementacija */
:root {
  --color-background: 255 255 255; /* light mode */
  --color-secondary-background: 247 247 247;
  --color-label: 0 0 0;
  --color-secondary-label: 60 60 67;
}

.dark {
  --color-background: 0 0 0; /* dark mode */
  --color-secondary-background: 28 28 30;
  --color-label: 255 255 255;
  --color-secondary-label: 152 152 157;
}
```

```typescript
// tailwind.config.ts - PRAVILNA implementacija
colors: {
  background: 'rgb(var(--color-background) / <alpha-value>)',
  'secondary-background': 'rgb(var(--color-secondary-background) / <alpha-value>)',
  label: 'rgb(var(--color-label) / <alpha-value>)',
  'secondary-label': 'rgb(var(--color-secondary-label) / <alpha-value>)',
}
```

### 1.2 Background Color Hierarchy (Hierarhija ozadij)

Apple definira **DVA sistema** ozadij:

#### A) System Background Colors (za navadne views)
```
1. systemBackground (primary) → main app background
2. secondarySystemBackground → cards, grouped content
3. tertiarySystemBackground → nested cards, elevated content
```

**Uporaba:**
- `systemBackground`: glavno ozadje aplikacije
- `secondarySystemBackground`: kartice, modali
- `tertiarySystemBackground`: nested kartice, list groups

#### B) Grouped Background Colors (za grouped content)
```
1. systemGroupedBackground → group wrappers
2. secondarySystemGroupedBackground → cells in groups
3. tertiarySystemGroupedBackground → nested cells
```

**Kdaj uporabiti:**
- Grouped table views (Settings-style lists)
- Grouped form fields
- Section containers

**Kritični Insight za Next.js:**
```tsx
// NAPAČNO ❌
<div className="bg-white dark:bg-gray-900">

// PRAVILNO ✅
<div className="bg-system-background">

// PRAVILNO za kartice ✅
<div className="bg-secondary-background">
```

### 1.3 Fill Colors (Polnila za UI elemente)

Apple uporablja **4 nivoje fill colors** z alpha transparency:

```
systemFill (opacity ~20%) → tanke oblike (slider tracks)
secondarySystemFill (opacity ~16%) → srednje oblike (switch backgrounds)
tertiarySystemFill (opacity ~12%) → velike oblike (input fields, search bars)
quaternarySystemFill (opacity ~8%) → zelo velike oblike (expanded cells)
```

**Pomembno:** Fill colors se **vedno uporabljajo PREKO background colors**, zato imajo alpha channel < 1.

**Praktična implementacija:**
```css
/* globals.css */
:root {
  --color-fill: 120 120 128 / 0.20; /* light mode */
  --color-secondary-fill: 120 120 128 / 0.16;
  --color-tertiary-fill: 118 118 128 / 0.12;
}

.dark {
  --color-fill: 120 120 128 / 0.36; /* dark mode */
  --color-secondary-fill: 120 120 128 / 0.32;
  --color-tertiary-fill: 118 118 128 / 0.24;
}
```

### 1.4 Label Colors (Hierarhija besedil)

Apple uporablja **4 nivoje** label colors za vzpostavitev hierarhije:

```
label → primary text (100% opacity)
secondaryLabel → secondary text (~60% opacity)
tertiaryLabel → tertiary text (~30% opacity)
quaternaryLabel → quaternary text (~18% opacity)
```

**Uporaba:**
- `label`: H1-H3, primary body text, button labels
- `secondaryLabel`: descriptions, helper text, placeholders
- `tertiaryLabel`: disabled text, timestamps
- `quaternaryLabel`: watermarks, extremely subtle text

**Praktični primer:**
```tsx
<h1 className="text-label">Main Title</h1>
<p className="text-secondary-label">Supporting description</p>
<span className="text-tertiary-label">Last updated 2h ago</span>
```

### 1.5 System Colors (Tint Colors)

Apple definira **standardne barve**, ki se avtomatsko prilagajajo:

```
systemRed, systemOrange, systemYellow, systemGreen,
systemMint, systemTeal, systemCyan, systemBlue,
systemIndigo, systemPurple, systemPink, systemBrown
```

**Ključne značilnosti:**
- Vsaka barva ima **light in dark mode variant**
- Barve so optimizirane za **WCAG AA contrast**
- Barve so **vibrant** in **žive** v obeh modusih

**Primerjava light vs dark mode:**

| Color | Light Mode | Dark Mode |
|-------|-----------|-----------|
| systemBlue | #007AFF | #0A84FF |
| systemGreen | #34C759 | #30D158 |
| systemRed | #FF3B30 | #FF453A |
| systemOrange | #FF9500 | #FF9F0A |

**Pomembno za design system:**
- Primary modra (#3b82f6) mora imeti dark mode variant (#60a5fa)
- Success zelena mora imati svetlejšo verzijo za dark mode
- Error rdeča mora biti bolj vibrant v dark mode

### 1.6 Gray System Colors (6 odtenkov)

Apple uporablja **6 nivojev** gray barv:

```
systemGray (base)
systemGray2, systemGray3, systemGray4, systemGray5, systemGray6
```

**Pravilo:** Višje število → bližje systemBackground

**Praktična uporaba:**
```
systemGray → borders, separators
systemGray2 → subtle backgrounds
systemGray3 → disabled states
systemGray4 → very subtle dividers
systemGray5 → almost invisible separators
systemGray6 → barely visible backgrounds
```

### 1.7 Wide Color (Display P3) - Napredna funkcionalnost

**Kaj je Display P3?**
- Širši barvni spekter od sRGB (~25% več barv)
- Uporablja D65 white point (kot sRGB)
- sRGB gamma curve (2.2)
- Podprt na: iPhone 7+, MacBook Pro, iMac Retina, iPad Pro

**Kdaj uporabiti P3:**
- **Fotografije in vizualni content** → bogatejše barve
- **Brand colors** → bolj žive in vibrantne
- **Video in gaming content** → realističnejši prikaz

**Kdaj NE uporabiti P3:**
- **UI elementi** → uporabi sRGB za konsistentnost
- **Ikone in tipografija** → sRGB zadostuje
- **Cross-platform content** → sRGB za širšo kompatibilnost

**Implementacija v CSS (modern browsers):**
```css
/* Fallback za sRGB + P3 enhancement */
.vibrant-blue {
  background-color: #007AFF; /* sRGB fallback */
}

@supports (color: color(display-p3 1 1 1)) {
  .vibrant-blue {
    background-color: color(display-p3 0 0.48 1); /* P3 enhancement */
  }
}
```

**Opomba za Next.js design system:**
- Uporabljaj P3 **samo za brand colors in hero images**
- Ostani pri sRGB za **UI komponente in besedilo**
- Testiraj na **P3 in non-P3 displays**

---

## 2. DARK MODE - POGLOBLJENA ANALIZA

### 2.1 Dark Mode Filozofija

**Apple's Dark Mode NI:**
- ❌ Preprosta inverzija barv
- ❌ Samo black background
- ❌ Zmanjšanje kontrasta

**Apple's Dark Mode JE:**
- ✅ Skrbno oblikovana barvna paleta
- ✅ Increased vibrancy za foreground content
- ✅ Elevated materials (shadow → lighter tones)
- ✅ Semantic color adaptation

### 2.2 Elevated Materials (Senčenje v Dark Mode)

**V Light Mode:** Uporabljamo drop shadows za globino  
**V Dark Mode:** Uporabljamo **svetlejše tone** za elevated content

**Primer:**
```css
/* Light mode: shadow za globino */
.card-light {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Dark mode: svetlejši ton za globino */
.card-dark {
  background: rgb(28, 28, 30); /* base dark background */
  /* Elevated version */
  background: rgb(44, 44, 46); /* lighter = elevated */
}
```

**Implementacija v Tailwind:**
```typescript
// tailwind.config.ts
boxShadow: {
  'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
  'card-dark': '0 2px 16px rgba(0, 0, 0, 0.6)', // večja opacity v dark mode
}
```

### 2.3 Vibrancy (Povečan contrast za foreground)

**Princip:** Dark mode uporablja **bolj vibrantne barve** za foreground content.

**Primeri:**
```
Blue light: #007AFF → Blue dark: #0A84FF (bolj vibrant)
Green light: #34C759 → Green dark: #30D158 (bolj vibrant)
Red light: #FF3B30 → Red dark: #FF453A (bolj vibrant)
```

**Razlog:** Temno ozadje "absorbira" barve, zato potrebujemo višjo vibrancy.

### 2.4 Transition Between Modes

**Apple priporoča:**
- Smooth transition (200-300ms)
- Simultaneous update vseh elementov
- **NE** animiraj posameznih elementov (laggy občutek)

**Implementacija z next-themes:**
```tsx
// app/providers.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false} // enable smooth transition
>
```

```css
/* globals.css */
* {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

### 2.5 Testing Dark Mode

**Apple priporoča testiranje na:**
- ☑️ Multiple lighting conditions (daylight, dim room, night)
- ☑️ Different display types (LCD, OLED, mini-LED)
- ☑️ With/without True Tone enabled
- ☑️ With/without Night Shift enabled
- ☑️ Different brightness levels

---

## 3. BRANDING - POGLOBLJENA ANALIZA

### 3.1 Apple's Branding Filozofija

**Ključno načelo:** "Subtle refinement over loud branding"

**Apple priporoča:**
- ✅ Use **custom color palette** for branding
- ✅ Use **custom typography** for personality
- ✅ Use **subtle background customization**
- ❌ DON'T plaster logos everywhere
- ❌ DON'T use intrusive branding elements
- ❌ DON'T waste screen space on brand assets

### 3.2 Logo Usage Guidelines

**Kdaj prikazati logo:**
- ✅ Launch screen (samo enkrat pri zagonu)
- ✅ About screen / Settings
- ✅ Marketing materials (zunaj aplikacije)
- ❌ NE v navigation bar-u
- ❌ NE v vsaki view
- ❌ NE kot watermark

**Razlog:** Uporabniki že vedo, katero aplikacijo uporabljajo. Extra space naj se uporabi za **actual content** in **user controls**.

### 3.3 Branding Through Color

**Apple's pristop:** Uporabi **eno ključno barvo** (key color) za interaktivne elemente.

**Primeri Apple apps:**
- **Notes:** Yellow (#FFCC00) za interaktivne elemente
- **Calendar:** Red (#FF3B30) za interaktivne elemente
- **Mail:** Blue (#007AFF) za interaktivne elemente

**Implementacija v Next.js:**
```typescript
// tailwind.config.ts
colors: {
  brand: {
    50: '#eff6ff',
    // ... vse odtenke
    500: '#3b82f6', // primary brand color (light mode)
    600: '#2563eb', // primary brand color (dark mode)
    // ... vse odtenke
  }
}
```

```tsx
// Use brand color konsistentno
<Button className="bg-brand-500 dark:bg-brand-600">
  Primary Action
</Button>
```

### 3.4 Branding Through Typography

**Apple priporoča:**
- ✅ Custom fonts za **headlines in subheadings**
- ✅ System fonts za **body text in captions**
- ✅ Maintain **legibility at all sizes**
- ✅ Support **Dynamic Type** (accessibility)

**Primer implementacije:**
```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
}
```

```tsx
// Uporaba
<h1 className="font-display">Brand Headline</h1>
<p className="font-body">Body content</p>
```

### 3.5 Consistent Patterns (Vzorci za branding)

**Apple poudarja:** Vzpostavi **design patterns**, ki postanejo prepoznavni.

**Elementi za branding:**
- **Button styles:** Unique border radius, shadow, hover effects
- **Card layouts:** Consistent spacing, elevation, corners
- **Navigation patterns:** Recognizable tab bar, navbar style
- **Iconography:** Consistent stroke width, style (npr. vedno Lucide React)

**Primer:**
```tsx
// Consistent button pattern across app
const brandButtonClasses = `
  rounded-xl           // unique border radius
  px-6 py-3            // consistent padding
  font-medium          // consistent weight
  transition-all       // smooth interactions
  hover:scale-105      // signature hover effect
  active:scale-95      // signature active effect
`;
```

---

## 4. ACCESSIBILITY - WCAG AA COMPLIANCE

### 4.1 Color Contrast Requirements

**WCAG AA minimumi:**
- **Normal text (< 18px):** Contrast ratio ≥ 4.5:1
- **Large text (≥ 18px):** Contrast ratio ≥ 3:1
- **UI components:** Contrast ratio ≥ 3:1

**Apple semantic colors že ustrezajo WCAG AA**, zato jih uporabljaj namesto custom colors.

### 4.2 Testing Contrast

**Orodja:**
- WebAIM Contrast Checker
- Chrome DevTools (Accessibility panel)
- Figma Contrast Plugin
- Stark Plugin

**Primer preverjanja:**
```
Primary Blue (#3b82f6) on White (#ffffff)
→ Contrast: 4.56:1 ✅ (WCAG AA za normal text)

Primary Blue (#3b82f6) on Gray-100 (#f3f4f6)
→ Contrast: 3.89:1 ❌ (premalo za normal text)
```

### 4.3 Color Blindness Considerations

**Apple priporoča:**
- ❌ NE uporabljaj samo barve za razlikovanje stanj
- ✅ Dodaj **ikone, oblike, patterns**
- ✅ Uporabljaj **text labels**

**Primer:**
```tsx
// NAPAČNO ❌
<Badge color="green">Active</Badge>
<Badge color="red">Inactive</Badge>

// PRAVILNO ✅
<Badge color="green" icon={CheckIcon}>Active</Badge>
<Badge color="red" icon={XIcon}>Inactive</Badge>
```

---

## 5. KLJČNE PRIPOROČILA ZA NEXT.JS DESIGN SYSTEM

### 5.1 Barve

**MORA biti implementirano:**
```typescript
// 1. Semantic color system (CSS variables)
--color-background, --color-secondary-background, --color-tertiary-background
--color-label, --color-secondary-label, --color-tertiary-label
--color-fill, --color-secondary-fill, --color-tertiary-fill

// 2. System tint colors
systemBlue, systemGreen, systemRed, systemOrange (z light/dark variants)

// 3. Gray system
systemGray, systemGray2, systemGray3, systemGray4, systemGray5, systemGray6

// 4. Brand primary color
brand-50 do brand-950 (z 500 kot light, 600 kot dark primary)
```

### 5.2 Dark Mode

**MORA biti implementirano:**
```typescript
// 1. next-themes setup
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>

// 2. Smooth transitions (200ms)
* { transition: background-color 200ms, color 200ms, border-color 200ms; }

// 3. Elevated materials (svetlejši toni namesto shadows)
Dark mode: Use lighter backgrounds for elevated content

// 4. Vibrancy
Increase saturation/brightness za dark mode colors
```

### 5.3 Branding

**MORA biti implementirano:**
```typescript
// 1. Key color system
Primary brand color (#3b82f6) uporabljena konsistentno za interaktivne elemente

// 2. Custom typography hierarchy
Display font (Inter) za headlines
System font za body text

// 3. Signature patterns
Unique border-radius (xl = 12px, 2xl = 16px)
Consistent hover/active states (scale-105/scale-95)
Signature shadow system (4 nivoje)
```

### 5.4 Accessibility

**MORA biti implementirano:**
```typescript
// 1. WCAG AA contrast ratios
Vse color combinations testirane (≥ 4.5:1 za normal text)

// 2. Focus states
Ring system (ring-2 ring-brand-500) za vse interaktivne elemente

// 3. Non-color indicators
Icons + colors za stanja (ne samo barva)

// 4. Semantic HTML
Proper use of <button>, <a>, <input>, headings hierarchy
```

---

## 6. IMPLEMENTACIJA - PRAKTIČNI KORAKI

### Korak 1: Setup CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Background System */
    --color-background: 255 255 255;
    --color-secondary-background: 247 247 247;
    --color-tertiary-background: 255 255 255;
    
    --color-grouped-background: 242 242 247;
    --color-secondary-grouped-background: 255 255 255;
    --color-tertiary-grouped-background: 242 242 247;
    
    /* Label System */
    --color-label: 0 0 0;
    --color-secondary-label: 60 60 67;
    --color-tertiary-label: 60 60 67 / 0.3;
    --color-quaternary-label: 60 60 67 / 0.18;
    
    /* Fill System */
    --color-fill: 120 120 128 / 0.20;
    --color-secondary-fill: 120 120 128 / 0.16;
    --color-tertiary-fill: 118 118 128 / 0.12;
    --color-quaternary-fill: 116 116 128 / 0.08;
    
    /* Gray System */
    --color-gray: 142 142 147;
    --color-gray-2: 174 174 178;
    --color-gray-3: 199 199 204;
    --color-gray-4: 209 209 214;
    --color-gray-5: 229 229 234;
    --color-gray-6: 242 242 247;
    
    /* System Colors */
    --color-blue: 0 122 255;
    --color-green: 52 199 89;
    --color-red: 255 59 48;
    --color-orange: 255 149 0;
    
    /* Brand */
    --color-brand-primary: 59 130 246;
  }
  
  .dark {
    /* Background System */
    --color-background: 0 0 0;
    --color-secondary-background: 28 28 30;
    --color-tertiary-background: 44 44 46;
    
    --color-grouped-background: 0 0 0;
    --color-secondary-grouped-background: 28 28 30;
    --color-tertiary-grouped-background: 44 44 46;
    
    /* Label System */
    --color-label: 255 255 255;
    --color-secondary-label: 152 152 157;
    --color-tertiary-label: 152 152 157 / 0.3;
    --color-quaternary-label: 152 152 157 / 0.18;
    
    /* Fill System */
    --color-fill: 120 120 128 / 0.36;
    --color-secondary-fill: 120 120 128 / 0.32;
    --color-tertiary-fill: 118 118 128 / 0.24;
    --color-quaternary-fill: 118 118 128 / 0.18;
    
    /* Gray System */
    --color-gray: 142 142 147;
    --color-gray-2: 99 99 102;
    --color-gray-3: 72 72 74;
    --color-gray-4: 58 58 60;
    --color-gray-5: 44 44 46;
    --color-gray-6: 28 28 30;
    
    /* System Colors (more vibrant in dark) */
    --color-blue: 10 132 255;
    --color-green: 48 209 88;
    --color-red: 255 69 58;
    --color-orange: 255 159 10;
    
    /* Brand */
    --color-brand-primary: 96 165 250;
  }
}

@layer base {
  * {
    @apply border-border;
    transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
  }
  
  body {
    @apply bg-background text-label;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Korak 2: Update tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Background System
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'secondary-background': 'rgb(var(--color-secondary-background) / <alpha-value>)',
        'tertiary-background': 'rgb(var(--color-tertiary-background) / <alpha-value>)',
        
        'grouped-background': 'rgb(var(--color-grouped-background) / <alpha-value>)',
        'secondary-grouped-background': 'rgb(var(--color-secondary-grouped-background) / <alpha-value>)',
        'tertiary-grouped-background': 'rgb(var(--color-tertiary-grouped-background) / <alpha-value>)',
        
        // Semantic Label System
        label: 'rgb(var(--color-label) / <alpha-value>)',
        'secondary-label': 'rgb(var(--color-secondary-label) / <alpha-value>)',
        'tertiary-label': 'rgb(var(--color-tertiary-label))',
        'quaternary-label': 'rgb(var(--color-quaternary-label))',
        
        // Semantic Fill System
        fill: 'rgb(var(--color-fill))',
        'secondary-fill': 'rgb(var(--color-secondary-fill))',
        'tertiary-fill': 'rgb(var(--color-tertiary-fill))',
        'quaternary-fill': 'rgb(var(--color-quaternary-fill))',
        
        // Gray System
        'system-gray': 'rgb(var(--color-gray) / <alpha-value>)',
        'system-gray-2': 'rgb(var(--color-gray-2) / <alpha-value>)',
        'system-gray-3': 'rgb(var(--color-gray-3) / <alpha-value>)',
        'system-gray-4': 'rgb(var(--color-gray-4) / <alpha-value>)',
        'system-gray-5': 'rgb(var(--color-gray-5) / <alpha-value>)',
        'system-gray-6': 'rgb(var(--color-gray-6) / <alpha-value>)',
        
        // System Tint Colors
        'system-blue': 'rgb(var(--color-blue) / <alpha-value>)',
        'system-green': 'rgb(var(--color-green) / <alpha-value>)',
        'system-red': 'rgb(var(--color-red) / <alpha-value>)',
        'system-orange': 'rgb(var(--color-orange) / <alpha-value>)',
        
        // Brand Primary
        brand: 'rgb(var(--color-brand-primary) / <alpha-value>)',
      },
      
      fontFamily: {
        display: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'var(--font-inter)', 'sans-serif'],
      },
      
      fontSize: {
        // Apple-inspired type scale
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],       // 14px
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],// 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.04em' }],          // 48px
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],       // 60px
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],        // 72px
      },
      
      borderRadius: {
        'sm': '0.375rem',   // 6px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
      },
      
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Dark mode shadows (higher opacity)
        'dark-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'dark-md': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
      },
      
      animation: {
        'fade-in': 'fadeIn 200ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Korak 3: Setup next-themes Provider

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 7. ZAKLJUČEK IN PRIPOROČILA

### Ključne ugotovitve:

1. **Semantic colors > Fixed colors**: Uporabljaj CSS spremenljivke, ne fiksnih Tailwind barv
2. **Hierarchy matters**: Uporablja background/label/fill hierarhije za konsistentnost
3. **Subtle branding**: Custom colors + typography, ne logo spam
4. **Dark mode is NOT inversion**: Posebne barve, vibrancy, elevated materials
5. **Accessibility first**: WCAG AA, non-color indicators, focus states

### Prioritete implementacije:

**MUST HAVE (P0):**
- ✅ Semantic color system (CSS variables)
- ✅ Dark mode z next-themes
- ✅ Background/Label/Fill hierarhije
- ✅ WCAG AA contrast ratios

**SHOULD HAVE (P1):**
- ✅ System tint colors (blue, green, red, orange)
- ✅ Gray system (6 odtenkov)
- ✅ Elevated materials v dark mode
- ✅ Smooth transitions (200ms)

**NICE TO HAVE (P2):**
- ⭕ Wide Color (P3) support
- ⭕ Custom accent color selection
- ⭕ High contrast mode
- ⭕ Reduced motion support

### Next Steps:

1. **Implementiraj CSS variables** (globals.css)
2. **Update Tailwind config** (semantic colors)
3. **Setup next-themes** (dark mode provider)
4. **Build komponente** (Button, Card, Input z semantic colors)
5. **Test accessibility** (WCAG AA contrast, keyboard navigation)
6. **Refine branding** (custom colors, typography, patterns)

---

**Avtor:** Claude (Anthropic)  
**Verzija:** 1.0  
**Datum:** 8. februar 2026  
**Status:** FINALNO POROČILO

