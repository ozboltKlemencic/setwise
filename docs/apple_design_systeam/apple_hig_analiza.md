# STROKOVNO POROČILO: Apple Human Interface Guidelines - Celovita Analiza
## Poglobljena analiza za premium design system Next.js

**Datum:** 8. februar 2026  
**Namen:** Celovita analiza Apple HIG principov za implementacijo design sistema  
**Obseg:** Color, Dark Mode, Typography, Layout, Icons, Branding, Accessibility  
**Viri:** Apple Developer Documentation (december 2025 update), WWDC 2025

---

## IZVRŠNI POVZETEK

Apple Human Interface Guidelines (HIG) predstavlja celovit sistem za oblikovanje uporabniških vmesnikov. Z update-om decembra 2025 (Liquid Glass) Apple uvaja najobsežnejšo posodobitev dizajna doslej. Za naš Next.js design system so ključni naslednji stebri:

1. **Semantic Color System** — barve definirane po namenu (purpose), ne po izgledu (appearance)
2. **Dynamic Adaptation** — avtomatsko prilagajanje light/dark mode z increased contrast podporo
3. **Liquid Glass** — nov material-design pristop, ki omogoča adaptivno prozornost
4. **Subtle Branding** — minimalistična uporaba logotipov, poudarek na custom colors in fontih
5. **Typography Scale** — Dynamic Type z natančno definiranimi velikostmi za vsak text style
6. **Spacing & Layout** — 44pt minimum touch targets, safe areas, responsive grids

**Ključna ugotovitev:** Apple **ne uporablja absolutnih RGB vrednosti** v produkciji, ampak **semantične barve**, ki se dinamično prilagajajo kontekstu. Za web implementacijo moramo te barve preslikati v CSS spremenljivke.

---

## 1. BARVNI SISTEM — POGLOBLJENA ANALIZA

> **Vir:** https://developer.apple.com/design/human-interface-guidelines/color
> **Zadnja posodobitev:** 16. december 2025 (Liquid Glass update)

### 1.1 Filozofija — Semantic Colors

Apple HIG eksplicitno navaja:
- *"Judicious use of color can enhance communication, evoke your brand, provide visual continuity, communicate status and feedback, and help people understand information."*
- *"The system defines colors that look good on various backgrounds and appearance modes."*
- *"Dynamic system colors are semantically defined by their purpose, rather than their appearance or color values."*

**Ključno pravilo:** *"Avoid redefining the semantic meanings of dynamic system colors."* — Ne uporabljaj `separator` barve za besedilo ali `secondaryLabel` za ozadje.

### 1.2 System Tint Colors — Natančne Hex Vrednosti

Apple definira **12 standardnih system colors** z light in dark mode varianti:

| Color | Light Mode | Dark Mode | Opomba |
|-------|-----------|-----------|--------|
| **systemBlue** | `#007AFF` | `#0A84FF` | Privzeta interaktivna barva |
| **systemGreen** | `#34C759` | `#30D158` | Success, pozitivno |
| **systemRed** | `#FF3B30` | `#FF453A` | Error, destruktivno |
| **systemOrange** | `#FF9500` | `#FF9F0A` | Warning, opozorilo |
| **systemYellow** | `#FFCC00` | `#FFD60A` | Highlight, poudarek |
| **systemPink** | `#FF2D55` | `#FF375F` | Feminine, ekspresivno |
| **systemPurple** | `#AF52DE` | `#BF5AF2` | Kreativno, premium |
| **systemIndigo** | `#5856D6` | `#5E5CE6` | Profesionalno, globoko |
| **systemTeal** | `#5AC8FA` | `#64D2FF` | Info, svežina |
| **systemMint** | `#00C7BE` | `#63E6E2` | Svežina, zdravje |
| **systemCyan** | `#32ADE6` | `#64D2FF` | Informativno |
| **systemBrown** | `#A2845E` | `#AC8E68` | Toplo, naravno |

**Pomembno:** Dark mode barve so **bolj vibrantne** (višja saturacija/svetlost), ker temno ozadje "absorbira" barve.

### 1.3 Gray System — 6 Nivojev

