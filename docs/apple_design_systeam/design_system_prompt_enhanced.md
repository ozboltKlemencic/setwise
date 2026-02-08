# PREMIUM DESIGN SYSTEM PROMPT - Enhanced z Apple HIG Insights
## Za AI Agent: Ustvarjanje profesionalnega design systema za Next.js 15

---

## KONTEKST IN CILJ

Ustvari celovit, premium design system za Next.js 15 spletno aplikacijo z Tailwind CSS. Design system mora biti:

- **Apple-inspired**: Temelji na Apple Human Interface Guidelines principih
- **Semantic First**: Barve definirane po namenu, ne po izgledu
- **Popolnoma funkcionalen** z dark/light mode podporo
- **Zasnovan na REM enotah** za dostopnost in odzivnost
- **Primary barva**: MODRA (#3b82f6 kot osnova za light, #60a5fa za dark mode)
- **Ikone**: Lucide React
- **WCAG AA compliant** za vse color combinations

---

## GLAVNI VIRI ZA ŠTUDIJ

### Apple Design Guidelines (PRIORITETA 1):
1. **Typography**: https://developer.apple.com/design/human-interface-guidelines/typography
2. **Color**: https://developer.apple.com/design/human-interface-guidelines/color
3. **Layout**: https://developer.apple.com/design/human-interface-guidelines/layout
4. **Dark Mode**: https://developer.apple.com/design/human-interface-guidelines/dark-mode
5. **Branding**: https://developer.apple.com/design/human-interface-guidelines/branding

### Material Design 3 (PRIORITETA 2):
1. **Typography**: https://m3.material.io/styles/typography/type-scale-tokens
2. **Color System**: https://m3.material.io/styles/color/system/overview

### Design System Best Practices (PRIORITETA 3):
1. **Typography**: https://medium.com/codyhouse/create-your-design-system-part-1-typography-7c630d9092bd
2. **Spacing & Layout**: https://www.designsystems.com/space-grids-and-layouts/

---

## ZAHTEVE PO KATEGORIJAH

### 1. BARVNI SISTEM (SEMANTIC COLORS - Apple Approach)

**KRITIČNO POMEMBNO**: Uporabljaj **semantic color system**, ne fiksne Tailwind barve!

#### 1.1 Semantic Background System

**Implementiraj DVA sistema ozadij:**

**A) System Background Colors** (za navadne views):
```css
--color-background (primary)
--color-secondary-background (cards, grouped content)
--color-tertiary-background (nested cards, elevated)
```

**Uporaba:**
- `background`: glavno ozadje aplikacije
- `secondary-background`: kartice, modali, panels
- `tertiary-background`: nested kartice, list groups

**B) Grouped Background Colors** (za grouped content):
```css
--color-grouped-background
--color-secondary-grouped-background
--color-tertiary-grouped-background
```

**Kdaj uporabiti:**
- Grouped table views (Settings-style lists)
- Grouped form fields
- Section containers

#### 1.2 Semantic Label System (4 nivoje za tipografsko hierarhijo)

```css
--color-label (primary text, 100% opacity)
--color-secondary-label (secondary text, ~60% opacity)
--color-tertiary-label (tertiary text, ~30% opacity)
--color-quaternary-label (watermarks, ~18% opacity)
```

**Uporaba:**
- `label`: H1-H3, primary body text, button labels
- `secondary-label`: descriptions, helper text, placeholders
- `tertiary-label`: disabled text, timestamps
- `quaternary-label`: extremely subtle text, watermarks

#### 1.3 Semantic Fill System (4 nivoje z alpha transparency)

```css
--color-fill (opacity ~20%) → thin shapes (slider tracks)
--color-secondary-fill (opacity ~16%) → medium shapes (switch backgrounds)
--color-tertiary-fill (opacity ~12%) → large shapes (input fields, search bars)
--color-quaternary-fill (opacity ~8%) → very large shapes (expanded cells)
```

**POMEMBNO:** Fill colors se **vedno uporabljajo PREKO background colors** (alpha < 1).

