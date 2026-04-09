# Calchive — English Calculator & Tools Site (Ads-Focused)

> Always respond in **Portuguese (pt-BR)** in this project.

---

## Project Overview

**Calchive** is an English-language Next.js site targeting the US/UK/CA/AU markets.
Monetization via **Google AdSense** — all content and page volume decisions prioritize high-CPC keywords.

- **Folder**: `c:\Users\Notebook\Downloads\projeto clodcode\calchive`
- **package.json name**: `calchive`
- **Stack**: Next.js 16.2.3 App Router + TypeScript (no Tailwind — inline CSS)
- **Deploy**: Vercel via GitHub (repo TBD)
- **Domain**: TBD

---

## Architecture — ISR Pattern (Vercel Free Tier)

```ts
// ALWAYS use this pattern in dynamic pages:
export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return ITEMS.slice(0, 80).map(item => ({ slug: item.slug }))
}

// ALWAYS await params:
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**Why**: Vercel free tier has 80MB build limit. ISR generates only 80 at build, rest on-demand.

---

## Design System

```css
--bg: #0a0f1e
--bg2: #0f1629
--card: #141d35
--text: #e8edf8
--muted: #7a8cad
--dim: #4a5568
--line: rgba(255,255,255,0.07)
--green: #10b981
--brand: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)
--accent: #3b82f6
Font: 'Inter', system-ui, sans-serif
Border radius: 12px (buttons), 16px (cards), 20px (large cards)
```

---

## Page Volume — Target 20,000 pages

| Section | Route | Pages | CPC |
|---|---|---|---|
| Calculators | `/calculator/[slug]` | ~1,000 | High |
| Tools | `/tool/[slug]` | ~1,000 | High |
| Salary after tax | `/salary/[state]/[amount]` | ~2,500 | Very High |
| Federal/State Tax | `/tax/[filing]/[income]` | ~1,500 | Very High |
| Mortgage | `/mortgage/[state]/[amount]` | ~1,000 | Very High |
| Loans | `/loan/[type]/[amount]` | ~800 | High |
| Health | `/health/[slug]` | ~500 | High |
| Careers | `/career/[profession]` | ~2,000 | Medium |
| Credit | `/credit/[slug]` | ~500 | Very High |
| Insurance | `/insurance/[state]/[type]` | ~800 | Very High |
| Legal | `/legal/[state]/[topic]` | ~1,000 | Very High |
| Guides | `/guide/[slug]` | ~2,000 | Medium |

---

## Content Rules — Anti-AI Detection

1. NO AI filler phrases: never "It's important to note", "It's worth mentioning", "In conclusion"
2. Real data only: actual US state tax rates, real federal brackets, BLS salary data
3. Journalistic tone: direct, factual — not explanatory or generic
4. Every content page MUST link to at least 2 relevant calculators or tools
5. No duplicate phrasing across pages — vary sentence structures in templates
6. Numbers anchor content: "$X per year", "Y% effective rate", "Z states require..."

---

## CalcConfig Type

```ts
export interface CalcField {
  k: string; l: string; t?: 'num'|'sel'|'pct'
  p?: string; min?: number; max?: number
  op?: [string, string][]; u?: string
}
export interface CalcResult {
  primary: { value: number|string; label: string; fmt?: 'usd'|'num'|'pct'|'txt' }
  details?: { l: string; v: number|string; fmt?: string; color?: string }[]
  note?: string
}
export interface CalcConfig {
  slug: string; title: string; desc: string; cat: string; icon: string
  fields: CalcField[]
  fn: (v: Record<string, number>) => CalcResult
  about?: string
  related?: string[]
}
```

---

## File Structure

```
calchive/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   ├── calculator/[slug]/page.tsx
│   ├── tool/[slug]/page.tsx
│   ├── salary/[state]/[amount]/page.tsx
│   ├── tax/[filing]/[income]/page.tsx
│   ├── mortgage/[state]/[amount]/page.tsx
│   ├── loan/[type]/[amount]/page.tsx
│   ├── health/[slug]/page.tsx
│   ├── career/[profession]/page.tsx
│   └── guide/[slug]/page.tsx
├── lib/
│   ├── calculators/ (types.ts, index.ts, calcs-*.ts)
│   ├── salary/ (states.ts, professions.ts, generator.ts)
│   ├── tax/ ── mortgage/ ── loan/ ── health/ ── career/ ── guide/
└── components/
    ├── CalcEngine.tsx
    ├── AdSlot.tsx
    ├── Header.tsx
    ├── Footer.tsx
    └── RelatedLinks.tsx
```

---

## Git

```bash
cd "c:\Users\Notebook\Downloads\projeto clodcode\calchive"
git add . && git commit -m "msg" && git push
```
