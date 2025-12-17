# AI Guides Website - Copilot Instructions

## Project Overview
This is a modern AI Guides website built with Next.js 14, featuring:
- Clean, responsive UI with Tailwind CSS
- Admin dashboard for content management
- SQLite database with Prisma ORM
- Authentication via NextAuth.js
- Markdown content editing
- AI content generation capabilities

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma
- **Auth**: NextAuth.js with credentials
- **Editor**: SimpleMDE

## Project Structure
```
src/
├── app/
│   ├── (public)/       # Public pages (home, guides, blog, search)
│   ├── admin/          # Admin dashboard
│   └── api/            # API routes
├── components/         # Reusable UI components
├── lib/                # Utilities (prisma, auth, utils)
└── types/              # TypeScript type definitions
```

## Key Files
- `prisma/schema.prisma` - Database schema
- `src/lib/auth.ts` - Authentication configuration
- `src/lib/prisma.ts` - Prisma client singleton
- `src/app/api/` - REST API endpoints

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data

## Admin Credentials
- Email: admin@aiguides.com
- Password: admin123

## API Endpoints
- `/api/guides` - CRUD for guides
- `/api/blogs` - CRUD for blog posts
- `/api/categories` - CRUD for categories
- `/api/ai/generate` - AI content generation

## Coding Guidelines
- Use TypeScript for all files
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement server components by default
- Use 'use client' only when necessary
- Handle errors gracefully
- Keep components small and focused