#### 1.4 Gray System (6 odtenkov)

```css
--color-gray (base gray)
--color-gray-2 (trending toward background)
--color-gray-3
--color-gray-4
--color-gray-5
--color-gray-6 (closest to background)
```

**Pravilo:** Višje število → bližje background color.

**Uporaba:**
- `gray`: borders, separators
- `gray-2`: subtle backgrounds
- `gray-3`: disabled states
- `gray-4`: very subtle dividers
- `gray-5`: almost invisible separators
- `gray-6`: barely visible backgrounds

#### 1.5 System Tint Colors

Implementiraj Apple's system colors z **light in dark mode variants**:

```typescript
systemBlue:   light #007AFF → dark #0A84FF (more vibrant)
systemGreen:  light #34C759 → dark #30D158 (more vibrant)
systemRed:    light #FF3B30 → dark #FF453A (more vibrant)
systemOrange: light #FF9500 → dark #FF9F0A (more vibrant)
systemYellow: light #FFCC00 → dark #FFD60A
systemPink:   light #FF2D55 → dark #FF375F
systemPurple: light #AF52DE → dark #BF5AF2
systemIndigo: light #5856D6 → dark #5E5CE6
```

**Pomembno:** Dark mode barve so **bolj vibrantne** (higher saturation/brightness).

#### 1.6 Brand Primary Color

Primary modra paleta z **light/dark mode optimizacijo**:

```typescript
brand: {
  50:  '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Light mode primary
  600: '#2563eb',  // Dark mode primary (bolj vibrant)
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
}
```

#### 1.7 Semantic Colors (Success, Warning, Error, Info)

```typescript
success: systemGreen variants
warning: systemOrange variants
error:   systemRed variants
info:    systemBlue variants
```

**Zahteve:**
- Vse color combinations morajo imeti **WCAG AA contrast ratio** (≥4.5:1 za normal text)
- Test z WebAIM Contrast Checker
- Vključi non-color indicators (icons) za color blind users

#### 1.8 Wide Color (Display P3) - Opcijsko

**Kdaj uporabiti:**
- ✅ Brand colors (vibrant enhancement)
- ✅ Hero images, fotografije
- ✅ Marketing materials
- ❌ NE za UI komponente (stay sRGB)

**Implementacija:**
```css
.vibrant-brand {
  background: #3b82f6; /* sRGB fallback */
}

@supports (color: color(display-p3 1 1 1)) {
  .vibrant-brand {
    background: color(display-p3 0.23 0.51 0.96);
  }
}
```

---

### 2. DARK MODE (Apple Approach)

**KRITIČNO**: Dark mode NI inverzija barv!

#### 2.1 Dark Mode Principi

**Dark Mode JE:**
- ✅ Skrbno oblikovana barvna paleta
- ✅ Increased vibrancy za foreground content
- ✅ Elevated materials (lighter tones namesto shadows)
- ✅ Semantic color adaptation

**Dark Mode NI:**
- ❌ Preprosta inverzija
- ❌ Samo black background
- ❌ Zmanjšanje kontrasta

#### 2.2 Elevated Materials

**Light Mode:** Drop shadows za globino  
**Dark Mode:** Svetlejši toni za elevated content

```css
/* Light mode */
.card-light {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Dark mode */
.card-dark {
  background: rgb(28, 28, 30); /* base */
  /* Elevated version */
  background: rgb(44, 44, 46); /* lighter = higher elevation */
}
```

**Pravilo:** V dark mode, **višja elevacija = svetlejša barva**.

#### 2.3 Vibrancy (Povečana saturacija)

Dark mode uporablja **bolj vibrantne barve** za foreground content.

**Razlog:** Temno ozadje "absorbira" barve → potrebujemo višjo vibrancy.

#### 2.4 Smooth Transitions

```typescript
// next-themes setup
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false} // enable smooth 200ms transition
>
```

```css
/* globals.css */
* {
  transition: background-color 200ms ease, 
              color 200ms ease, 
              border-color 200ms ease;
}
```

**Pravilo:** Vsi elementi se morajo **simultano** animirati (ne posamezno).