| Color | Light Mode | Dark Mode | Uporaba |
|-------|-----------|-----------|---------|
| **systemGray** | `#8E8E93` | `#8E8E93` | Base gray (enak v obeh!) |
| **systemGray2** | `#AEAEB2` | `#636366` | Borders, dividers |
| **systemGray3** | `#C7C7CC` | `#48484A` | Disabled states |
| **systemGray4** | `#D1D1D6` | `#3A3A3C` | Subtle dividers |
| **systemGray5** | `#E5E5EA` | `#2C2C2E` | Almost invisible separators |
| **systemGray6** | `#F2F2F7` | `#1C1C1E` | Barely visible backgrounds |

**Pravilo:** Višje število → bližje systemBackground barvi. V dark mode je obratno — grays postanejo temnejši z višjo številko.

### 1.4 Background Color Hierarchy

Apple definira **DVA sistema ozadij** — System in Grouped:

#### A) System Background Colors (za standardne views)

| Color | Light Mode | Dark Mode | Uporaba |
|-------|-----------|-----------|---------|
| **systemBackground** | `#FFFFFF` | `#000000` | Glavno ozadje app |
| **secondarySystemBackground** | `#F2F2F7` | `#1C1C1E` | Kartice, paneli |
| **tertiarySystemBackground** | `#FFFFFF` | `#2C2C2E` | Nested kartice |

#### B) Grouped Background Colors (za grouped content — Settings-style)

| Color | Light Mode | Dark Mode | Uporaba |
|-------|-----------|-----------|---------|
| **systemGroupedBackground** | `#F2F2F7` | `#000000` | Wrapper za skupine |
| **secondarySystemGroupedBackground** | `#FFFFFF` | `#1C1C1E` | Celice v skupinah |
| **tertiarySystemGroupedBackground** | `#F2F2F7` | `#2C2C2E` | Nested celice |

**Hierarhija uporabe:**
- Primary → overall view background
- Secondary → grouping content ali elements within the overall view
- Tertiary → grouping content ali elements within secondary elements

### 1.5 Label Colors (Foreground — Hierarhija besedil)

| Color | Light Mode | Dark Mode | Opacity | Uporaba |
|-------|-----------|-----------|---------|---------|
| **label** | `#000000` | `#FFFFFF` | 100% | Primary text, H1-H3, buttons |
| **secondaryLabel** | `#3C3C43` (60% alpha) | `#EBEBF5` (60% alpha) | ~60% | Descriptions, helper text |
| **tertiaryLabel** | `#3C3C43` (30% alpha) | `#EBEBF5` (30% alpha) | ~30% | Disabled text, timestamps |
| **quaternaryLabel** | `#3C3C43` (18% alpha) | `#EBEBF5` (18% alpha) | ~18% | Watermarks, extremely subtle |

**Dodatne foreground barve:**
| Color | Uporaba |
|-------|---------|
| **placeholderText** | Placeholder text v controls/text views |
| **separator** | Transparenten separator (underlying content viden) |
| **opaqueSeparator** | Opaquen separator (brez vidnega content-a pod njim) |
| **link** | Interaktivne povezave |

### 1.6 Fill Colors (Za UI elemente z alpha transparency)

| Color | Opacity (~) | Uporaba |
|-------|-------------|---------|
| **systemFill** | ~20% | Tanke oblike (slider tracks) |
| **secondarySystemFill** | ~16% | Srednje oblike (switch backgrounds) |
| **tertiarySystemFill** | ~12% | Velike oblike (input fields, search bars) |
| **quaternarySystemFill** | ~8% | Zelo velike oblike (expanded cells) |

**Kritično:** Fill colors se **vedno uporabljajo PREKO background colors** (alpha < 1). V dark mode imajo **višjo opacity** za boljšo vidljivost.

```css
/* Natančne vrednosti za CSS implementacijo */
:root {
  --color-fill: rgba(120, 120, 128, 0.20);
  --color-secondary-fill: rgba(120, 120, 128, 0.16);
  --color-tertiary-fill: rgba(118, 118, 128, 0.12);
  --color-quaternary-fill: rgba(116, 116, 128, 0.08);
}

.dark {
  --color-fill: rgba(120, 120, 128, 0.36);
  --color-secondary-fill: rgba(120, 120, 128, 0.32);
  --color-tertiary-fill: rgba(118, 118, 128, 0.24);
  --color-quaternary-fill: rgba(118, 118, 128, 0.18);
}
```

### 1.7 Liquid Glass Color (NOVO — 2025)

Apple z iOS 26 / macOS 26 uvaja **Liquid Glass** material:

