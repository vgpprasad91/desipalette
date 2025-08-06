# Overview

Desipalette is a modern e-commerce web application for cultural fashion and lifestyle products. Built as a full-stack application with React frontend and Express backend, it features product browsing, shopping cart functionality, and order management. The application showcases a curated collection of ethnic wear, contemporary fusion pieces, and cultural accessories with a focus on quality and heritage.

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
- **In-memory storage** (MemStorage class) as the primary data layer with seeded product data
- **Drizzle ORM** configured for PostgreSQL with schema definitions but currently unused
- RESTful API design with endpoints for products and orders
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
- **Radix UI** primitives for accessible component foundations
- **Lucide React** for consistent iconography
- **class-variance-authority** and **clsx** for dynamic CSS class management
- **date-fns** for date manipulation utilities
- **Embla Carousel** for product image galleries
- **Replit integration** tools for development environment support

## Key Features
- Product catalog with categories, search, and filtering
- Shopping cart with persistent state management
- Product detail views with image galleries and variant selection
- Checkout process with form validation
- Responsive design optimized for mobile and desktop
- Toast notifications for user feedback
- Modal dialogs for quick product views