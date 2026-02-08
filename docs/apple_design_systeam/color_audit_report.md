# POROČILO: Revizija Barv v Projektu SetWise
## Color Audit — Analiza konsistentnosti

**Datum:** 8. februar 2026  
**Status:** KRITIČNO — Potrebne obsežne popravke  
**Obseg:** 35+ datotek pregledanih

---

## IZVRŠNI POVZETEK

Projekt ima **resne probleme s konsistentnostjo barv**:
- **7+ različnih odtenkov modre** se uporablja za brand/primary
- **3 različne gray palete** se mešajo (Tailwind `gray-*`, `neutral-*`, custom hex warm browns)
- **30+ hardcoded hex barv** raztresenih po komponentah
- Nobene barve niso definirane v globals.css kot CSS spremenljivke (razen shadcn oklch defaults)

---

## 1. BRAND/PRIMARY BLUE — STANJE

### Definirana brand barva: `#0063FF` / `rgb(0, 99, 255)`

### Trenutno uporabljene modre barve v projektu:

| Barva | Hex / Class | Kje se uporablja | Popravek |
|-------|-------------|-------------------|----------|
| `bg-[#0263ff]` | `#0263FF` | bento-grid-section (centralni krog) | Blizu! → `#0063FF` |
| `bg-[#1A62FF]` | `#1A62FF` | blue-cta-section, WhiteBtn (text + bg) | **NAROBE** → `#0063FF` |
| `bg-blue-500` | `#3B82F6` | hero gradient, cta-section, feature.tsx, feature2.tsx, your-work-in-sync | **NAROBE** → custom brand |
| `bg-blue-600` | `#2563EB` | navigation CTA, footer button, beta-signup, ButtonRotatingGradient | **NAROBE** → `#0063FF` |
| `bg-blue-700` | `#1D4ED8` | footer button hover | **NAROBE** → darker brand |
| `from-blue-500 to-blue-600` | gradient | page.tsx gradient text, split-blue, hero | **NAROBE** → brand gradient |
| `from-blue-600 to-blue-400` | gradient | bento-grid title gradient | **NAROBE** → brand gradient |
| `border-blue-500` | `#3B82F6` | bento-grid highlight, border-beam | **NAROBE** |
| `text-blue-500` | `#3B82F6` | FeaturesSection badges | **NAROBE** |
| `text-blue-600` | `#2563EB` | FeaturesSection, beta-signup selected | **NAROBE** |
| `bg-blue-50` | `#EFF6FF` | FeaturesSection, beta-signup | Svetel — ostane ali prilagodi |
| `bg-blue-100` | `#DBEAFE` | bento-grid icons, dashboard-preview | Svetel — ostane ali prilagodi |
| `#3B82F6` | hardcoded | smart-simple-brilliant SVG stroke/fill | **NAROBE** → `#0063FF` |
| `#4c75fc` / `#2a52d9` | hardcoded | ReviewCard gradient default | **NAROBE** → brand gradient |
| `#689efc` | hardcoded | hero shimmer color | **NAROBE** → lighter brand |
| `#3864f5` / `#2b7cff` | hardcoded | sparkles-text defaults | **NAROBE** → brand shades |
| `ring-blue-500/20` | | footer input focus, beta-signup | **NAROBE** → brand |

**Sklep:** Projekt uporablja **7+ različnih modrih odtenkov**. Noben ni `#0063FF`.

### Potrebna brand paleta (generirana iz #0063FF):

```
brand-50:  #E6F0FF   (lightest — backgrounds)
brand-100: #CCE0FF   (light backgrounds, hover states)
brand-200: #99C2FF   (borders, light accents)
brand-300: #66A3FF   (light interactive)
brand-400: #3385FF   (hover state)
brand-500: #0063FF   (PRIMARY — gumbi, linki, accent)   ← TO JE NAŠA BARVA
brand-600: #0052D6   (hover na primary)
brand-700: #0042AD   (active/pressed)
brand-800: #003285   (dark accent)
brand-900: #00215C   (darkest)
brand-950: #001133   (ultra dark)
```

---

## 2. GRAY/NEUTRAL BARVE — STANJE

### Definirano: Tailwind `neutral-*` (neutral-200, neutral-300...)

### Trenutno se mešajo TRI različne gray palete:

#### A) Tailwind `neutral-*` (PRAVILNO — to hočemo)

