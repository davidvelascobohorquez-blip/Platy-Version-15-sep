# platy — Menús inteligentes, ahorro real

Next.js (App Router) + Tailwind + OpenAI + Stripe + @react-pdf/renderer.

## Variables de entorno (Vercel → Settings → Environment Variables)
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID` (one-time USD 9.99)
- `NEXT_PUBLIC_DOMAIN=platty-pro.vercel.app` (o tu dominio)
- `PLATY_TRIALS_FREE=3`

## Scripts
```bash
npm i
npm run dev
```

## Flujo
- **Landing** `/` (ES/EN, moneda local visual)
- **Demo** `/demo` (3 intentos gratis → Stripe)
- **PDF** con @react-pdf/renderer (`components/PlanPDF.tsx`)
- **Stripe** `/api/stripe/checkout` + `/success` + `/api/stripe/verify`
- **Legales** `/terms`, `/privacy`
