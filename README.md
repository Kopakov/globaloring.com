# Globaloring.com

Modern e-commerce platform built with Next.js 14, Sanity CMS, and Supabase.

## Tech Stack

- **Frontend**: Next.js 14 (App Router, RSC, ISR)
- **CMS**: Sanity v3 Studio & Content Lake
- **Database & Auth**: Supabase (PostgreSQL)
- **Search**: Algolia
- **Styling**: Tailwind CSS & shadcn/ui
- **Payment Processing**: Stripe
- **Hosting**: Vercel
- **Language**: TypeScript (Strict Mode)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.x or later
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd globaloring.com
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ERP Integration
ERP_API_ENDPOINT=
ERP_API_KEY=
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and configurations
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles
│   └── sanity/             # Sanity configuration and schemas
├── public/                  # Static assets
├── sanity/                 # Sanity Studio
└── supabase/              # Supabase configurations and migrations
```

## Features

- Modern Jamstack architecture
- Server-side rendering and static generation
- Real-time inventory and pricing from ERP
- Advanced e-commerce functionality
- Account-specific pricing
- Saved carts
- Tax and shipping rules
- Blog and static pages
- Form handling
- Instant search with Algolia
- SEO optimization

## Development

- Run development server: `npm run dev`
- Build production: `npm run build`
- Start production server: `npm start`
- Run tests: `npm test`
- Run linting: `npm run lint`

## Deployment

The application is deployed on Vercel with the following configuration:

- Production Branch: `main`
- Preview Branches: `feature/*`, `dev`
- Environment Variables: Configured in Vercel dashboard

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For support, email [support@globaloring.com](mailto:support@globaloring.com)
