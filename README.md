# AI Guides Website

A modern, elegant AI Guides website with a full admin dashboard for content management.

## Features

- 🎨 **Clean, Modern UI** - Beautiful design with Tailwind CSS
- 📝 **Guides & Blogs** - Separate sections for AI guides and blog posts
- 🔐 **Admin Dashboard** - Full CRUD operations for content management
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔍 **Search & Filter** - Find content easily by category or keyword
- ✨ **Markdown Support** - Rich content editing with markdown
- 🤖 **AI-Ready API** - RESTful API for AI integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Editor**: SimpleMDE Markdown Editor

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Initialize the database:
   ```bash
   npm run db:push
   ```

4. Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

Default admin credentials:
- **Email**: admin@aiguides.com
- **Password**: admin123

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (public)/        # Public pages
│   ├── admin/           # Admin dashboard
│   └── api/             # API routes
├── components/          # Reusable components
├── lib/                 # Utilities & database
└── types/               # TypeScript types
```

## API Endpoints

### Guides
- `GET /api/guides` - Get all guides
- `POST /api/guides` - Create a guide (auth required)
- `GET /api/guides/[id]` - Get single guide
- `PUT /api/guides/[id]` - Update guide (auth required)
- `DELETE /api/guides/[id]` - Delete guide (auth required)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create a blog (auth required)
- `GET /api/blogs/[id]` - Get single blog
- `PUT /api/blogs/[id]` - Update blog (auth required)
- `DELETE /api/blogs/[id]` - Delete blog (auth required)

### AI Integration
- `POST /api/ai/generate` - Generate content with AI

## License

MIT License
