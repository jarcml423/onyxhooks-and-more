# OnyxHooks & More™

An advanced AI-powered SaaS platform for coaches, course creators, and service providers to generate and optimize high-converting digital offers and marketing copy.

## Overview

**Tagline:** "Since there's more to fishing than just hooks."

OnyxHooks & More™ combines AI-powered offer generation, funnel analysis, ROI simulation, and a comprehensive referral system to help users create profitable digital products and marketing campaigns.

## Features

### Core Platform
- **AI Hook Generation**: GPT-4o powered marketing copy creation
- **Funnel Analysis**: Comprehensive offer optimization and critique
- **ROI Simulation**: Financial modeling and projections
- **Quiz Assessment**: Personalized tier recommendations
- **SwipeCopy Bank**: Monthly AI-generated template library
- **NOS 9-Second Challenge**: High-performance content creation timer

### Subscription Tiers
- **Free**: Basic access and quiz assessment
- **Starter ($47/month)**: 25 hooks/month + CSV export
- **Pro ($197/month)**: Unlimited hooks + AI Council + Analytics
- **Vault ($5,000/year)**: Everything + Monthly swipe copy + Exclusive intelligence

### Admin Features
- **Analytics Dashboard**: User insights and revenue tracking
- **Campaign Intelligence**: UTM tracking and attribution
- **Support System**: Integrated ticketing and email management
- **Security Monitoring**: Device fingerprinting and fraud prevention

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- shadcn/ui components built on Radix UI
- Tailwind CSS with custom design system
- TanStack Query for server state management
- Wouter for lightweight routing

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Firebase Authentication with Google OAuth
- Stripe integration for subscription management
- OpenAI GPT-4o for AI-powered content generation
- SendGrid for email services

### Infrastructure
- Node.js 20
- ESBuild for backend bundling
- Automated monthly content generation with node-cron
- Comprehensive API with RESTful endpoints

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Required API keys (see Environment Variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/onyxhooks-and-more.git
   cd onyxhooks-and-more
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the required environment variables (see Environment Variables section)

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://...

# Firebase Authentication
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# reCAPTCHA Security
VITE_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...

# Stripe Payment Processing
STRIPE_SECRET_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...
STRIPE_STARTER_PRICE_ID=...
STRIPE_PRO_PRICE_ID=...
STRIPE_VAULT_PRICE_ID=...

# AI & Email Services
OPENAI_API_KEY=...
SENDGRID_API_KEY=...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Deploy database schema
- `npm run check` - TypeScript type checking

## Project Structure

```
├── client/          # React frontend application
├── server/          # Express.js backend
├── shared/          # Common schemas and types
├── config/          # Configuration files
├── utils/           # Utility functions
└── tests/           # Test files
```

## Database Schema

The application uses a comprehensive PostgreSQL schema including:
- Users with authentication and subscription management
- Offers with AI-generated content and performance tracking
- Funnel reviews and AI-powered analysis
- ROI simulations and financial modeling
- Quiz results and tier recommendations
- Referral tracking and commission management
- Agency client management for multi-user accounts

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/verify-recaptcha` - reCAPTCHA verification

### Content Generation
- `POST /api/generate-hooks` - AI hook generation
- `POST /api/quiz/score` - Quiz scoring and recommendations
- `GET /api/swipe-copy` - Access SwipeCopy templates

### Admin & Analytics
- `GET /api/admin/marketing-insights` - Marketing analytics
- `GET /api/admin/campaigns` - Campaign performance data
- `POST /api/admin/support/tickets` - Support ticket management

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure all required environment variables
- Ensure database is accessible and schema is deployed

## Support

- **Email**: support@onyxnpearls.com
- **Website**: https://onyxnpearls.com
- **Company**: Onyx & Pearls Management, Inc.

## License

Copyright © 2025 Onyx & Pearls Management, Inc. All rights reserved.

---

**Built with ❤️ for creators, coaches, and entrepreneurs who deserve high-converting marketing copy.**