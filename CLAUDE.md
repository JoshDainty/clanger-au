# CLANGER.AU — Project Configuration
## Identity
- **Project:** Clanger.au — Premium Fantasy Sports Contest Platform
- **Sport:** NBA (primary, with architecture ready for expansion)
- **Country:** Australia
- **Model:** Paid-entry fantasy contests with prize pools. Users enter contests, contribute
## Critical Rules
1. Always invoke the frontend-design skill before writing any frontend code. Every session.
2. Dark mode is the ONLY theme. Never build light mode.
3. Mobile-first responsive design on every single component.
4. Use the screenshot workflow (Puppeteer) after building every major section to self-review
5. Never use generic AI fonts (Inter, Roboto, Arial). Use distinctive typography: **Satoshi*
6. Never use purple gradients on white backgrounds. This is a dark sports-tech aesthetic.
7. Every interactive element must have hover, focus, active, and disabled states.
8. Use skeleton loading states, not spinners.
9. All empty states must have helpful messaging and illustration.
10. Toast notifications for user actions.
## Brand Identity
- **Name:** Clanger.au
- **Tagline:** "Your Court. Your Call."
- **Primary Background:** #0A0E1A (deep navy-black)
- **Secondary Background:** #111827 (dark charcoal)
- **Card Background:** #1A1F2E (elevated dark)
- **Primary Accent:** #3B82F6 (electric blue)
- **Secondary Accent:** #60A5FA (lighter blue)
- **Success/Win:** #10B981 (green)
- **Danger/Loss:** #EF4444 (red)
- **Warning:** #F59E0B (amber)
- **Text Primary:** #F9FAFB (near-white)
- **Text Secondary:** #9CA3AF (muted gray)
- **Text Tertiary:** #6B7280 (darker gray)
- **Border:** #1F2937 (subtle dark border)
- **Gradient Accent:** linear-gradient(135deg, #3B82F6, #8B5CF6) — use sparingly for premium
- **Card Style:** Rounded-xl, subtle border (#1F2937), slight backdrop-blur on elevated surf
- **Spacing Rhythm:** 4px base, use multiples (8, 12, 16, 24, 32, 48, 64)
- **Border Radius:** rounded-lg (8px) for buttons/inputs, rounded-xl (12px) for cards, round
## Logo
- The Clanger.au logo will be placed in `/brand_assets/logo.svg` (or .png)
- If no logo exists yet, use the text "CLANGER" in Satoshi Bold with the primary accent colo
## Tech Stack
- Pure HTML5 + CSS3 + Vanilla JavaScript (for landing page and marketing)
- For the app: React + TypeScript + Tailwind CSS (via Vite)
- Supabase for backend (auth, database, realtime, edge functions)
- Vercel for hosting
- GitHub for version control
## Screenshot Workflow
After building any major section or page:
1. Start the local dev server
2. Use Puppeteer to take screenshots at 3 viewports: mobile (375px), tablet (768px), desktop
4
3. Save to `temporary_screenshots/` folder with descriptive names like `hero-desktop.png`,
4. Review each screenshot visually
5. Fix any issues found (spacing, overflow, text readability, color contrast, alignment)
6. Take new screenshots to confirm fixes
7. Minimum 2 review passes per major section
8. For animated elements: DO NOT use screenshots to evaluate. Instead, just build and let me
## File Structure
clanger-au/ ￿￿￿ CLAUDE.md ￿￿￿ brand_assets/ ￿ ￿￿￿ logo.svg ￿ ￿￿￿ brand-
guidelines.md ￿ ￿￿￿ inspiration/ # Reference screenshots go here ￿￿￿ public/ ￿ ￿￿￿
index.html # Landing page ￿ ￿￿￿ css/ ￿ ￿￿￿ js/ ￿ ￿￿￿ assets/ ￿￿￿ src/ # React app
(Phase 3+) ￿ ￿￿￿ components/ ￿ ￿￿￿ pages/ ￿ ￿￿￿ hooks/ ￿ ￿￿￿ lib/ ￿ ￿￿￿ types/ ￿ ￿￿￿
styles/ ￿￿￿ temporary_screenshots/ ￿￿￿ package.json
## Deployment Pipeline
- All development happens on localhost first
- NEVER push to GitHub without my explicit permission
- When I say "push to GitHub," commit all changes and push
- Vercel auto-deploys from GitHub (already configured)
- Always test on localhost before pushing
## Content Tone
- Confident, not arrogant
- Sports-native language (not corporate/SaaS speak)
- Action-oriented CTAs ("Draft Your Squad", "Enter the Contest", "Watch Live")
- Competitive but friendly
- Clear explanation of skill-based contest format