#### 2.5 Dark Mode Testing

**Apple priporoča testiranje:**
- ☑️ Multiple lighting conditions (daylight, dim, night)
- ☑️ Different displays (LCD, OLED, mini-LED)
- ☑️ True Tone enabled/disabled
- ☑️ Night Shift enabled/disabled
- ☑️ Different brightness levels

---

### 3. TIPOGRAFIJA (Apple-Inspired)

#### 3.1 Font Stack

**Display Font (headlines, branding):**
```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
```

**Body Font (besedilo, UI):**
```css
--font-body: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
```

#### 3.2 Type Scale (rem-based)

Apple-inspired type scale z **negativnim letter-spacing** za velike naslove:

```typescript
fontSize: {
  'xs':   ['0.75rem',  { lineHeight: '1rem',     letterSpacing: '0.01em' }],  // 12px
  'sm':   ['0.875rem', { lineHeight: '1.25rem',  letterSpacing: '0' }],       // 14px
  'base': ['1rem',     { lineHeight: '1.5rem',   letterSpacing: '0' }],       // 16px
  'lg':   ['1.125rem', { lineHeight: '1.75rem',  letterSpacing: '-0.01em' }], // 18px
  'xl':   ['1.25rem',  { lineHeight: '1.75rem',  letterSpacing: '-0.01em' }], // 20px
  '2xl':  ['1.5rem',   { lineHeight: '2rem',     letterSpacing: '-0.02em' }], // 24px
  '3xl':  ['1.875rem', { lineHeight: '2.25rem',  letterSpacing: '-0.02em' }], // 30px
  '4xl':  ['2.25rem',  { lineHeight: '2.5rem',   letterSpacing: '-0.03em' }], // 36px
  '5xl':  ['3rem',     { lineHeight: '1',        letterSpacing: '-0.04em' }], // 48px
  '6xl':  ['3.75rem',  { lineHeight: '1',        letterSpacing: '-0.04em' }], // 60px
  '7xl':  ['4.5rem',   { lineHeight: '1',        letterSpacing: '-0.05em' }], // 72px
}
```

**Pravilo:** Večji font → bolj negativen letter-spacing.

#### 3.3 Font Weights

```typescript
fontWeight: {
  light:    300,
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
}
```

#### 3.4 Line Height Hierarhija

```typescript
lineHeight: {
  none:    '1',
  tight:   '1.25',    // headlines
  snug:    '1.375',   // subheadings
  normal:  '1.5',     // body text
  relaxed: '1.625',   // long-form content
  loose:   '2',       // very spacious
}
```

---

### 4. SPACING SISTEM (8px Grid)

#### 4.1 Base Grid: 8px (0.5rem)

```typescript
spacing: {
  0:    '0',           // 0px
  px:   '1px',         // 1px
  0.5:  '0.125rem',    // 2px
  1:    '0.25rem',     // 4px
  1.5:  '0.375rem',    // 6px
  2:    '0.5rem',      // 8px   ← Base unit
  3:    '0.75rem',     // 12px
  4:    '1rem',        // 16px
  5:    '1.25rem',     // 20px
  6:    '1.5rem',      // 24px
  8:    '2rem',        // 32px
  10:   '2.5rem',      // 40px
  12:   '3rem',        // 48px
  16:   '4rem',        // 64px
  20:   '5rem',        // 80px
  24:   '6rem',        // 96px
  32:   '8rem',        // 128px
  40:   '10rem',       // 160px
  48:   '12rem',       // 192px
  64:   '16rem',       // 256px
}
```

#### 4.2 Spacing Hierarhija

```
Micro:  1-2   (4-8px)    → icon gaps, tight spacing
Small:  3-4   (12-16px)  → component padding, small gaps
Medium: 6-8   (24-32px)  → section padding, card spacing
Large:  12-16 (48-64px)  → section margins, hero spacing
XL:     24-32 (96-128px) → page sections, major divisions
```

#### 4.3 Component Spacing Rules