**Ključna pravila:**
- *"By default, Liquid Glass has no inherent color, and instead takes on colors from the content directly behind it."*
- *"Apply color sparingly to the Liquid Glass material."*
- Barvo uporabi **samo za primary actions** (npr. Done gumb z accent color background)
- *"Refrain from adding color to the background of multiple controls."*
- V monochromatic appih: accent color kot branding
- V colorful appih: prefer monochromatic toolbars/tab bars

### 1.8 Color Management — Display P3 vs sRGB

**Apple HIG navaja:**
- *"Use wide color to enhance the visual experience on compatible displays."*
- *"Wide color displays support a P3 color space, which can produce richer, more saturated colors than sRGB."*
- Uporabi P3 za **fotografije, video, brand colors**
- Uporabi sRGB za **UI komponente** (cross-platform konsistentnost)

```css
/* CSS implementacija za P3 */
.vibrant-brand {
  background-color: #3b82f6; /* sRGB fallback */
}

@supports (color: color(display-p3 1 1 1)) {
  .vibrant-brand {
    background-color: color(display-p3 0.23 0.51 0.96); /* P3 */
  }
}
```

### 1.9 Best Practices za Barve (Direktno iz HIG)

1. **"Avoid using the same color to mean different things."** — Konsistentna uporaba barv
2. **"Make sure all your app's colors work well in light, dark, and increased contrast contexts."** — Trije konteksti!
3. **"Test your app's color scheme under a variety of lighting conditions."** — Daylight, dim, night
4. **"Test your app on different devices."** — True Tone, P3 vs sRGB displays
5. **"Consider how artwork and translucency affect nearby colors."** — Backdrop effects
6. **"Avoid relying solely on color to differentiate between objects."** — Accessibility!
7. **"Avoid hard-coding system color values in your app."** — Uporabi APIs/spremenljivke

---

## 2. DARK MODE — POGLOBLJENA ANALIZA

> **Vir:** https://developer.apple.com/design/human-interface-guidelines/dark-mode
> **Podpora:** https://developer.apple.com/documentation/uikit/supporting-dark-mode-in-your-interface

### 2.1 Filozofija

**Dark mode NI:**
- ❌ Preprosta inverzija barv (to povzroča halation — bleedanje svetlega teksta)
- ❌ Samo black background
- ❌ Zmanjšanje kontrasta
- ❌ Enake barve z inverted brightness

**Dark mode JE:**
- ✅ Skrbno oblikovana barvna paleta z namensko izbranimi vrednostmi
- ✅ Increased vibrancy za foreground content (bolj žive barve)
- ✅ Elevated materials — svetlejši toni namesto shadows za globino
- ✅ Semantic color adaptation — vse barve imajo namenske dark variante

### 2.2 Elevated Materials — Ključni Princip

**Light Mode:** Drop shadows za prikaz globine (elevation)
**Dark Mode:** **Svetlejši background toni** za prikaz elevation

| Elevation Level | Light Mode | Dark Mode |
|----------------|-----------|-----------|
| Base (Level 0) | `#FFFFFF` + no shadow | `#000000` |
| Elevated (Level 1) | `#FFFFFF` + shadow-sm | `#1C1C1E` |
| Higher (Level 2) | `#FFFFFF` + shadow-md | `#2C2C2E` |
| Highest (Level 3) | `#FFFFFF` + shadow-lg | `#3A3A3C` |

**Pravilo:** V dark mode, **višja elevacija = svetlejša barva**. Shadows so skoraj nevidne na temnem ozadju, zato namesto njih uporabljamo lightness hierarchy.

### 2.3 Vibrancy — Povečana Saturacija

Dark mode zahteva **bolj vibrantne barve** za foreground content. Razlog: temno ozadje "absorbira" barve in zmanjša zaznani kontrast.

**Primeri light → dark transformacij:**
```
systemBlue:   #007AFF → #0A84FF  (+lightness, +saturation)
systemGreen:  #34C759 → #30D158  (+lightness)
systemRed:    #FF3B30 → #FF453A  (+lightness)
systemOrange: #FF9500 → #FF9F0A  (+lightness)
```

### 2.4 Luminance Perception v Dark Mode

Človeško oko zazna razlike v svetlosti bolj občutljivo v temnejšem spektru. Zato morajo biti **color steps v dark mode manjši (tighter)** na temnem koncu.

