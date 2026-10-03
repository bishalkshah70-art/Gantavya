# 🏔️ Gantavya — Nepal Trip Planning & Booking Platform

> **Gantavya** means *“destination”* in Nepali.  
> A web-based **Trip Operating System (TOS)** designed to bring Nepal trip discovery, itinerary planning, accommodation, booking, payments, weather, and trip management into one platform.

![Project Status](https://img.shields.io/badge/status-SYP%20MVP-blue)
![Frontend](https://img.shields.io/badge/frontend-Next.js-black)
![Backend](https://img.shields.io/badge/backend-NestJS-red)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![Cache](https://img.shields.io/badge/cache-Redis-red)
![Queue](https://img.shields.io/badge/queue-BullMQ-e34f26)
![License](https://img.shields.io/badge/license-Academic%20Project-lightgrey)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem](#-problem)
- [Proposed Solution](#-proposed-solution)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Use Case Diagram](#-use-case-diagram)
- [Main User Roles](#-main-user-roles)
- [Core Workflows](#-core-workflows)
- [Booking Flow](#-booking-flow)
- [System Sequence](#-system-sequence)
- [Database / ER Diagram](#-database--er-diagram)
- [Functional Requirements](#-functional-requirements)
- [Non-Functional Requirements](#-non-functional-requirements)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [MVP Scope](#-mvp-scope)
- [Future Roadmap](#-future-roadmap)
- [Security](#-security)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Status](#-project-status)
- [Academic Context](#-academic-context)
- [Disclaimer](#-disclaimer)

---

# 🌏 Overview

Gantavya is a proposed full-stack web application for planning and managing trips in Nepal.

The platform is designed to reduce the need for travelers to use multiple disconnected services for:

- Destination discovery
- Hotels and accommodation
- Restaurants and attractions
- Transport planning
- Itinerary creation
- Booking
- Sandbox payment
- Booking confirmation
- Weather information
- Trip monitoring
- Administrative management

Instead of ending at checkout, Gantavya aims to manage the **complete travel lifecycle** from discovery to trip completion.

---

# ❗ Problem

Planning a multi-stop trip in Nepal can require several different tools and services.

A traveler may currently use:

- Booking websites
- Maps
- Social media
- Messaging applications
- Spreadsheets
- Notes
- Travel agencies
- Separate weather applications

This creates several problems:

1. Travel information is distributed across multiple platforms.
2. There is no single source of truth for the complete trip.
3. Itineraries must often be created manually.
4. Booking and availability information can become difficult to coordinate.
5. Weather and travel changes may not automatically appear in the plan.
6. Group planning and budget coordination are difficult to manage.
7. General travel tools may not represent Nepal-specific travel routes and destinations accurately.

---

# 💡 Proposed Solution

Gantavya addresses this problem through a centralized **Trip Operating System**.

A user provides information such as:

```text
Route: Kathmandu → Pokhara
Duration: 5 days
Travelers: 2
```

The system can use its curated Nepal destination data, accommodation information, attractions, categories, and travel-time information to produce a structured itinerary.

The user can then manage:

```text
Discovery
   ↓
Search & Filtering
   ↓
Itinerary
   ↓
Accommodation / Booking
   ↓
Sandbox Payment
   ↓
Booking Confirmation
   ↓
My Trip Dashboard
   ↓
Updates & Notifications
```

---

# 🎯 Objectives

The main objectives are to:

- Provide one platform for Nepal trip planning.
- Reduce the time required to organize a trip.
- Centralize itinerary and booking information.
- Provide Nepal-specific destination information.
- Provide a realistic booking workflow.
- Reduce booking conflicts through transactional availability handling.
- Provide a centralized **My Trip** dashboard.
- Support role-based administration.
- Create a scalable foundation for future tourism services.

---

# 🚀 Key Features

## 👤 Authentication

- User registration
- Login
- Logout
- Profile management
- JWT authentication
- Refresh tokens
- Password hashing

## 🔐 Role-Based Access

Three main roles are planned:

| Role | Main Responsibilities |
|---|---|
| Traveler | Search, plan, book, pay, manage trips, reviews |
| Staff | Manage availability, rates and bookings |
| Administrator | Manage users, content, bookings, reports and roles |

## 🗺️ Destination Discovery

Users can browse:

- Nepal destinations
- Hotels
- Restaurants
- Attractions
- Maps
- Images

Example seeded destinations:

- Kathmandu
- Pokhara
- Chitwan

## 🔎 Search & Filtering

Users can search/filter by:

- Destination
- Price
- Rating
- Category
- Dates

## 🧭 Rule-Based Itinerary Generation

The MVP does **not** require a trained AI/ML model.

Instead, itinerary generation uses rule-based logic involving:

- Location
- Duration
- Categories
- Travel-time information
- Destination relationships

Example:

```text
Route
  ↓
Duration
  ↓
Available destinations
  ↓
Categories / attractions
  ↓
Travel-time constraints
  ↓
Daily itinerary
```

## 🏨 Booking

The booking workflow includes:

1. Availability check
2. Temporary room lock
3. Pending booking
4. Sandbox payment
5. Payment verification
6. Booking confirmation
7. Booking ID
8. Invoice
9. Email confirmation
10. Cancellation support

## 💳 Sandbox Payments

The MVP uses test/sandbox payment workflows such as:

- eSewa sandbox
- Khalti test environment

Real payment processing is outside the initial academic MVP scope.

## 📧 Notifications

The platform can send:

- Booking confirmation emails
- Invoices
- Notifications
- System updates

## 📊 My Trip Dashboard

The dashboard brings together:

- Itinerary
- Bookings
- Weather information
- Trip information
- Updates

WebSockets can be used for live dashboard updates without requiring a full page refresh.

## 🛠️ Admin Panel

Administrators can manage:

- Users
- Roles
- Destinations
- Hotels
- Restaurants
- Attractions
- Room inventory
- Bookings
- Payments
- Reports
- Reviews

---

# 🏗️ System Architecture

The proposed architecture uses a layered full-stack design.

```mermaid
flowchart TB
    U[Traveler / Staff / Administrator]

    subgraph CLIENT["Presentation Layer"]
        FE["Next.js Web Frontend"]
        UI["Responsive Web UI"]
    end

    subgraph API["Application Layer"]
        API1["NestJS REST API"]
        AUTH["JWT + Refresh Token"]
        MOD["Business Modules"]
    end

    subgraph DATA["Data Layer"]
        DB[("PostgreSQL")]
        REDIS[("Redis")]
    end

    subgraph WORKERS["Background Processing"]
        BULL["BullMQ"]
        WORKER["Background Workers"]
    end

    subgraph EXTERNAL["External Services"]
        MAP["Map Service"]
        WEATHER["Weather API"]
        EMAIL["Email Service<br/>Resend / SendGrid"]
        PAY["Sandbox Payment<br/>eSewa / Khalti"]
    end

    U --> FE
    FE --> UI
    UI --> API1

    API1 --> AUTH
    API1 --> MOD

    MOD --> DB
    MOD --> REDIS

    MOD --> BULL
    BULL --> WORKER

    WORKER --> EMAIL
    WORKER --> PAY
    WORKER --> WEATHER

    MOD --> MAP
    MOD --> WEATHER
    MOD --> PAY

    API1 -. WebSocket Updates .-> FE
```

### Architecture Responsibilities

| Component | Responsibility |
|---|---|
| Next.js | Web frontend and user interface |
| NestJS | REST API and business logic |
| PostgreSQL | Persistent relational data |
| Redis | Caching and temporary room locking |
| BullMQ | Background job processing |
| WebSockets | Real-time dashboard updates |
| JWT | Authentication |
| Map Service | Map/location functionality |
| Weather API | Weather information |
| Email Service | Confirmation emails and invoices |
| eSewa/Khalti Sandbox | Test payment workflow |
| Docker | Reproducible development/deployment |
| GitHub Actions | CI automation |

---

# 👥 Use Case Diagram

The following diagram represents the major actors and system functions.

```mermaid
flowchart LR

    Traveler["👤 Traveler"]
    Staff["🧑‍💼 Staff"]
    Admin["👨‍💼 Administrator"]

    subgraph G["Gantavya System"]

        UC1(("Register / Login"))
        UC2(("Manage Profile"))

        UC3(("Browse Destinations"))
        UC4(("Search & Filter"))
        UC5(("View Hotels"))
        UC6(("View Attractions"))
        UC7(("View Restaurants"))

        UC8(("Generate Itinerary"))
        UC9(("View My Trip"))
        UC10(("View Weather"))

        UC11(("Check Availability"))
        UC12(("Create Booking"))
        UC13(("Lock Room Temporarily"))
        UC14(("Make Sandbox Payment"))
        UC15(("Verify Payment"))
        UC16(("Confirm Booking"))
        UC17(("View Booking"))
        UC18(("Cancel Booking"))

        UC19(("Receive Notification"))
        UC20(("Submit Review"))

        UC21(("Manage Availability"))
        UC22(("Manage Rates"))
        UC23(("Manage Bookings"))
        UC24(("Handle Customer Issues"))

        UC25(("Manage Users"))
        UC26(("Manage Roles"))
        UC27(("Manage Destinations"))
        UC28(("Manage Listings"))
        UC29(("Manage Inventory"))
        UC30(("View Reports"))
        UC31(("Moderate Reviews"))
    end

    Traveler --> UC1
    Traveler --> UC2
    Traveler --> UC3
    Traveler --> UC4
    Traveler --> UC5
    Traveler --> UC6
    Traveler --> UC7
    Traveler --> UC8
    Traveler --> UC9
    Traveler --> UC10
    Traveler --> UC11
    Traveler --> UC12
    Traveler --> UC14
    Traveler --> UC17
    Traveler --> UC18
    Traveler --> UC19
    Traveler --> UC20

    UC12 -. includes .-> UC11
    UC12 -. includes .-> UC13
    UC12 -. includes .-> UC14
    UC14 -. includes .-> UC15
    UC15 -. enables .-> UC16

    Staff --> UC21
    Staff --> UC22
    Staff --> UC23
    Staff --> UC24

    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC28
    Admin --> UC29
    Admin --> UC23
    Admin --> UC30
    Admin --> UC31
```

---

# 🧑‍💻 Main User Roles

## Traveler

The traveler can:

- Register and log in
- Manage their profile
- Discover destinations
- Search and filter listings
- View hotels, attractions and restaurants
- Generate itineraries
- View weather
- Check availability
- Create bookings
- Make sandbox payments
- View booking details
- Cancel bookings
- Use My Trip
- Receive notifications
- Submit reviews

## Staff

Staff can:

- Update availability
- Update rates
- Confirm/address bookings
- Handle customer booking issues
- Maintain assigned listings

## Administrator

Administrators can:

- Manage users
- Manage roles
- Manage destinations
- Manage hotels/restaurants/attractions
- Manage room inventory
- Monitor bookings
- Monitor payments
- View reports
- Moderate reviews

---

# 🔄 Core Workflows

## 1. User Registration

```mermaid
sequenceDiagram
    actor User
    participant Web as Next.js
    participant API as NestJS API
    participant DB as PostgreSQL

    User->>Web: Submit registration
    Web->>API: POST /auth/register
    API->>API: Validate input
    API->>API: Hash password
    API->>DB: Create user
    DB-->>API: User created
    API-->>Web: Registration success
    Web-->>User: Account created
```

---

## 2. Authentication

```mermaid
sequenceDiagram
    actor User
    participant Web as Next.js
    participant API as NestJS
    participant DB as PostgreSQL

    User->>Web: Enter credentials
    Web->>API: Login request
    API->>DB: Find user
    DB-->>API: User data
    API->>API: Verify password
    API->>API: Generate JWT + refresh token
    API-->>Web: Authentication tokens
    Web-->>User: Logged in
```

---

# 🧭 Itinerary Generation Flow

```mermaid
flowchart TD

    A["User enters route"] --> B["Enter duration"]
    B --> C["Enter number of travelers"]
    C --> D["Retrieve Nepal destination data"]

    D --> E["Apply location rules"]
    E --> F["Apply duration rules"]
    F --> G["Apply category rules"]
    G --> H["Apply travel-time constraints"]

    H --> I["Generate daily itinerary"]
    I --> J["Display itinerary"]
    J --> K["Save itinerary to My Trip"]
```

### Example

```text
Input
 ├── Route: Kathmandu → Pokhara
 ├── Duration: 5 days
 └── Travelers: 2

             ↓

Rule-Based Planner

             ↓

Output

Day 1 → Kathmandu
Day 2 → Kathmandu → Pokhara
Day 3 → Pokhara attractions
Day 4 → Pokhara activities
Day 5 → Return / departure plan
```

> The exact itinerary is generated from the application's curated destination, category and travel-time data.

---

# 🏨 Booking Flow

The booking workflow is designed to reduce double-booking conflicts.

```mermaid
flowchart TD

    A["User selects accommodation"] --> B["Check availability"]

    B -->|Unavailable| C["Show unavailable"]
    B -->|Available| D["Temporarily lock room"]

    D --> E["Create pending booking"]

    E --> F["Start sandbox payment"]

    F -->|Payment failed| G["Release temporary lock"]
    F -->|Payment successful| H["Verify payment callback"]

    H -->|Invalid| G
    H -->|Valid| I["Confirm booking"]

    I --> J["Generate booking ID"]
    J --> K["Generate invoice"]
    K --> L["Send confirmation email"]
    L --> M["Update My Trip"]
```

---

# 💳 Booking Sequence Diagram

```mermaid
sequenceDiagram

    actor Traveler
    participant Web as Next.js
    participant API as NestJS API
    participant Redis as Redis
    participant DB as PostgreSQL
    participant Pay as eSewa/Khalti Sandbox
    participant Worker as BullMQ Worker
    participant Email as Email Service

    Traveler->>Web: Select room
    Web->>API: Check availability
    API->>DB: Query room inventory
    DB-->>API: Available

    API->>Redis: Temporary room lock
    Redis-->>API: Lock created

    API->>DB: Create pending booking
    DB-->>API: Booking created

    API-->>Web: Payment request
    Web->>Pay: Sandbox payment

    Pay-->>API: Payment callback
    API->>Pay: Verify payment

    Pay-->>API: Payment verified

    API->>DB: Confirm booking
    API->>Redis: Release/complete lock

    API->>Worker: Queue confirmation email
    Worker->>Email: Send confirmation
    Email-->>Traveler: Booking confirmation

    API-->>Web: Booking ID + confirmation
    Web-->>Traveler: Show confirmed booking
```

---

# 📊 Database / ER Diagram

The following logical model represents the major data areas required by the proposed system.

```mermaid
erDiagram

    USER ||--o{ BOOKING : creates
    USER ||--o{ REVIEW : writes
    USER ||--o{ ITINERARY : owns

    DESTINATION ||--o{ LISTING : contains
    DESTINATION ||--o{ ITINERARY : included_in

    LISTING ||--o{ BOOKING : receives
    LISTING ||--o{ REVIEW : receives

    LISTING ||--o{ ROOM_INVENTORY : has

    BOOKING ||--o| PAYMENT : has
    BOOKING ||--o| INVOICE : generates

    ITINERARY ||--o{ ITINERARY_ITEM : contains

    USER {
        uuid id PK
        string name
        string email
        string passwordHash
        string role
    }

    DESTINATION {
        uuid id PK
        string name
        string description
        string location
    }

    LISTING {
        uuid id PK
        uuid destinationId FK
        string name
        string category
        decimal price
        decimal rating
    }

    ROOM_INVENTORY {
        uuid id PK
        uuid listingId FK
        string roomType
        int quantity
        decimal rate
    }

    BOOKING {
        uuid id PK
        uuid userId FK
        uuid listingId FK
        string status
        decimal totalAmount
        datetime checkIn
        datetime checkOut
    }

    PAYMENT {
        uuid id PK
        uuid bookingId FK
        string provider
        string status
        decimal amount
    }

    INVOICE {
        uuid id PK
        uuid bookingId FK
        string invoiceNumber
        decimal amount
    }

    ITINERARY {
        uuid id PK
        uuid userId FK
        string route
        int duration
        int travelers
    }

    ITINERARY_ITEM {
        uuid id PK
        uuid itineraryId FK
        string day
        string activity
        string location
    }

    REVIEW {
        uuid id PK
        uuid userId FK
        uuid listingId FK
        int rating
        string comment
    }
```

> This is a **logical architecture/ER representation** for the project README. The final database schema may evolve during implementation.

---

# 📋 Functional Requirements

## Authentication

- Registration
- Login
- Logout
- Profile management
- JWT authentication
- Refresh tokens

## Authorization

- Traveler role
- Staff role
- Administrator role
- Protected routes
- Role-based authorization

## Destination & Listing Management

- Browse destinations
- View hotels
- View restaurants
- View attractions
- Images
- Maps
- CRUD operations

## Search

- Destination search
- Price filtering
- Rating filtering
- Category filtering
- Date filtering

## Itinerary

- Route input
- Duration input
- Traveler count
- Rule-based itinerary generation
- Save itinerary
- View itinerary

## Booking

- Availability checking
- Temporary room locking
- Pending bookings
- Sandbox payment
- Payment verification
- Booking confirmation
- Booking ID
- Invoice
- Cancellation

## Notifications

- Booking emails
- Invoices
- In-app notifications

## Administration

- User management
- Role management
- Content management
- Listing management
- Inventory management
- Booking monitoring
- Payment monitoring
- Reports
- Review moderation

---

# ⚙️ Non-Functional Requirements

| Requirement | Target |
|---|---|
| Security | Password hashing, JWT, refresh tokens, role authorization, input validation, HTTPS, verified payment callbacks |
| Performance | Common pages/searches targeted for approximately 2–3 seconds |
| Usability | Responsive interface for desktop and mobile browsers |
| Reliability | Transactional booking and background retry mechanisms |
| Scalability | Stateless API with separate cache and worker services |
| Maintainability | Modular NestJS architecture, version control and automated testing |
| Availability | Containerized deployment, health checks and backups |
| Compatibility | Current Chrome, Firefox, Edge and Safari |

---

# 🧰 Technology Stack

## Frontend

- Next.js
- React
- Responsive web UI

## Backend

- NestJS
- REST API
- WebSockets

## Database

- PostgreSQL

## Caching

- Redis

## Background Jobs

- BullMQ

## Authentication

- JWT
- Refresh tokens

## External Services

- Map service
- Weather API
- Email service such as Resend or SendGrid
- eSewa/Khalti sandbox payment

## DevOps

- Docker
- Git
- GitHub
- GitHub Actions

---

# 📁 Project Structure

The following structure is recommended for implementation:

```text
gantavya/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── hooks/
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── destinations/
│   │   ├── listings/
│   │   ├── itineraries/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── notifications/
│   │   ├── reviews/
│   │   ├── reports/
│   │   └── common/
│   │
│   └── test/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── architecture/
│   ├── diagrams/
│   └── api/
│
├── docker-compose.yml
├── .env.example
├── README.md
└── .gitignore
```

---

# 🗂️ Suggested Backend Modules

```text
AuthModule
UserModule
DestinationModule
ListingModule
SearchModule
ItineraryModule
BookingModule
PaymentModule
NotificationModule
ReviewModule
AdminModule
ReportModule
```

### Responsibility

```text
AuthModule
    → registration, login, JWT, refresh tokens

DestinationModule
    → Nepal destinations

ListingModule
    → hotels, restaurants, attractions

SearchModule
    → search and filtering

ItineraryModule
    → rule-based itinerary generation

BookingModule
    → availability, locking and booking lifecycle

PaymentModule
    → sandbox payment and verification

NotificationModule
    → email and application notifications

AdminModule
    → administration and content management

ReportModule
    → booking and revenue summaries
```

---

# 🧪 MVP Scope

The first working version is intentionally limited to achievable core functionality.

### Included in MVP

- [x] User registration
- [x] Login
- [x] Role-based access
- [x] Traveler/Admin access
- [x] Nepal destination database
- [x] Kathmandu data
- [x] Pokhara data
- [x] Chitwan data
- [x] Search
- [x] Filtering
- [x] Rule-based itinerary generation
- [x] Availability checking
- [x] Temporary booking lock
- [x] Pending booking
- [x] Sandbox payment
- [x] Payment confirmation
- [x] Booking ID
- [x] Email confirmation
- [x] My Trip dashboard
- [x] Itinerary display
- [x] Booking display
- [x] Weather information
- [x] Admin listing management
- [x] Admin booking management
- [x] Admin user management

---

# 🔮 Future Roadmap

Features outside the initial MVP can be introduced in later phases.

```mermaid
timeline
    title Gantavya Roadmap

    MVP : Authentication
        : Destinations
        : Search & Filtering
        : Rule-Based Itinerary
        : Booking
        : Sandbox Payment
        : My Trip
        : Admin Panel

    Phase 2 : Group Trips
            : Shared Expenses
            : Improved Search
            : More Nepal Destinations

    Phase 3 : Flight Status Integration
            : Hotel API Integration
            : More External Services

    Phase 4 : Native Mobile Applications
            : Advanced Trip Management
            : Expanded Regional Coverage
```

---

# 🔐 Security

The proposed system uses several security controls:

### Authentication

```text
Password
   ↓
Hash
   ↓
Stored securely
```

### API Authentication

```text
Login
  ↓
Access JWT
  +
Refresh Token
  ↓
Protected API
```

### Authorization

```text
User
 ├── Traveler → Traveler routes
 ├── Staff → Staff routes
 └── Admin → Administrative routes
```

### Booking Security

Booking operations should use database transactions and temporary inventory locking to reduce the risk of double booking.

Payment callbacks should also be validated before a booking is confirmed.

---

# 🐳 Installation

> The commands below represent the intended development setup. Adjust paths/scripts to match the implementation as the codebase evolves.

## 1. Clone the repository

```bash
git clone https://github.com/bishalkshah70-art/gantavya.git
cd gantavya
```

## 2. Start infrastructure

```bash
docker compose up -d
```

This can provide services such as:

```text
PostgreSQL
Redis
```

## 3. Install frontend dependencies

```bash
cd frontend
npm install
```

## 4. Install backend dependencies

```bash
cd ../backend
npm install
```

## 5. Configure environment variables

```bash
cp .env.example .env
```

Add the required database, authentication, external-service and payment configuration.

## 6. Seed the database

```bash
npm run seed
```

> Use the actual seed command implemented in the backend if it differs.

---

# 🔑 Environment Variables

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gantavya

REDIS_URL=redis://localhost:6379

JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me

MAP_API_KEY=your_map_key
WEATHER_API_KEY=your_weather_key

EMAIL_API_KEY=your_email_key

ESEWA_SECRET=your_sandbox_secret
KHALTI_SECRET=your_test_secret
```

**Never commit real secrets to GitHub.**

Use:

```text
.env
```

and commit:

```text
.env.example
```

instead.

---

# ▶️ Development

Run the backend:

```bash
cd backend
npm run start:dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Then open the local development URL shown by Next.js.

---

# 🧪 Testing

The project should include testing for important application areas.

### Backend

```text
Authentication
Authorization
Itinerary generation
Availability
Booking transactions
Payment verification
```

### Frontend

```text
Registration
Login
Search
Filtering
Itinerary
Booking
My Trip
Admin dashboard
```

### Integration

```text
Frontend → API → Database
Frontend → API → Payment Sandbox
API → Queue → Email Service
API → WebSocket → My Trip
```

---

# 🚢 Deployment Architecture

A production deployment can use:

```mermaid
flowchart TB

    User["Traveler / Staff / Admin"]
    CDN["Web / CDN"]
    Frontend["Next.js"]
    Backend["NestJS API"]
    DB[("PostgreSQL")]
    Redis[("Redis")]
    Worker["BullMQ Worker"]

    User --> CDN
    CDN --> Frontend
    Frontend --> Backend

    Backend --> DB
    Backend --> Redis
    Backend --> Worker

    Worker --> DB
    Worker --> Redis
```

Docker is intended to make development and deployment reproducible.

GitHub Actions can be used for:

```text
Push
 ↓
Install dependencies
 ↓
Run tests
 ↓
Build
 ↓
Deploy
```

---

# 📈 Business Value

Gantavya is designed around the idea of providing a single platform for the travel lifecycle.

### Value for Travelers

- Less manual planning
- Centralized trip information
- Easier booking
- Organized itinerary
- Weather information
- One My Trip dashboard

### Potential Future Business Model

Possible future revenue streams include:

- Booking commissions
- Featured listings
- Operator subscriptions
- Partnership opportunities
- Premium trip-planning tools

These are future possibilities and are not required for the academic MVP.

---

# 📊 System Comparison

| Area | Existing / Alternative Approach | Gantavya |
|---|---|---|
| Planning | Multiple tools | Centralized trip planning |
| Booking | Booking-focused | Booking + trip management |
| Itinerary | Often manual or separate | Integrated rule-based itinerary |
| Information | Fragmented | One trip dashboard |
| Data | Multiple services | Structured PostgreSQL data |
| Booking conflicts | Depends on provider | Transactional availability handling |
| Group planning | Chat/spreadsheets | Future extension |
| Updates | Often manual | WebSocket-based dashboard updates |
| Nepal focus | Varies | Curated Nepal destinations |
| Administration | Provider-specific | Dedicated admin panel |

---

# 🧩 Project Scope

## Included

- Web application
- Next.js frontend
- NestJS backend
- PostgreSQL database
- Redis caching
- Background workers
- Rule-based itinerary generation
- Booking workflow
- Sandbox payments
- My Trip dashboard
- Admin panel
- Nepal destination dataset

## Not Included in Initial SYP Scope

- Native mobile applications
- Full live integration with every hotel
- Full airline integration
- Real production payment processing
- Trained AI/ML itinerary model
- IoT hardware/sensors

---

# 🤖 AI/ML Clarification

Although Gantavya contains automated itinerary generation, the current MVP does **not** depend on a trained AI/ML model.

The itinerary engine is intentionally **rule-based**.

It uses factors such as:

```text
Location
Duration
Categories
Travel time
Destination data
```

This keeps the initial system achievable and explainable.

A future version could explore machine-learning-based personalization after sufficient user/trip data becomes available.

---

# 📚 Academic Context

This project is being developed as a **Second Year Project (SYP)**.

### Project

**Gantavya — Nepal Trip Planning & Booking Platform**

### Student

**Bishal Kumar Sah**

### Supervisor

**Nikesh Shah**

### Institution

**London Metropolitan University**

### Project Type

**Second Year Project**

### Submission

**2026**

---

# 📌 Project Status

```text
Project: Gantavya
Type: Academic SYP
Stage: MVP Development / Planning
Architecture: Full-Stack Web Application
Primary Goal: Nepal Trip Planning & Management
```

---

# ⚠️ Disclaimer

Gantavya is an academic project and prototype.

The system is designed to demonstrate software engineering concepts including:

- Full-stack development
- REST APIs
- Database design
- Authentication
- Authorization
- Booking workflows
- Transaction handling
- Background processing
- External API integration
- Real-time communication
- Software architecture

Payment functionality in the academic MVP is intended to use sandbox/test environments.

---

# 👨‍💻 Author

**Bishal Kumar Sah**

GitHub:

**[@bishalkshah70-art](https://github.com/bishalkshah70-art)**

---

# ⭐ Project Vision

> **One destination for the whole journey.**

Gantavya aims to transform Nepal trip planning from a collection of disconnected tools into one structured, scalable and Nepal-focused travel management platform.

---

## 📖 References

The project proposal identifies the following sources and alternatives as part of its background research:

- The Himalayan Times — Nepal tourism statistics
- Nepal Tourism Board — International visitor arrivals
- FlyNepal
- Hop Nepal
- Lokrio
- OpenYatra
- Wanderlog
- Next.js documentation

For the full academic references, see the project proposal/documentation.
