# Calendar Booking Service

A backend service for scheduling user meetings with **strict time-slot conflict prevention**.  
The system exposes clean REST APIs to manage users and meetings while ensuring that **no two meetings overlap for the same user**.

This project is designed following **production-oriented backend practices**, focusing on clear API design, strong business rule enforcement, and maintainable architecture. It follows a layered approach (routes → controllers → services → models) and uses a relational database to guarantee data consistency and correctness.

The core problem this service solves is **reliable calendar scheduling** — every meeting creation or update is validated against existing data so that conflicting time ranges are rejected deterministically, even under edge cases.

## Problem Statement

Modern scheduling systems must ensure that meetings are created reliably without time conflicts.  
The core challenge is to allow users to create, update, and manage meetings while **guaranteeing that no two meetings overlap for the same user**.

The system must handle validation, conflict detection, and error scenarios consistently, returning clear API responses that prevent invalid or conflicting bookings from being stored in the database.

## High-Level Solution Overview

The service is implemented as a RESTful API using a layered backend architecture.  
Incoming requests are validated at the API boundary, business rules are enforced in the service layer, and all data operations are handled through Sequelize ORM.

Meeting conflicts are prevented by querying existing records before every create or update operation using precise time-range checks. This ensures consistent behavior across all endpoints while keeping the codebase modular, testable, and easy to extend.

## Tech Stack

- **Node.js** – JavaScript runtime for building the backend service  
- **Express.js** – Web framework for routing and middleware management  
- **Sequelize ORM** – ORM for database modeling, migrations, and queries  
- **SQL Database (SQLite for local development)** – Relational database for storing users and meetings  
- **Postman** – API testing and request validation during development  
- **Git & GitHub** – Version control and source code management

## Folder Structure

The project follows a modular and layered folder structure to keep responsibilities clearly separated and the codebase easy to maintain.

```
src/
├── modules/
│   ├── user/
│   │   ├── index/
│   │   ├── interface/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── service/
│   │   └── routes/
│   └── meeting/
│       ├── index/
│       ├── interface/
│       ├── dto/
│       ├── model/
│       ├── service/
│       └── routes/
├── middlewares/
├── config/
├── utils/
├── app.js
└── server.js
```

### Structure Overview

- `modules/`  
  Encapsulates feature-specific logic. Each module is self-contained and follows the same internal structure.

- `routes/`  
  Defines API routes and maps them to controllers.

- `interface/`  
  Acts as the controller layer, handling request/response logic.

- `service/`  
  Contains core business logic, including meeting conflict checks.

- `model/`  
  Defines Sequelize models and their associations.

- `dto/`  
  Handles request validation and data shape enforcement.

- `middlewares/`  
  Centralized error handling and request-level middleware.

- `config/`  
  Application and database configuration.

- `utils/`  
  Shared helper functions used across modules.

- `app.js`  
  Express app setup and middleware registration.

- `server.js`  
  Application entry point responsible for starting the server.

## Database Design

The application uses a relational database to ensure data consistency and support efficient time-based queries required for conflict detection.

### Users Table

Stores basic user information.

- `id` – Primary key  
- `name` – User name (required)  
- `email` – User email (required, unique)  
- `createdAt`, `updatedAt` – Timestamps  

**Constraints & Indexes**
- Unique constraint on `email`

---

### Meetings Table

Stores scheduled meetings associated with users.

- `id` – Primary key  
- `userId` – Foreign key referencing `users.id`  
- `title` – Meeting title (required)  
- `startTime` – Meeting start time (datetime, required)  
- `endTime` – Meeting end time (datetime, required)  
- `createdAt`, `updatedAt` – Timestamps  

**Constraints & Indexes**
- Foreign key constraint on `userId`
- Index on `(userId, startTime)` to optimize conflict checks

---

### Relationships

- One user can have multiple meetings  
- Each meeting belongs to exactly one user  

This schema keeps the data model minimal while supporting fast conflict detection and clean API behavior.

## API Design & Endpoints

The service exposes RESTful APIs with predictable URLs, clear HTTP methods, and consistent status codes.  
All endpoints accept and return JSON.

### Users

#### Create User
- **POST** `/users`
- Creates a new user

#### Get User by ID
- **GET** `/users/:id`
- Returns user details or `404` if not found

---

### Meetings

#### Create Meeting
- **POST** `/meetings`
- Creates a meeting after validating input and checking for time conflicts

#### List Meetings
- **GET** `/meetings`
- Supports optional filters:
  - `userId`
  - `startDate`
  - `endDate`

#### Get Meeting by ID
- **GET** `/meetings/:id`
- Returns meeting details or `404` if not found

#### Update Meeting
- **PUT** `/meetings/:id`
- Updates meeting details after re-validating time conflicts

#### Delete Meeting
- **DELETE** `/meetings/:id`
- Deletes a meeting and returns `204` on success

---

### API Conventions

- Proper HTTP status codes are used for all responses  
- Validation and business rule errors return meaningful messages  
- Conflict scenarios return `400 Bad Request` with a clear reason

## Business Rules & Validation

### Meeting Conflict Rule

A meeting cannot overlap with an existing meeting for the same user.

A conflict is detected when:

`existing.startTime < new.endTime` **AND** `existing.endTime > new.startTime`

If a conflict exists, the request is rejected with:
- `400 Bad Request`
- Message: `Time slot already booked`

### Validation Rules

- `startTime` must be earlier than `endTime`.
- All required fields must be present in the request.
- Conflict checks are enforced on both **create** and **update** operations.
- Requests for non-existent users or meetings return `404 Not Found`.
- Successful operations return appropriate HTTP status codes (`201`, `200`, `204`).

## Error Handling

The application uses centralized error handling to ensure consistent and predictable API responses.

- Validation and business rule violations return `400 Bad Request` with a clear message.
- Requests for non-existent resources return `404 Not Found`.
- Successful create, update, and delete operations return appropriate HTTP status codes.
- All errors are handled through a common middleware to avoid duplicated logic across controllers.

This approach keeps error responses uniform and makes the API easier to debug and consume.

## Run Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_URL=sqlite:./database.sqlite
   ```

4. **Run database migrations**

   Migrations will create all required tables and initialize the database.
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

Once the server is running, the SQLite database file will be created automatically (if not already present), and the APIs will be available on the configured port.

## Project Links

- **GitHub Repository:** https://github.com/suraj-tetarwal/meeting-scheduler-backend
- **Deployed API URL:** https://meeting-scheduler-backend-bner.onrender.com
