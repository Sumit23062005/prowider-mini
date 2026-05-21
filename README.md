# Database Schema

### 1. Leads
- **Purpose:** Stores customer lead information.
- **Important fields:**
	- `name`, `phone`, `city`, `serviceId`, `description`, `createdAt`
	- Unique on `phone` + `serviceId` (prevents duplicate leads)
- **Relationships:**
	- `serviceId` references a Service
	- Linked to LeadAssignments

### 2. Providers
- **Purpose:** Stores provider details and quota usage.
- **Important fields:**
	- `name`, `monthlyQuota`, `usedQuota`, `createdAt`
- **Relationships:**
	- Linked to LeadAssignments

### 3. LeadAssignments
- **Purpose:** Tracks which providers are assigned to which leads.
- **Important fields:**
	- `leadId`, `providerId`, `assignedAt`
	- Unique on `leadId` + `providerId`
- **Relationships:**
	- `leadId` references a Lead
	- `providerId` references a Provider

### 4. AllocationState
- **Purpose:** Maintains round robin index for each service.
- **Important fields:**
	- `serviceName`, `currentIndex`
- **Relationships:**
	- One per service (by `serviceName`)
# Simple Architecture

```
Frontend (Next.js Dashboard/Test Tools)
	↓
API Routes (Next.js App Router)
	↓
MongoDB Atlas (Database)
```

### How It Works

**1. Lead Creation Flow**
- User submits a lead via the dashboard or API.
- API validates input and checks for duplicates.
- If valid, the lead is saved to MongoDB.
- Providers are assigned using round robin and mandatory logic.
- Assignments and quotas are updated atomically.

**2. Round Robin Provider Assignment Flow**
- Each service has a pool of eligible providers.
- The system keeps a round robin index for each service.
- When a new lead is created, the next available provider(s) are selected in a fair, rotating order.
- Mandatory providers are always assigned first if available.

**3. Quota Reset Flow**
- Admin can reset all provider quotas from the dashboard.
- This triggers an API call that sets all used quotas to zero in MongoDB.
- The dashboard updates in real time to reflect the changes.

**4. Webhook Flow**
- External systems (e.g., payment processors) can trigger a webhook to reset quotas.
- The webhook endpoint checks for duplicate events (idempotency).
- If valid, all provider quotas are reset and the event is recorded.

## API Documentation

### POST /api/leads
**Purpose:** Create a new lead and assign providers (round robin, mandatory, quota logic).

**Request Example:**
```json
{
	"name": "John Doe",
	"phone": "+1234567890",
	"city": "New York",
	"service": "Service 1",
	"description": "Looking for plumbing services."
}
```

**Response Example:**
```json
{
	"success": true,
	"lead": { /* lead object */ },
	"assignedProviders": ["Provider 1", "Provider 2", "Provider 3"]
}
```

**Status Codes:**
- 201: Lead created and assigned
- 409: Duplicate lead or not enough providers
- 400: Validation error
- 500: Server error

---

### GET /api/dashboard
**Purpose:** Fetch dashboard stats, provider quotas, recent leads, and assignments.

**Request Example:**
```http
GET /api/dashboard
```

**Response Example:**
```json
{
	"totalLeads": 42,
	"totalProviders": 8,
	"providers": [ /* ... */ ],
	"recentLeads": [ /* ... */ ],
	"recentAssignments": [ /* ... */ ],
	"providerDetails": [ /* ... */ ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### POST /api/reset-quotas
**Purpose:** Reset all provider used quotas to zero (admin action).

**Request Example:**
```http
POST /api/reset-quotas
```

**Response Example:**
```json
{
	"success": true,
	"message": "All provider quotas reset."
}
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### POST /api/webhook/payment
**Purpose:** Webhook endpoint to reset quotas after payment event (idempotent).

**Request Example:**
```json
{
	"eventId": "evt_1234567890",
	"type": "payment_success",
	"data": { /* ... */ }
}
```

**Response Example:**
```json
{
	"success": true,
	"message": "Quotas reset. Webhook processed."
}
```

**Status Codes:**
- 200: Success
- 409: Duplicate event (already processed)
- 400: Invalid payload
- 500: Server error


# Prowider Mini - Lead Distribution System

## Overview
Prowider Mini is a robust, production-ready lead distribution system for service businesses. It automates lead assignment to providers using round robin, mandatory assignment, and quota logic, with real-time dashboards and concurrency-safe APIs.

## Features
- Lead creation API with duplicate prevention
- Round robin and mandatory provider assignment
- Monthly provider quota system
- Concurrency-safe lead handling
- Admin dashboard with real-time updates
- Webhook-based quota reset

## Folder Structure
```
prowider-mini/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # API endpoints (leads, dashboard, reset-quotas, webhook)
│   └── dashboard/        # Admin dashboard UI
├── models/               # Mongoose models (Lead, Provider, Service, etc.)
├── lib/                  # MongoDB connection utility
├── scripts/              # Seed and utility scripts
├── public/               # Static assets
├── README.md             # Project documentation
└── package.json          # Project config
```

## System Architecture
```
[Next.js UI] ⇄ [API Routes] ⇄ [Mongoose Models] ⇄ [MongoDB Atlas]
```
- All business logic is handled in API routes for reliability and scalability.

## API Endpoints
- `POST /api/leads` — Create a new lead, assign providers
- `GET /api/dashboard` — Dashboard stats, quotas, assignments
- `POST /api/reset-quotas` — Reset all provider quotas
- `POST /api/webhook/payment` — Webhook for quota reset (idempotent)

## Database Collections
- **Service**: Service catalog
- **Provider**: Provider info & quotas
- **Lead**: Customer leads (unique on phone+service)
- **LeadAssignment**: Lead-to-provider assignments
- **AllocationState**: Round robin state per service
- **ProcessedWebhook**: Webhook idempotency tracking

## Setup Instructions
1. Clone the repo: `git clone ...`
2. Install dependencies: `npm install`
3. Configure environment variables (see below)
4. Seed the database: `npm run seed`
5. Start dev server: `npm run dev`

## Environment Variables
- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXT_PUBLIC_API_BASE_URL` — (optional) API base URL for frontend

## Running Locally
```bash
npm install
npm run seed
npm run dev
# Visit http://localhost:3000/dashboard
```

## Deployment Instructions
- Deploy to Vercel, Railway, or any Node.js host
- Set environment variables in your deployment platform
- For production, use a dedicated MongoDB Atlas cluster

## Future Improvements
- Provider notifications (email/SMS)
- Advanced analytics & reporting
- Role-based access control
- Multi-tenant support
- Automated tests & CI/CD
- Provider self-service portal

---
Built with Next.js 16, TypeScript, MongoDB Atlas, Mongoose, and Tailwind CSS.