**Buttons:**
- Small: `px-3 py-1.5` (12px/6px)
- Medium: `px-4 py-2` (16px/8px)
- Large: `px-6 py-3` (24px/12px)

**Cards:**
- Padding: `p-4` (small), `p-6` (medium), `p-8` (large)
- Gap between cards: `gap-4` (16px) ali `gap-6` (24px)

**Sections:**
- Vertical spacing: `py-12` (mobile), `py-16` (tablet), `py-24` (desktop)
- Horizontal padding: `px-4` (mobile), `px-6` (tablet), `px-8` (desktop)

---

### 5. LAYOUT SISTEM

#### 5.1 Container System

```typescript
maxWidth: {
  'sm':   '640px',
  'md':   '768px',
  'lg':   '1024px',
  'xl':   '1280px',
  '2xl':  '1536px',
  'prose': '65ch',  // optimal reading width
}
```

#### 5.2 Breakpoints

```typescript
screens: {
  'sm':  '640px',   // Mobile landscape
  'md':  '768px',   // Tablet
  'lg':  '1024px',  // Desktop
  'xl':  '1280px',  // Large desktop
  '2xl': '1536px',  // Extra large desktop
}
```

#### 5.3 Grid System

- **Mobile (< 640px):** 4-column grid
- **Tablet (640-1024px):** 8-column grid
- **Desktop (> 1024px):** 12-column grid

