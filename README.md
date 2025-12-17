## Bhanana — Creating Safe Spaces Where Children Can Heal and Thrive

At Bhanana, we believe that every child deserves to grow up surrounded by joy, play, and love. These aren’t just luxuries—they’re essential to building a healthy, fulfilling childhood. Yet, many children, especially those facing trauma and adversity, miss out on these vital experiences. Together, we can change that.

### Mission
Inspired by and in loving memory of Sujan and Ambika Karki, we partner with communities—beginning in Nepal—to create vibrant, inclusive environments that nurture the physical, mental, and emotional well-being of every child. Our mission is both simple and powerful: to build safe spaces where children can play, explore, and thrive. These environments celebrate each child's individuality and promote personal growth, ensuring they feel seen, heard, and valued.

### Why It Matters
Children today face immense challenges—trauma, violence, and mental health struggles that can hinder their potential. Many lack safe, loving environments where they can simply be kids. By creating nurturing spaces, we foster joy, resilience, and confidence for the future.

Our approach is holistic. We combine play, including soccer (football), with mental health support: social-emotional and creative workshops, mindfulness activities, and mentorship alongside local communities. Programs are tailored to each child’s needs, building foundations of support that last a lifetime.

### Donation Impact
- $50: Resources for creative workshops, giving children a safe space to express their emotions through art and play.
- $100: Sports equipment that promotes physical activity and essential social skills like teamwork.
- $500: Training for community members to provide ongoing mental health support for children in need.
- $1000: Establishes safe zones for children affected by trauma, offering spaces for healing and growth.

### Success So Far
In our May pilot:
- 81% reported increased self-confidence
- 91% felt a strong sense of belonging as part of a team
- 96% expressed a deep desire to continue
- 77% of participants were girls, underscoring the importance of these spaces for young women

### How to Help
Every dollar directly changes a child’s life by providing safe spaces, vital emotional support, and tools to grow into healthy, empowered individuals. Your generosity creates a lasting impact—for today and generations to come. Join us.

## Tech stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- Experimental React Compiler enabled
- pnpm for package management
- `src/app` directory structure

## Local development
```bash
pnpm install
pnpm dev              # dev server on http://localhost:3001
```

## Scripts
- `pnpm dev` — run Next.js dev server on port 3001
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — lint with eslint

## Deployment
Target: Vercel. Ensure environment variables (Supabase, etc.) are set in Vercel project settings. Tailwind v4 is zero-config via PostCSS. React Compiler is enabled via `next.config.ts`.