| Class | Hex | Kje se uporablja |
|-------|-----|------------------|
| `neutral-50` | `#fafafa` | navigation hover |
| `neutral-100` | `#f5f5f5` | navigation active, language switcher, theme toggler |
| `neutral-200` | `#e5e5e5` | navigation borders, hero shimmer, footer input border, beta-signup |
| `neutral-300` | `#d4d4d4` | bento-grid borders, smart-simple, your-work-in-sync |
| `neutral-400` | `#a3a3a3` | footer placeholder, beta-signup close icon, bento-grid icons |
| `neutral-500` | `#737373` | footer social icons, navigation hamburger, your-work-in-sync icons |
| `neutral-600` | `#525252` | beta-signup labels |
| `neutral-700` | `#404040` | footer text, smart-simple tooltip |
| `neutral-800` | `#262626` | navigation floating text, language switcher hover, smart-simple values |
| `neutral-900` | `#171717` | footer input text, beta-signup title, bento-grid name |

#### B) Tailwind `gray-*` (NAROBE — moramo zamenjati z `neutral-*`)

| Class | Hex | Kje se uporablja | Zamenjaj z |
|-------|-----|-------------------|-----------|
| `text-gray-400` | `#9ca3af` | bento-grid (chevron, labels), FeaturesSection votes | `text-neutral-400` |
| `text-gray-500` | `#6b7280` | bento-grid (description) | `text-neutral-500` |
| `text-gray-600` | `#4b5563` | hero description, hero reviews, shimmer button text, navigation link, lang switcher, theme toggler | `text-neutral-500` ali `text-neutral-600` |
| `text-gray-700` | `#374151` | hero social, navigation mobile, split-blue | `text-neutral-700` |
| `text-gray-900` | `#111827` | bento-grid (name, values) | `text-neutral-900` |
| `bg-gray-50` | `#f9fafb` | split-blue hover, FeaturesSection hover | `bg-neutral-50` |
| `bg-gray-100` | `#f3f4f6` | WhiteBtn hover, bento-grid badge, FeaturesSection hover | `bg-neutral-100` |
| `bg-gray-200` | `#e5e7eb` | hero avatars, ReviewCard stars empty | `bg-neutral-200` |
| `border-gray-100` | `#f3f4f6` | ReviewCard divider, FeaturesSection | `border-neutral-100` |
| `border-gray-200` | `#e5e7eb` | split-blue buttons, bento-grid badge | `border-neutral-200` |

**Skupaj: 15+ mest kjer se `gray-*` meša z `neutral-*`**

#### C) Custom Hex Warm Browns/Grays (POSEBNA PALETA — odločitev potrebna!)

Projekt ima **obsežno warm brown paleto** ki je zelo konsistentna sama s seboj:

| Hex | Uporaba | Pojavitve |
|-----|---------|-----------|
| `#F7F5F3` | **Glavni background** — page bg, gradients, masks | **10+ mest** |
| `#FBFAF9` | Off-white background (pricing, dashboard sidebar) | 4 mesta |
| `#F0EFEE` | Light warm (pricing dark card text) | 1 mesto |
| `#E0DEDB` | **Border barva** — feature-cards, pricing, dashboard | **8+ mest** |
| `#D2C6BF` | Light text na dark background (pricing) | 1 mesto |
| `#B2AEA9` | Muted text na dark bg (pricing) | 1 mesto |
| `#847971` | Muted label text (pricing) | 2 mesta |
| `#6B7280` | Mid gray (ReviewCard, pricing) — to je pravzaprav Tailwind gray-500 | 3 mesta |
| `#605A57` | **Body text** — descriptions, paragraphs | **15+ mest** |
| `#49423D` | **Section headings** — h2, h3 | **10+ mest** |
| `#37322F` | **Primary dark** — buttons, h1, navigation | **20+ mest** |
| `#322D2B` | Progress bar, dividers | 2 mesta |
| `#2A2520` | Hover state za #37322F | 2 mesta |
| `#1A1A1A` | Near-black text (navigation, hero h1) | 5 mest |
| `#1F2937` | ReviewCard name — to je Tailwind gray-800 | 1 mesto |
| `#5D4E37` | Numbers-that-speak bar chart | 11 mest |

---

## 3. OSTALE BARVE

### Emerald/Green (success stanja)
| Uporaba | Kje |
|---------|-----|
| `bg-emerald-100/50 border-emerald-200 text-emerald-600` | bento-grid — success badge |
| `bg-green-50 text-green-600` | FeaturesSection — upvote, status |
| `bg-green-100 text-green-700` | dashboard-preview — status |
| `bg-green-500` | dashboard-preview — online dot |
| `border-emerald-200/70 text-neutral-600` | your-work-in-sync — sync badge |

**Problem:** Mešanje `emerald-*` in `green-*` za success stanja.