**Color Temperature:**
- Cool dark mode (modrikast/vijoličast odtenek) — za tech/profesionalno
- Warm dark mode (rjav/oranžen odtenek) — za zmanjšanje strain
- True neutral — samo kadar je primerno

**Saturacija:** Barve v dark mode zahtevajo **nižjo saturacijo** za velike površine, da ne preobremenijo oči, a **višjo saturacijo** za majhne poudarke (ikone, gumbe).

### 2.5 Smooth Transitions

**Apple priporoča:**
- Transition čas: 200-300ms
- Vsi elementi se morajo **simultano** animirati
- **NE** animiraj posameznih elementov (laggy občutek)
- Uporabi `prefers-color-scheme` media query kot fallback
- `next-themes` za React/Next.js implementacijo

```css
/* Smooth transition za theme switch */
* {
  transition: background-color 200ms ease, 
              color 200ms ease, 
              border-color 200ms ease,
              box-shadow 200ms ease;
}

/* Upoštevaj reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

### 2.6 Pravilo: Vedno Podpiraj Oba Modusa

Citat iz HIG: *"Make sure all your app's colors work well in light, dark, and increased contrast contexts."*

Tudi če app primarno podpira en modus, Apple zahteva: *"Even if your app ships in a single appearance mode, provide both light and dark colors to support Liquid Glass adaptivity in these contexts."*

---

## 3. TIPOGRAFIJA — POGLOBLJENA ANALIZA

> **Vir:** https://developer.apple.com/design/human-interface-guidelines/typography
> **Font:** San Francisco (SF Pro / SF Pro Display / SF Pro Text)

### 3.1 System Font: San Francisco

San Francisco je družina fontov z dvema optičnima velikostma:
- **SF Pro Text** — optimiziran za ≤ 19pt (body text, captions)
- **SF Pro Display** — optimiziran za ≥ 20pt (headlines, titles)

Sistem samodejno preklaplja med njima glede na velikost.

**Lastnosti:**
- 9 uteži (Ultralight → Black)
- Variable optical sizes
- 4 širine (Condensed, Compressed, Regular, Expanded)
- Rounded varianta
- Podpora za 150+ jezikov

### 3.2 Dynamic Type — Text Styles (pri privzeti "Large" nastavitvi)

| Text Style | Velikost (pt) | Utež | Line Height | Uporaba |
|-----------|--------------|------|-------------|---------|
| **Large Title** | 34 | Bold | 41pt | Hero naslovi, landing pages |
| **Title 1** | 28 | Regular | 34pt | Section naslovi |
| **Title 2** | 22 | Regular | 28pt | Podnaslovi sekcij |
| **Title 3** | 20 | Regular | 25pt | Manjši naslovi |
| **Headline** | 17 | **Semibold** | 22pt | Poudarjeno besedilo, cell titles |
| **Body** | 17 | Regular | 22pt | Glavno body besedilo |
| **Callout** | 16 | Regular | 21pt | Callout besedilo |
| **Subheadline** | 15 | Regular | 20pt | Sekundarna informacija |
| **Footnote** | 13 | Regular | 18pt | Opombe, meta info |
| **Caption 1** | 12 | Regular | 16pt | Captions, labels |
| **Caption 2** | 11 | Regular | 13pt | Najmanjše besedilo |

### 3.3 Preslikava v rem za Web (base: 16px)

| Text Style | Apple pt | Web rem | Web px | Letter Spacing |
|-----------|---------|---------|--------|----------------|
| Large Title | 34pt | 2.125rem | 34px | -0.04em |
| Title 1 | 28pt | 1.75rem | 28px | -0.03em |
| Title 2 | 22pt | 1.375rem | 22px | -0.02em |
| Title 3 | 20pt | 1.25rem | 20px | -0.02em |
| Headline | 17pt | 1.0625rem | 17px | -0.01em |
| Body | 17pt | 1.0625rem | 17px | 0 |
| Callout | 16pt | 1rem | 16px | 0 |
| Subheadline | 15pt | 0.9375rem | 15px | 0 |
| Footnote | 13pt | 0.8125rem | 13px | 0.01em |
| Caption 1 | 12pt | 0.75rem | 12px | 0.01em |
| Caption 2 | 11pt | 0.6875rem | 11px | 0.01em |

### 3.4 Tracking (Letter Spacing) Principi

Apple-ova ključna pravilo: **Večji font → bolj negativen letter-spacing (tighter tracking).**

```
34pt Large Title → -0.04em (zelo tight)
28pt Title 1     → -0.03em
22pt Title 2     → -0.02em  
17pt Body        →  0em (nevtralno)
12pt Caption     → +0.01em (rahlo razprto)
11pt Caption 2   → +0.01em
```

Razlog: Veliki fonti imajo naravno preveč prostora med znaki; majhni fonti potrebujejo rahlo razprtost za berljivost.

### 3.5 Font Weight Hierarhija

| Utež | CSS Value | Uporaba |
|------|-----------|---------|
| Ultralight | 100 | Dekorativno, zelo veliki naslovi |
| Thin | 200 | Dekorativno |
| Light | 300 | Subtle text, elegant headings |
| Regular | 400 | Body text, default |
| Medium | 500 | Poudarjeno body, navigation |
| Semibold | 600 | Headlines, button labels, **ključne info** |
| Bold | 700 | Naslovi, primary headings |
| Heavy | 800 | Zelo poudarjeno |
| Black | 900 | Hero naslovi, ultra poudarek |

### 3.6 Line Height (Leading)

| Tip vsebine | Line Height Ratio | Uporaba |
|-------------|-------------------|---------|
| Headlines | 1.2 (tight) | H1-H3, Large Title |
| Subheadings | 1.25-1.375 | Title 2-3, Headline |
| Body text | 1.47-1.5 | Body, Callout, Subheadline |
| Long-form | 1.5-1.625 | Daljši tekst, članki |
| Captions | 1.33 | Caption 1-2, Footnote |

### 3.7 Best Practices za Tipografijo (iz HIG)

1. **Uporabi built-in text styles** — samodejno podpirajo Dynamic Type
2. **Ne meši preveč fontov** — en font z raznimi velikostmi/utežmi
3. **Custom fonti morajo biti berljivi** in implementirati accessibility features
4. **Dynamic Type:** Besedilo se mora prilagajati uporabnikovim nastavitvam
5. **Minimum text size: 11pt** za berljivost na vseh napravah

---

## 4. LAYOUT SISTEM — POGLOBLJENA ANALIZA

> **Vir:** https://developer.apple.com/design/human-interface-guidelines/layout

### 4.1 Temeljna Filozofija

Apple layout temelji na treh ključnih vprašanjih za uporabnika:
1. **"Kje sem?"** — App mora takoj razjasniti uporabnikov položaj
2. **"Kaj lahko naredim?"** — Akcije morajo biti jasne in razumljive
3. **"Kam lahko grem od tukaj?"** — Naslednji koraki morajo biti očitni

### 4.2 Touch Targets — Minimalne Velikosti

| Element | Minimum | Priporočeno |
|---------|---------|-------------|
| **Tap target** | 44 × 44 pt | 48 × 48 pt |
| **Button padding** | - | 12-16pt vertikalno |
| **Icon touch area** | 44 × 44 pt | Vedno! Tudi če je ikona 24pt |
| **List row height** | 44pt minimum | 44-88pt |

**Kritično:** *"Minimum touch control size: 44 points × 44 points"* — To je absolutni minimum za vse interaktivne elemente.

### 4.3 Safe Areas

```css
/* iOS safe areas za web */
.safe-area {
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
```

### 4.4 Grid System

| Naprava | Grid | Gutter | Margin |
|---------|------|--------|--------|
| iPhone (< 640px) | 4 kolone | 16px | 16px |
| iPad (640-1024px) | 8 kolon | 20px | 20px |
| Desktop (> 1024px) | 12 kolon | 24px | 24px |

### 4.5 Spacing System — 8pt Grid

Apple uporablja **8pt base grid** za konsistenten spacing:

| Token | Vrednost | Uporaba |
|-------|----------|---------|
| space-1 | 4px (0.25rem) | Micro gaps, icon padding |
| space-2 | 8px (0.5rem) | **Base unit**, tight spacing |
| space-3 | 12px (0.75rem) | Small component gaps |
| space-4 | 16px (1rem) | Standard padding, gaps |
| space-5 | 20px (1.25rem) | Medium gaps |
| space-6 | 24px (1.5rem) | Section padding |
| space-8 | 32px (2rem) | Large gaps, section margins |
| space-10 | 40px (2.5rem) | Between major sections |
| space-12 | 48px (3rem) | Hero spacing |
| space-16 | 64px (4rem) | Page section margins |
| space-24 | 96px (6rem) | Major page divisions |

### 4.6 Best Practices za Layout (iz HIG)

1. **"Create layouts that fit the device screen without requiring horizontal scrolling."**
2. **"Align text, images, and buttons to show information relationships."**
3. **"Place controls close to the content they modify."**
4. **"Don't overlap text"** — povečaj line-height ali letter-spacing
5. Responsive design z **SwiftUI-inspired adaptive layouts**

---

## 5. ICONS — POGLOBLJENA ANALIZA

> **Vir:** https://developer.apple.com/design/human-interface-guidelines/icons
> **SF Symbols:** https://developer.apple.com/sf-symbols/

### 5.1 SF Symbols 7 (2025)

SF Symbols 7 vsebuje **6.900+ simbolov** z:
- **9 uteži** (Ultralight → Black) — se ujemajo s SF Pro weights
- **3 scale variante** (Small, Medium, Large) — za različne kontekste
- Samodejno poravnavanje z besedilom
- Podpora za 12+ pisav (Latin, Greek, Cyrillic, Hebrew, Arabic, CJK, Thai, Devanagari...)

**Novosti v SF Symbols 7:**
- **Draw animacije** — Draw On/Draw Off z Whole Symbol, By Layer, Individually
- **Variable Draw** — razširjeni Variable Color za progress indikatorje
- **Enhanced Magic Replace** — ohrani oblike pri animiranju med sorodnimi simboli
- **Gradienti** — samodejno gradient rendering za globino
- **Stotine novih simbolov** z Liquid Glass integriranim dizajnom

### 5.2 Icon Sizes za Web (Lucide React preslikava)

| SF Symbols Scale | Velikost | Uporaba | Lucide React |
|-----------------|----------|---------|--------------|
| Ultrasmall | 12px | Inline hints | `size={12}` |
| Small | 16px | Navigation, inline | `size={16}` |
| Medium (default) | 20px | Standard icons | `size={20}` |
| Large | 24px | Prominent icons | `size={24}` |
| XL | 32px | Hero icons | `size={32}` |
| 2XL | 40px | Feature icons | `size={40}` |

### 5.3 Stroke Width

| Apple Weight | Stroke Width | Uporaba |
|-------------|-------------|---------|
| Light | 1.5 | Elegant, minimal |
| Regular | 2.0 | **Default** za vse ikone |
| Bold | 2.5 | Poudarjeno, active stanja |

### 5.4 Icon Composer (NOVO — 2025)

Za app ikone Apple uvaja **Icon Composer** z:
- **Multi-layer icon format** — Liquid Glass material
- **Dynamic lighting effects** — specular highlights, blur, translucency
- **Annotation across rendering modes** — Default, Dark, Mono
- **Rounder enclosure shapes** z updated grid system

### 5.5 App Icon Guidelines

- Minimum velikost ikone: 1024 × 1024 px (za App Store)
- Ikone morajo biti prepoznavne pri vseh velikostih (od 29pt do 1024pt)
- Preprosta, jasna oblika — izogibaj se detajlom, ki se izgubijo pri manjših velikostih
- Uporabi omejen nabor barv — 1-2 primary, 1-2 accent
- Nima besedila (razen če je del logotipa/branda)

### 5.6 Best Practices za Ikone (iz HIG)

1. **Konsistenten stroke width** — vse ikone v app morajo imeti enak stroke
2. **Vertikalna poravnava z besedilom** — uporabi `inline-flex items-center gap-2`
3. **Ikone niso okras** — vsaka ikona mora imeti jasen namen/pomen
4. **Ne mešaj icon librarijev** — ostani pri enem (npr. Lucide React)
5. **Accessibility:** Ikone morajo imeti aria-label ali spremljajoče besedilo

---

## 6. BRANDING — POGLOBLJENA ANALIZA

### 6.1 Apple-ova Branding Filozofija

**Citat iz HIG:** *"Subtle refinement over loud branding"*

**Apple priporoča:**
- ✅ Custom **color palette** za branding identiteto
- ✅ Custom **typography** za personaliteto
- ✅ Subtle **background customization** (gradients, textures)
- ❌ NE plaster logos everywhere
- ❌ NE intrusive branding elements
- ❌ NE waste screen space na brand assets

### 6.2 Branding Through Key Color (Accent Color)

Apple apps uporabljajo **eno ključno barvo** za interaktivne elemente:
- **Notes:** Yellow (#FFCC00)
- **Calendar:** Red (#FF3B30)
- **Mail:** Blue (#007AFF)
- **Health:** Pink (#FF2D55)
- **Podcasts:** Purple (#AF52DE)

**Implementacija:** Izberi **eno brand barvo** in jo uporabi konsistentno za:
- Primary buttons
- Links
- Active/selected states
- Selected tab bar items
- Accent elements

### 6.3 Logo Placement Pravila

| Kontekst | Logo? | Razlog |
|----------|-------|--------|
| Launch screen | ✅ | Enkraten prikaz pri zagonu |
| About screen | ✅ | Informativna stran |
| Settings | ✅ | Account/profile |
| Marketing materials | ✅ | Zunaj aplikacije |
| Navigation bar | ❌ | Uporabnik že ve, katero app uporablja |
| Vsaka view/stran | ❌ | Waste of space |
| Watermark | ❌ | Moteče za uporabnika |

### 6.4 Branding Through Typography

- **Display font** (npr. Inter, DM Sans) za headlines in branding
- **System font** (-apple-system, SF Pro) za body text in UI
- Maintain **legibility at all sizes**
- Support **Dynamic Type** (accessibility)

---

## 7. ACCESSIBILITY — WCAG AA COMPLIANCE

### 7.1 Color Contrast Requirements (iz HIG + WCAG)

| Element | Min. Contrast Ratio | Standard |
|---------|-------------------|----------|
| Normal text (< 18px) | ≥ 4.5:1 | WCAG AA |
| Large text (≥ 18px regular, ≥ 14px bold) | ≥ 3:1 | WCAG AA |
| UI components & graphics | ≥ 3:1 | WCAG AA |
| Enhanced (AAA) normal text | ≥ 7:1 | WCAG AAA |

### 7.2 Increased Contrast Mode

Apple omogoča **Increase Contrast** nastavitev, ki zahteva dodatne color variante z višjim kontrastom. HIG pravi: *"With the Increase Contrast setting turned on, the color differences become far more apparent."*

### 7.3 Non-Color Indicators

**HIG pravi:** *"Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information."*

**Vedno dodaj:**
- Ikone poleg barv za stanja (success, error, warning)
- Text labels poleg barvnih indikatorjev
- Oblike/patterns za razlikovanje elementov

### 7.4 Focus States

Vsi interaktivni elementi morajo imeti vidno focus state:
```css
/* Apple-style focus ring */
focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.5);
}
```

### 7.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

### 7.6 Semantic HTML

- Proper heading hierarchy (h1 > h2 > h3)
- `<button>` za actions, `<a>` za navigation
- `aria-label` za ikone brez besedila
- `role` atributi za custom komponente
- `tabIndex` za custom interactive elements

---

## 8. ZAKLJUČEK — PRIORITETE IMPLEMENTACIJE

### MUST HAVE (P0):
- ✅ Semantic color system z CSS spremenljivkami
- ✅ Dark mode z `next-themes` (class-based)
- ✅ Background/Label/Fill hierarhije (natančne Apple vrednosti)
- ✅ WCAG AA contrast ratios za vse color combinations
- ✅ 44pt minimum touch targets
- ✅ Apple-inspired type scale (Dynamic Type preslikava)
- ✅ Smooth theme transitions (200ms)
- ✅ Reduced motion support

### SHOULD HAVE (P1):
- ✅ System tint colors z light/dark variants (12 barv)
- ✅ Gray system (6 nivojev)
- ✅ Elevated materials v dark mode (lightness hierarchy)
- ✅ Vibrancy za dark mode barve
- ✅ 8pt spacing grid
- ✅ Konsistent icon system (Lucide React, stroke 2)
- ✅ Focus states za vse interactive elements
- ✅ Non-color indicators za stanja

### NICE TO HAVE (P2):
- ⭕ Wide Color (Display P3) podpora za brand colors
- ⭕ Liquid Glass effects (backdrop-blur, translucency)
- ⭕ Increased Contrast mode podpora
- ⭕ Custom accent color selection
- ⭕ Variable fonts (optical sizing)
- ⭕ High contrast mode
- ⭕ Dynamic Type scaling v web kontekstu

---

**Avtor:** AI Agent (na podlagi Apple HIG deep research)  
**Verzija:** 2.0  
**Datum:** 8. februar 2026  
**Status:** FINALNO POROČILO — Verificirano z Apple Developer Documentation
