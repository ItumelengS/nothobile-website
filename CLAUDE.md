# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js 15 e-commerce website for Nothobile, specializing in traditional South African medicine products. The application uses:

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom component library (shadcn/ui components)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **State Management**: React Context API for cart and authentication
- **Deployment**: Optimized for Vercel deployment

### Key Architectural Decisions

1. **App Router Structure**: Uses Next.js 15 App Router with the following routes:
   - `/` - Homepage with section cards (Human/Animal wellness)
   - `/products` - Product listing page
   - `/products/[id]` - Individual product details
   - `/cart` - Shopping cart page
   - `/admin/dashboard` - Admin management interface
   - `/owner/dashboard` - Owner management interface

2. **Database Design**: 
   - Session-based cart storage (no auth required for shopping)
   - Products categorized by section: 'wellness' (human) or 'animal'
   - Price change request workflow for admin/owner approval
   - Order management system ready for checkout implementation

3. **Mobile-First Design**: Optimized for 90%+ mobile users with ultra-compact layouts

## Environment Configuration

Required environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Schema

The application uses the following main tables:
- `products` - Product catalog with traditional names and descriptions
- `cart_items` - Session-based cart storage (works without authentication)
- `orders` & `order_items` - Order management system
- `user_profiles` - Extended user data with roles (customer/admin/owner)
- `price_change_requests` - Admin workflow for price modifications

All tables have Row Level Security (RLS) enabled. See `database/schema.sql` for complete schema.

## API Routes

API routes are located in `src/app/api/`:
- `/api/products` - Product CRUD operations
- `/api/cart` - Cart management (add, update, remove items)
- `/api/orders` - Order processing (ready for payment integration)

## Component Structure

Key components in `src/components/`:
- `Header.tsx` - Navigation with cart button
- `SectionCard.tsx` - Homepage section cards (Human/Animal wellness)
- `ProductCard.tsx` - Product display cards
- `Cart.tsx` & `CartButton.tsx` - Cart functionality
- `ui/` - Reusable UI components (buttons, cards, etc.)

## Context Providers

Located in `src/context/` and `src/contexts/`:
- `CartContext.tsx` - Global cart state management
- `AuthContext.tsx` - Authentication state (ready for Supabase Auth)
- `AdminContext.tsx` - Admin-specific state management

## Path Aliases

The project uses `@/*` path alias for imports, which maps to `./src/*`. Example:
```typescript
import { supabase } from '@/lib/supabase'
```

## Development Tips

1. The codebase follows a mobile-first approach - test all changes on mobile viewports
2. Cart functionality uses localStorage as fallback for offline/error scenarios
3. All Supabase queries should handle errors gracefully
4. Product images are currently placeholder - image_url field ready for real images
5. The deployment guide in `DEPLOYMENT.md` contains production setup instructions