### Red (error/destructive)
| Uporaba | Kje |
|---------|-----|
| `text-red-500 bg-red-50` | FeaturesSection — downvote |
| `oklch(0.577 0.245 27.325)` — destructive | globals.css |

### Yellow/Amber (rating, highlights)
| Barva | Kje |
|-------|-----|
| `#FFB800` | ReviewCard — star rating fill |
| `#FBBF24` | hero — star SVG fill (to je Tailwind amber-400!) |
| `#FFD700` / `#EAB308` | TestimonialsSection — sparkles |

**Problem:** 3 različne rumene za zvezde.

### Purple (dokumentacija, third-party branding)
| Barva | Kje |
|-------|-----|
| `bg-purple-50 to-purple-100` | documentation-section |
| `#9c40ff` | animated-beam default |
| `#5865F2` | effortless-integration — Discord |
| `#635BFF` | effortless-integration — Stripe |

---

## 4. GLOBALS.CSS — STANJE

Trenutno `globals.css` uporablja **shadcn/ui default oklch barve** ki so **čisto SIVE** (brez warm tone):

```css
--primary: oklch(0.205 0 0);      /* = #000000-ish — NAPAČNO, ni naša modra */
--secondary: oklch(0.97 0 0);      /* = svetlo siva */
--accent: oklch(0.97 0 0);         /* = enako kot secondary */
--background: oklch(1 0 0);        /* = #FFFFFF — ampak app dejansko uporablja #F7F5F3! */
```

**Problem:** CSS spremenljivke sploh ne reflektirajo dejanskega dizajna! `--primary` je črna, ne modra. `--background` je bela, ampak dejanski bg je `#F7F5F3`.

---

## 5. PRIORITETNI SEZNAM POPRAVKOV

### NUJNO (P0) — Moramo popraviti za konsistentnost:

#### 5.1 Definicija brand barve v globals.css
```
--brand: #0063FF
--brand-light: #3385FF (za hover/lighter kontekste)
--brand-dark: #0052D6 (za hover state)
```

#### 5.2 Zamenjava VSEH modrih z brand barvo

| Datoteka | Kaj zamenjati | S čim |
|----------|---------------|-------|
| `navigation.tsx` | `bg-blue-600` | `bg-[#0063FF]` ali `bg-brand` |
| `footer-section.tsx` | `bg-blue-600 hover:bg-blue-700`, `ring-blue-500`, `border-blue-500` | brand barve |
| `beta-signup-dialog.tsx` | `bg-blue-600`, `bg-blue-500`, `border-blue-500`, `bg-blue-50` | brand barve |
| `page.tsx` | `from-blue-500 to-blue-700`, `from-blue-500 to-blue-600` | brand gradient |
| `hero-section.tsx` | `from-blue-500/20`, `from-blue-500 to-blue-600` | brand gradient |
| `bento-grid-section.tsx` | `bg-[#0263ff]`, `from-blue-100/80`, `border-blue-500`, `from-blue-600 to-blue-400` | brand barve |
| `blue-cta-section.tsx` | `bg-[#1A62FF]` | `bg-[#0063FF]` |
| `split-blue-section.tsx` | `from-blue-500 to-blue-600` | brand gradient |
| `feature.tsx` | `bg-blue-500` | `bg-[#0063FF]` |
| `feature2.tsx` | `bg-blue-500` | `bg-[#0063FF]` |
| `cta-section.tsx` | `bg-blue-500/10` | `bg-[#0063FF]/10` |
| `smart-simple-brilliant.tsx` | `bg-blue-500`, `ring-blue-500`, `border-blue-500`, `#3B82F6` | brand barve |
| `WhiteBtn.tsx` | `text-[#1A62FF]` | `text-[#0063FF]` |
| `ButtonRotatingGradient.tsx` | `bg-blue-600` | `bg-[#0063FF]` |
| `FeaturesSection.tsx` | `border-blue-300 text-blue-500 bg-blue-50`, `text-blue-600` | brand barve |
| `documentation-section.tsx` | `from-blue-50 to-blue-100` | brand light barve |
| `dashboard-preview.tsx` | `bg-blue-100 text-blue-700` | brand light barve |
| `your-work-in-sync.tsx` | `from-blue-500`, `via-blue-500` | brand barve |
| `border-beam.tsx` | `border-blue-500/20` | brand barva |
| `ProfileCard.tsx` | `bg-blue-500/10`, `bg-blue-600/60` | brand barve |
| `ReviewCard.tsx` | `#4c75fc` / `#2a52d9` gradient default | brand gradient |
| `sparkles-text.tsx` | `#3864f5` / `#2b7cff` | brand barve |
| `DownloadButton.tsx` | — | Preveriti, ali mora biti brand |