**Implementacija:**
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* mobile */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(8, 1fr);  /* tablet */
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(12, 1fr); /* desktop */
    gap: 2rem;
  }
}
```

#### 5.4 Safe Areas (Mobile)

```css
/* iOS safe areas */
.safe-top {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.safe-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

---

### 6. BORDER RADIUS & SHADOWS

#### 6.1 Border Radius (Apple-inspired, rounded)

```typescript
borderRadius: {
  'none': '0',
  'sm':   '0.375rem',  // 6px
  'DEFAULT': '0.5rem', // 8px
  'md':   '0.75rem',   // 12px
  'lg':   '1rem',      // 16px
  'xl':   '1.25rem',   // 20px
  '2xl':  '1.5rem',    // 24px
  '3xl':  '2rem',      // 32px
  'full': '9999px',
}
```

**Uporaba:**
- Buttons: `rounded-lg` (16px)
- Cards: `rounded-xl` (20px)
- Modals: `rounded-2xl` (24px)
- Hero sections: `rounded-3xl` (32px)

#### 6.2 Shadows (Subtle, Apple-style)

**Light Mode:**
```typescript
boxShadow: {
  'xs':  '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'sm':  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  'md':  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  'lg':  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  'xl':  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}
```

**Dark Mode (higher opacity):**
```typescript
boxShadow: {
  'dark-sm':  '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
  'dark':     '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
  'dark-md':  '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  'dark-lg':  '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
}
```

**Uporaba:**
```tsx
// Light mode
<div className="shadow-md dark:shadow-dark-md">Card</div>

// Ali z custom implementation
<div className="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)]">
```

---

### 7. IKONE (Lucide React)

#### 7.1 Icon Sizes

```typescript
iconSize: {
  'xs':   '12px',  // 0.75rem
  'sm':   '16px',  // 1rem
  'base': '20px',  // 1.25rem
  'lg':   '24px',  // 1.5rem
  'xl':   '32px',  // 2rem
  '2xl':  '40px',  // 2.5rem
}
```

#### 7.2 Stroke Width

```typescript
strokeWidth: {
  'light':   1.5,
  'regular': 2,
  'bold':    2.5,
}
```

#### 7.3 Icon + Text Alignment

```tsx
// Pravilna vertikalna poravnava
<button className="inline-flex items-center gap-2">
  <Icon className="w-5 h-5" strokeWidth={2} />
  <span>Button Label</span>
</button>
```

---

### 8. BRANDING (Apple Approach)

**KRITIČNO**: Branding mora biti **subtilen**, ne intrusiven!

#### 8.1 Branding Principi

**Apple priporoča:**
- ✅ Use **custom color palette** za branding
- ✅ Use **custom typography** za personaliteto
- ✅ Use **subtle background customization**
- ❌ DON'T plaster logos everywhere
- ❌ DON'T waste screen space na brand assets
- ❌ DON'T use intrusive branding elements

#### 8.2 Logo Placement

**Kdaj prikazati logo:**
- ✅ Launch screen (samo enkrat)
- ✅ About screen / Settings
- ✅ Marketing materials (zunaj app)
- ❌ NE v navigation bar
- ❌ NE v vsaki view
- ❌ NE kot watermark

**Razlog:** Uporabniki že vedo, katero app uporabljajo → space za actual content!

#### 8.3 Branding Through Key Color

**Concept:** Uporabi **eno ključno barvo** za interaktivne elemente.

**Primeri:**
- Notes app: Yellow (#FFCC00)
- Calendar app: Red (#FF3B30)
- Mail app: Blue (#007AFF)

**Implementacija:**
```tsx
// Konsistentna uporaba brand color
<Button className="bg-brand hover:bg-brand/90">Primary Action</Button>
<Link className="text-brand hover:text-brand/80">Learn More</Link>
<Icon className="text-brand" />
```

#### 8.4 Branding Through Typography

```tsx
// Display font za branding
<h1 className="font-display text-5xl font-bold">Brand Headline</h1>

// System font za content
<p className="font-body text-base">Body content text</p>
```

#### 8.5 Signature Patterns

Vzpostavi **prepoznavne patterns**:

```tsx
// Signature button style
const brandButton = `
  rounded-xl              // unique radius
  px-6 py-3               // consistent padding
  font-medium             // consistent weight
  transition-all          // smooth
  hover:scale-105         // signature hover
  active:scale-95         // signature active
  shadow-md hover:shadow-lg // signature shadow
`;
```

---

### 9. KOMPONENTE (React + TypeScript)

Generiraj naslednje komponente z **semantic colors**:

#### 9.1 Button Component

```tsx
// Variants
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

// Sizes
type ButtonSize = 'sm' | 'md' | 'lg';

// States
- default
- hover (scale-105, shadow increase)
- active (scale-95)
- disabled (opacity-50, cursor-not-allowed)
- loading (spinner icon)

// Icon support
- leading icon
- trailing icon
- icon-only
```

**Barve:**
- Primary: `bg-brand` + `text-white`
- Secondary: `bg-secondary-background` + `text-label`
- Ghost: `hover:bg-fill` + `text-label`
- Outline: `border-2 border-brand` + `text-brand`
- Danger: `bg-system-red` + `text-white`

#### 9.2 Card Component

```tsx
// Variants
type CardVariant = 'default' | 'elevated' | 'outlined';

// Sections
<Card>
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
  <CardFooter>...</CardFooter>
</Card>

// Barve
- default: `bg-secondary-background`
- elevated: `bg-tertiary-background` + `shadow-lg`
- outlined: `bg-background` + `border border-system-gray-4`
```

#### 9.3 Input Component

```tsx
// Types
type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

// States
- default: `bg-tertiary-fill` + `text-label`
- focused: `ring-2 ring-brand`
- error: `ring-2 ring-system-red`
- disabled: `opacity-50` + `cursor-not-allowed`

// Icon support
- leading icon (search, user, etc.)
- trailing icon (clear, visibility toggle)
```

#### 9.4 Badge Component

```tsx
// Variants
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

// Sizes
type BadgeSize = 'sm' | 'md' | 'lg';

// Barve
- default: `bg-system-gray` + `text-white`
- primary: `bg-brand` + `text-white`
- success: `bg-system-green` + `text-white`
- warning: `bg-system-orange` + `text-white`
- error: `bg-system-red` + `text-white`
```

#### 9.5 Modal/Dialog Component

```tsx
// Struktura
<Modal>
  <ModalOverlay className="backdrop-blur-sm" />
  <ModalContent className="bg-secondary-background rounded-2xl">
    <ModalHeader>...</ModalHeader>
    <ModalBody>...</ModalBody>
    <ModalFooter>...</ModalFooter>
  </ModalContent>
</Modal>

// Animacije
- Overlay: fade-in (200ms)
- Content: scale-in + slide-up (300ms)
- Exit: reverse animations
```

---

### 10. ANIMACIJE & TRANSITIONS

#### 10.1 Timing

```typescript
transitionDuration: {
  'quick':    '200ms',    // hover, active states
  'standard': '300ms',    // modals, dropdowns
  'smooth':   '500ms',    // page transitions
}
```

#### 10.2 Easing (Apple cubic-bezier)

```typescript
transitionTimingFunction: {
  'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'in':    'cubic-bezier(0.4, 0, 1, 1)',
  'out':   'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

#### 10.3 Keyframe Animations

```typescript
keyframes: {
  fadeIn: {
    '0%':   { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%':   { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%':   { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}
```

#### 10.4 Hover Effects

```tsx
// Button hover
hover:scale-105 hover:shadow-lg transition-all duration-200

// Card hover
hover:shadow-md hover:-translate-y-1 transition-all duration-300

// Link hover
hover:text-brand/80 transition-colors duration-200
```

---

### 11. ACCESSIBILITY (WCAG AA)

#### 11.1 Color Contrast

**MUST achieve:**
- Normal text (< 18px): Contrast ratio ≥ 4.5:1
- Large text (≥ 18px): Contrast ratio ≥ 3:1
- UI components: Contrast ratio ≥ 3:1

**Testing:**
- WebAIM Contrast Checker
- Chrome DevTools Accessibility panel
- Figma Contrast Plugin

#### 11.2 Focus States

```tsx
// Všechni interaktivni elementi
focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2
```

#### 11.3 Non-Color Indicators

```tsx
// NAPAČNO ❌
<Badge color="green">Active</Badge>
<Badge color="red">Inactive</Badge>

// PRAVILNO ✅
<Badge color="green" icon={CheckIcon}>Active</Badge>
<Badge color="red" icon={XIcon}>Inactive</Badge>
```

#### 11.4 Semantic HTML

```tsx
// Proper heading hierarchy
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

// Proper button vs link
<button type="button">Action</button>  // performs action
<a href="/page">Link</a>               // navigates
```

---

## IZHODNI FORMAT

Generiraj naslednje datoteke:

### Core Files
1. **`/DESIGN_SYSTEM.md`** - Celotna dokumentacija
2. **`/tailwind.config.ts`** - Tailwind configuration z semantic colors
3. **`/app/globals.css`** - CSS variables, fonts, transitions
4. **`/app/layout.tsx`** - Root layout z ThemeProvider
5. **`/app/providers.tsx`** - Client component za next-themes
6. **`/lib/utils.ts`** - Helper funkcije (cn, etc.)
7. **`/types/components.ts`** - TypeScript types

### Component Files
8. **`/components/ui/Button.tsx`** - Button z semantic colors
9. **`/components/ui/Card.tsx`** - Card z background hierarchy
10. **`/components/ui/Input.tsx`** - Input z fill colors
11. **`/components/ui/Badge.tsx`** - Badge z system tint colors
12. **`/components/ui/Modal.tsx`** - Modal z overlay
13. **`/components/ThemeToggle.tsx`** - Dark mode toggle

### Example Files
14. **`/examples/HomePage.tsx`** - Landing page primer
15. **`/examples/ColorShowcase.tsx`** - Semantic colors showcase
16. **`/package.json`** - Dependencies

---

## STYLE GUIDELINES

### Code Style

```typescript
// TypeScript striktno
'use client'; // kjer potrebno
Functional components + hooks
Tailwind classes (NO inline styles)
Class ordering: layout → spacing → typography → colors → effects
Comments za kompleksne logike
```

### Naming Conventions

```
Components: PascalCase (Button, Card)
Props: camelCase (variant, size)
CSS variables: kebab-case (--color-primary)
Files: kebab-case (theme-toggle.tsx)
```

### Best Practices

```
Mobile-first approach (default → md: → lg:)
Semantic HTML (button, a, input, etc.)
Accessibility first (focus states, ARIA labels)
Performance optimized (lazy loading, code splitting)
```

---

## KRITIČNI CHECKPOINTS

### ✅ Semantic Colors

```tsx
// NAPAČNO ❌
<div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

// PRAVILNO ✅
<div className="bg-background text-label">
```

### ✅ Dark Mode Vibrancy

```tsx
// NAPAČNO ❌
<Button className="bg-blue-500">Primary</Button>

// PRAVILNO ✅
<Button className="bg-brand">Primary</Button>
// kjer brand = #3b82f6 (light) / #60a5fa (dark)
```

### ✅ Branding Subtlety

```tsx
// NAPAČNO ❌
<Navbar>
  <Logo size="large" />
  <Navigation />
</Navbar>

// PRAVILNO ✅
<Navbar>
  <Navigation /> {/* No logo, use brand color instead */}
</Navbar>
```

### ✅ Accessibility

```tsx
// NAPAČNO ❌
<div onClick={handleClick}>Click me</div>

// PRAVILNO ✅
<button onClick={handleClick} aria-label="Submit form">
  Click me
</button>
```

---

## PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.400.0",
    "next-themes": "^0.3.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## INSTALLATION INSTRUCTIONS

```bash
# 1. Create Next.js project
npx create-next-app@latest project-name --typescript --tailwind --app

# 2. Install dependencies
npm install lucide-react next-themes clsx tailwind-merge

# 3. Run development server
npm run dev
```

---

## FOLDER STRUCTURE

```
project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   └── ThemeToggle.tsx
├── lib/
│   └── utils.ts
├── types/
│   └── components.ts
├── examples/
│   ├── HomePage.tsx
│   └── ColorShowcase.tsx
├── tailwind.config.ts
├── package.json
└── DESIGN_SYSTEM.md
```

---

## KVALITETNI STANDARDI

### MUST HAVE (všechko):

- ✅ Semantic color system (CSS variables)
- ✅ Dark mode z next-themes
- ✅ Background/Label/Fill hierarchies
- ✅ WCAG AA contrast ratios (≥4.5:1)
- ✅ Focus states (ring-2)
- ✅ Smooth transitions (200ms)
- ✅ rem-based units
- ✅ Mobile-first approach
- ✅ TypeScript types
- ✅ Accessibility (ARIA, semantic HTML)

### QUALITY CHECKS:

- ✅ Vse barve testirane z WebAIM Contrast Checker
- ✅ Vse komponente delujejo v dark mode
- ✅ Vse interactive elementi imajo focus states
- ✅ Vse animacije imajo reducedMotion support
- ✅ Vse code examples so copy-paste ready
- ✅ Dokumentacija je jasna in podrobna

---

## ZAČNI Z GENERIANJEM

**Prioriteten vrstni red:**

1. **Setup Files** (globals.css, tailwind.config.ts, providers.tsx)
2. **Utility Files** (lib/utils.ts, types/components.ts)
3. **Core Components** (Button, Card, Input, Badge, Modal)
4. **Theme Toggle** (ThemeToggle.tsx)
5. **Documentation** (DESIGN_SYSTEM.md)
6. **Examples** (HomePage.tsx, ColorShowcase.tsx)

**POMEMBNO:**
- NO placeholders
- NO TODO comments
- Fully implemented code
- Production-ready quality
- Copy-paste ready examples

---

## FINALNI REMINDER

**Apple HIG ključne nauke:**

1. **Semantic > Fixed**: Barve po namenu, ne po izgledu
2. **Hierarchy matters**: Background/Label/Fill sistemi
3. **Subtle branding**: Custom colors + typography, NE logo spam
4. **Dark ≠ Inversion**: Vibrancy + elevated materials
5. **Accessibility first**: WCAG AA + non-color indicators

**Ustvari design system, ki je:**
- 🎨 Vizualno Apple-inspired
- 🛠️ Tehnično Next.js optimiziran
- ♿ Accessibility compliant
- 🌗 Dark mode native
- 📱 Mobile-first responsive

**GO! 🚀**
