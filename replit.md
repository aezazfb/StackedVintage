# Overview

This is a full-stack e-commerce application for a vintage-style clothing store called "Stacked Vintage". The application is built with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM. It features a modern shopping experience with product browsing by categories, shopping cart functionality, user authentication, and an admin dashboard for managing products and orders.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses **React with TypeScript** and is built with **Vite** for fast development and building. The UI is constructed using **shadcn/ui components** built on top of **Radix UI primitives**, styled with **Tailwind CSS** using a custom design system with vintage-inspired colors and typography.

**State Management**: Uses **TanStack Query (React Query)** for server state management, caching, and synchronization. Local state is managed with React's built-in hooks.

**Routing**: Implements client-side routing using **wouter**, a lightweight React router. The app includes protected routes that require authentication and admin privileges.

**Component Structure**: 
- Layout components (Header, Footer) provide consistent navigation
- Page components handle routing and main content areas
- UI components from shadcn/ui provide consistent design patterns
- Admin components handle product and order management
- Shopping cart functionality uses localStorage for persistence

## Backend Architecture
The backend is built with **Express.js** using TypeScript and follows a RESTful API design pattern.

**Authentication**: Uses **Passport.js** with local strategy for username/password authentication. Passwords are hashed using Node.js crypto scrypt function. Sessions are managed with **express-session** and stored in PostgreSQL using **connect-pg-simple**.

**File Handling**: Uses **Multer** for image upload handling, storing product images in a local uploads directory.

**API Structure**: RESTful endpoints for:
- Authentication (login, logout, register)
- Products (CRUD operations with image uploads)
- Categories (read operations)
- Orders (create, read, update status)
- Order items (create, read)

**Middleware**: Includes authentication middleware for protected routes and admin-only routes.

## Database Architecture
Uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database interactions and migrations.

**Schema Design**:
- `users` table with authentication and admin role support
- `categories` table for product organization with slugs for SEO
- `products` table with pricing, inventory, and image URL storage
- `orders` table for order management with status tracking
- `orderItems` table for order line items with quantity and pricing
- Session storage table managed by connect-pg-simple

**Database Connection**: Uses **@neondatabase/serverless** for Neon database connectivity with WebSocket support for serverless environments.

## External Dependencies

**Database**: 
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle Kit** - Database migrations and schema management

**UI Framework**:
- **shadcn/ui** - Component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives

**Development Tools**:
- **Vite** - Build tool and development server
- **TypeScript** - Type safety across the application
- **ESBuild** - Fast JavaScript bundling for production

**Authentication & Security**:
- **Passport.js** - Authentication middleware
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

**File Processing**:
- **Multer** - File upload handling for product images

**HTTP Client**:
- **TanStack Query** - Server state management and caching
- **Fetch API** - HTTP requests with credentials for authentication

**Development Environment**:
- **Replit plugins** - Development banner, error overlay, and cartographer for Replit integration