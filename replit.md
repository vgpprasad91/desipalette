# Overview

Desipalette is a modern e-commerce web application for cultural fashion and lifestyle products. Built as a full-stack application with React frontend and Express backend, it features product browsing, shopping cart functionality, and order management. The application is exclusively powered by Shopify's Storefront API for headless commerce, allowing complete product management through Shopify while maintaining a custom frontend experience. Shopify credentials are required for all functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for component-based UI development
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** with **shadcn/ui** component library for consistent design system
- **TanStack React Query** for server state management and API data fetching
- **React Hook Form** with Zod validation for form handling and validation
- **Context API** for cart state management across components
- **Vite** as the build tool and development server for fast compilation

## Backend Architecture
- **Express.js** server with TypeScript for REST API endpoints
- **Exclusive Shopify Storefront API integration** via @shopify/storefront-api-client for headless commerce
- **No fallback systems** - requires Shopify credentials for all operations
- **Drizzle ORM** configured for PostgreSQL with schema definitions but currently unused
- RESTful API design with endpoints for products, orders, and Shopify checkout
- Middleware for request logging and error handling

## Data Storage Solutions
- **Temporary in-memory storage** for development with pre-seeded product catalog
- **PostgreSQL database schema** defined via Drizzle ORM for production readiness
- **Neon Database** integration configured for cloud PostgreSQL deployment
- Product and order entities with proper relationships and validation schemas

## Authentication and Authorization
- Currently no authentication system implemented
- Order creation requires customer information but no user accounts
- Guest checkout flow for simplified user experience

## External Dependencies
- **@shopify/storefront-api-client** for Shopify integration and GraphQL queries
- **Radix UI** primitives for accessible component foundations
- **Lucide React** for consistent iconography
- **class-variance-authority** and **clsx** for dynamic CSS class management
- **date-fns** for date manipulation utilities
- **Embla Carousel** for product image galleries
- **Replit integration** tools for development environment support

## Key Features
- **Pure Shopify headless commerce integration** with no fallback systems
- Product catalog with categories, search, and filtering exclusively from Shopify
- Shopping cart with persistent state management
- Product detail views with image galleries and variant selection
- **Shopify-only checkout system** that redirects to Shopify's secure checkout
- Responsive design optimized for mobile and desktop
- **Clear error messaging** when Shopify credentials are not configured
- Toast notifications for user feedback
- Modal dialogs for quick product views