#### 5.3 Zamenjava VSEH `gray-*` z `neutral-*`

| Datoteka | Kaj zamenjati |
|----------|---------------|
| `hero-section.tsx` | `text-gray-600` → `text-neutral-500`, `text-gray-700` → `text-neutral-700`, `bg-gray-200` → `bg-neutral-200` |
| `bento-grid-section.tsx` | `text-gray-400` → `text-neutral-400`, `text-gray-500` → `text-neutral-500`, `text-gray-900` → `text-neutral-900`, `bg-gray-100` → `bg-neutral-100`, `border-gray-200` → `border-neutral-200` |
| `split-blue-section.tsx` | `border-gray-200` → `border-neutral-200`, `bg-gray-50` → `bg-neutral-50` |
| `FeaturesSection.tsx` | `text-gray-400` → `text-neutral-400`, `border-gray-200` → `border-neutral-200`, `bg-gray-50` → `bg-neutral-50`, `bg-gray-100` → `bg-neutral-100`, `text-gray-600` → `text-neutral-600`, `hover:bg-gray-100` → `hover:bg-neutral-100` |
| `WhiteBtn.tsx` | `hover:bg-gray-100` → `hover:bg-neutral-100` |
| `ReviewCard.tsx` | `fill-gray-200 text-gray-200` → `fill-neutral-200 text-neutral-200`, `border-gray-100` → `border-neutral-100`, `bg-gray-100` → `bg-neutral-100` |
| `dashboard-preview.tsx` | `bg-gray-100 text-gray-700` → `bg-neutral-100 text-neutral-700` |

---

## 6. ODPRTA VPRAŠANJA — Odločitev potrebna

### 6.1 Warm Brown Paleta (#37322F, #49423D, #605A57, #F7F5F3)

Ta paleta je zelo konsistentna **sama s seboj** in daje app topel, premium občutek. Ampak je v konfliktu z `neutral-*` (ki je cool/pure gray).

**Opcije:**
- **A) Ohranimo warm paleto** in definiramo custom CSS spremenljivke (priporočeno — je unikaten branding)
- **B) Zamenjamo vse z neutral-*** (izgubimo topel občutek)
- **C) Hybrid** — warm za besedilo (#37322F, #605A57), neutral za borders in backgrounds

**Moje priporočilo: Opcija A** — Warm paleta je del branda. Definirajmo jo kot CSS spremenljivke:
```css
--text-primary: #37322F;     /* Naslovi, gumbi */
--text-secondary: #49423D;   /* Section headings */
--text-body: #605A57;         /* Body text, opisi */
--text-muted: #847971;        /* Muted labels */
--bg-warm: #F7F5F3;           /* Glavni background */
--bg-warm-light: #FBFAF9;     /* Svetlejši background */
--border-warm: #E0DEDB;       /* Borders */
```

In `neutral-*` uporabimo za **UI elemente** (gumbi hover, input borders, navigation).

### 6.2 Success barva — emerald ali green?

Trenutno se mešata. Predlagam: **green-**** za konsistentnost z Apple HIG.

### 6.3 Star Rating Yellow

3 različne rumene. Predlagam: **#FFB800** (najbolj konsistentna z obstoječim dizajnom).

---

## 7. STATISTIKA

| Kategorija | Število različnih barv | Cilj |
|-----------|----------------------|------|
| **Blue/Brand** | 7+ različnih | 1 brand + paleta |
| **Gray paleta** | 3 ločene (gray, neutral, warm) | 1 sistem (neutral + warm CSS vars) |
| **Hardcoded hex** | 30+ | 5-10 (samo za specifične branding elemente) |
| **Green/Success** | 2 (emerald + green) | 1 |
| **Yellow/Rating** | 3 | 1 |
| **Datoteke za popraviti** | ~25 | 0 |

---

## 8. NASLEDNJI KORAK

1. **Definiraj brand barvo v globals.css** — `#0063FF` kot `--brand`
2. **Definiraj warm paleto v globals.css** — custom CSS spremenljivke
3. **Batch zamenjava** vseh `blue-*` z brand barvo (25+ datotek)
4. **Batch zamenjava** vseh `gray-*` z `neutral-*` (7+ datotek)
5. **Poenotenje** success/rating barv
6. **Test** vseh komponent po zamenjavi

**Ocena dela:** ~2-3 ure za vse popravke.

---

**Avtor:** AI Agent  
**Datum:** 8. februar 2026
