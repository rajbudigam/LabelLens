# LabelLens — Ingredient Intelligence

Instant additive flags, allergen scan, and NOVA-style estimate from any ingredient list. Client-only Next.js application for analyzing food ingredients.

## Features

- **Additive Flagging**: Identifies potentially concerning additives with severity levels
- **Allergen Detection**: Scans for US Big-9 allergens including sesame
- **NOVA Classification**: Estimates ultra-processing level based on ingredient markers  
- **Jurisdiction Compliance**: Shows regulatory status across US, California AB418, and EU
- **PDF Export**: Generate printable analysis reports
- **Client-Side Only**: No backend required, works entirely in the browser

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Paste an ingredient list on the home page
2. Click "Analyze" to get instant results
3. View NOVA score, allergen warnings, and additive flags
4. Check jurisdiction compliance table
5. Export PDF report if needed

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling  
- **Client-side only** - no server required

## Deployment

This project is optimized for deployment on Vercel:

## Deployment

This project is optimized for deployment on Vercel:

```bash
pnpm build
```

The app will automatically deploy when pushed to the main branch.
