# PromptJo — Frozen Demo Source of Truth

## Purpose
This package is a clean, standalone snapshot of the CURRENT React Demo used as the
visual source of truth for PromptJo.

## Frozen approved UI
- Home
- Explore
- Single Prompt

These pages are the visual reference. Do not redesign or reinterpret them without
explicit approval.

## Critical architecture boundary
**The PromptJo WordPress Plugin is NOT part of this package.**
It was developed/tested in a separate environment and must remain separate.

**The WordPress Theme is NOT part of this package.**
Do not import or merge any WordPress theme files into this Demo source.

The Demo's WordPress-admin/QA React components are Demo tooling only; they are not
the PromptJo WordPress Plugin and do not constitute a Plugin dependency.

## Intentionally excluded
- promptjo-theme/
- promptjo-plugin/
- WordPress theme/plugin ZIPs
- old WordPress export utilities
- theme/plugin packaging generators
- node_modules
- secrets / .env files
- unrelated legacy assets

## Main source
- src/App.tsx
- src/components/
- src/data/
- src/types.ts
- src/index.css
- src/main.tsx

## Run
npm install
npm run dev

## Build
npm run build

## Rule for future work
Treat this repository/package as the frozen UI baseline.
New pages may be designed from this baseline, but approved Home / Explore / Single
Prompt UI must not be changed accidentally.

## WordPress conversion rule
When a WordPress Theme is eventually produced, it must consume the Plugin's public
data/contracts only. The Theme must contain **zero copies of Plugin implementation
files** and must not bundle the Plugin.
