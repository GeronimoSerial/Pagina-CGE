# AI Coding Assistant Instructions for Pagina-CGE

Whenever you want to ask a question, always call the MCP interactive_feedback.
Whenever you’re about to complete a user request, call the MCP interactive_feedback instead of simply ending the process. Keep calling MCP until the user’s feedback is empty, then end the request.

## Project Overview

This is the official web portal for the Consejo General de Educación (CGE) in Corrientes, Argentina. It's a Next.js application serving as a government education portal with content management via Directus CMS and an integrated attendance tracking system using Prisma.

## Architecture & Tech Stack

- **Framework**: Next.js 16 with App Router and Cache Components (migrating from ISR)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 with shadcn/ui components and custom design tokens
- **Content Management**: Directus CMS (accessed via direct fetch API, not SDK)
- **Database**: PostgreSQL with Prisma ORM (attendance tracking system with multiple schemas)
- **Authentication**: Better Auth
- **Package Manager**: pnpm
- **Development**: Turbopack enabled

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (main)/            # Public pages (home, news, procedures, etc.)
│   ├── (panel)/           # Authenticated dashboard pages
│   └── api/               # API routes (auth, content fetching)
├── features/              # Domain-specific modules
│   ├── [feature]/         # Each feature has components/, services/, hooks/
│   └── dashboard/         # Attendance tracking dashboard with charts
├── shared/                # Cross-cutting concerns
│   ├── components/        # Shared React components
│   ├── ui/               # shadcn/ui component library
│   ├── lib/              # Utilities (auth, config, safe-fetch, etc.)
│   ├── interfaces/       # TypeScript interfaces
│   └── styles/           # Global styles and design tokens
└── types/                # Additional type definitions
```

## Key Patterns & Conventions

### Data Fetching

- Use `safeFetchJson()` from `@/shared/lib/safe-fetch` for all external API calls
- Directus content fetched with `next: { tags: [...], revalidate: false }` for cache invalidation
- Cache Components mode: avoid `export const revalidate` (use `"use cache"` directive instead)
- Error handling: wrap fetches in try-catch, provide fallbacks

### Component Architecture

- Feature-based organization: domain logic in `src/features/[feature]/`
- Shared UI components in `src/shared/ui/` (shadcn/ui)
- Custom shared components in `src/shared/components/`
- Path aliases: `@/*` for src, `@dashboard/*` for dashboard features

### Styling

- Tailwind with custom spacing tokens (`section-sm`, `element-md`, etc.)
- Custom color palette including `institutional-green`
- Responsive design with `page-container` max-widths
- Use `cn()` utility for conditional classes

### Authentication & Security

- Better Auth for session management
- `getCachedSession()` for server components
- Protected routes in `(panel)` group

### Database & Attendance System

- Prisma with multiple schemas: `auth`, `huella` (attendance), `public`
- Extensive use of database views for attendance reports
- Argentina timezone handling (`getArgentinaDate()`)

### Content Management

- Directus API calls use Cloudflare Images for optimization (`cfImages()`)
- Content types: news, procedures, schools, institutional pages
- Markdown processing with gray-matter and remark

## Development Workflow

- `pnpm dev` (uses Turbopack)
- `pnpm build` for production builds
- `pnpm format` for Prettier formatting
- `pnpm lint` for ESLint checks

## Common Tasks

- **Adding new content pages**: Create in `src/app/(main)/[slug]/page.tsx`, fetch from Directus
- **Dashboard features**: Add to `src/features/dashboard/`, use Prisma views for data
- **New UI components**: Add to `src/shared/ui/` if reusable, else feature-specific
- **API routes**: Place in `src/app/api/`, use for server actions or external integrations

## Environment Variables

- `NEXT_PUBLIC_DIRECTUS_URL`: Directus CMS endpoint
- `NEXT_PUBLIC_SITE_URL`: Production site URL
- `DATABASE_URL`: PostgreSQL connection string

## Gotchas

- Always use absolute paths with aliases (never relative `../`)
- Directus fetches return `{ data: [...] }` structure
- Cache Components require stable data for prerendering (avoid `new Date()` before uncached requests)
- Attendance calculations use Argentina timezone (UTC-3)
- Images served via Cloudflare CDN with specific remote patterns</content>
  <parameter name="filePath">/home/gero/Documentos/GitHub/Pagina-CGE/.github/copilot-instructions.md
