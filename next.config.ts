import type { NextConfig } from "next";

/**
 * Redirects 301 — URLs antigas que ainda ranqueiam no Google.
 * Cada uma dessas URLs aparece nas top impressões do Search Console mas
 * dava 404. 301 → captura cliques + transfere link juice.
 */
const LEGACY_REDIRECTS = [
  // Calculator slug renames
  { source: "/calculator/target-roas-calculator", destination: "/calculator/roas-calculator" },
  { source: "/calculator/ltv-cac-calculator",     destination: "/calculator/ltv-cac-ratio-calculator" },

  // Credit score: old "{score}-credit-score" → new "credit-score-{score}"
  { source: "/credit/680-credit-score",            destination: "/credit/credit-score-680" },
  { source: "/credit/is-680-a-good-credit-score",  destination: "/credit/credit-score-680" },
  // Cover the whole 500-850 range pre-emptively
  ...Array.from({ length: 36 }, (_, i) => {
    const score = 500 + i * 10;
    return [
      { source: `/credit/${score}-credit-score`,           destination: `/credit/credit-score-${score}` },
      { source: `/credit/is-${score}-a-good-credit-score`, destination: `/credit/credit-score-${score}` },
    ];
  }).flat(),

  // Tax: old descriptive slugs → new structured slugs
  { source: "/tax/2025-federal-income-tax-brackets-single-filer",          destination: "/tax/tax-brackets-2025" },
  { source: "/tax/2025-federal-income-tax-brackets",                       destination: "/tax/tax-brackets-2025" },
  { source: "/tax/federal-income-tax-brackets-2025",                       destination: "/tax/tax-brackets-2025" },
  { source: "/tax/federal-tax-brackets-2025-single",                       destination: "/tax/tax-brackets-2025" },
  { source: "/tax/federal-tax-brackets-2025-married",                      destination: "/tax/tax-brackets-2025" },
  { source: "/tax/2025-standard-deduction",                                destination: "/tax/standard-deduction-2025" },
  { source: "/tax/capital-gains-tax-rates-2025",                           destination: "/tax/capital-gains-rates-2025" },

  // Career: page exists only as "{profession}-skills" today — redirect bare names
  { source: "/career/accountant",  destination: "/career/accountant-skills" },
  { source: "/career/engineer",    destination: "/career/engineer-skills" },
  { source: "/career/developer",   destination: "/career/developer-skills" },
  { source: "/career/nurse",       destination: "/career/nurse-skills" },
  { source: "/career/teacher",     destination: "/career/teacher-skills" },
  { source: "/career/manager",     destination: "/career/manager-skills" },

  // Salary natural-language slugs → section home (lets user pick state)
  { source: "/salary/30k-a-year-after-taxes",   destination: "/salary" },
  { source: "/salary/40k-a-year-after-taxes",   destination: "/salary" },
  { source: "/salary/50k-a-year-after-taxes",   destination: "/salary" },
  { source: "/salary/60k-a-year-after-taxes",   destination: "/salary" },
  { source: "/salary/75k-a-year-after-taxes",   destination: "/salary" },
  { source: "/salary/100k-a-year-after-taxes",  destination: "/salary" },
  { source: "/salary/125k-a-year-after-taxes",  destination: "/salary" },
  { source: "/salary/150k-a-year-after-taxes",  destination: "/salary" },
  { source: "/salary/200k-a-year-after-taxes",  destination: "/salary" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_REDIRECTS.map(r => ({
      ...r,
      permanent: true,
    }));
  },
};

export default nextConfig;
