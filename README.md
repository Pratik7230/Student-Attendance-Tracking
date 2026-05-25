# Student Attendance Tracking

Role-based attendance tracking app for schools and colleges. Admins manage users and grades, teachers record attendance and generate reports, and students view their own attendance.

## Features

- Role-based access for Admin, Teacher, and Student dashboards
- Attendance marking by grade and subject, with monthly views
- PDF attendance reports generated on the server
- Password reset via email OTP and in-app change password
- Charts and tables for quick insights

## Tech Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS + Radix UI
- Drizzle ORM + MySQL
- JWT auth + bcrypt
- Nodemailer for OTP emails
- Puppeteer/Chromium for PDF generation

## Getting Started

1. Install dependencies:
	```bash
	npm install
	```
2. Create a local environment file:
	```bash
	copy env.sample .env
	```
3. Fill in the database and email values in `.env`.
4. Push the database schema:
	```bash
	npm run db:push
	```
5. Start the dev server:
	```bash
	npm run dev
	```
6. Open http://localhost:3000

## Environment Variables

Set these in `.env` (see `env.sample`):

- EMAIL_USER: SMTP email address used to send OTPs
- EMAIL_APP_PASSWORD: App password or SMTP credential for the email account
- JWT_SECRET_KEY: Secret used to sign JWTs
- DB_HOST: Database host
- DB_USER / DB_USERNAME: Database user
- DB_PASSWORD: Database password
- DB_NAME / DB_DATABASE: Database name
- DB_PORT: Database port (default 3306)
- DB_SSL: Set to true to enable SSL (default true)

## Scripts

- npm run dev: start Next.js in development mode
- npm run build: build for production
- npm run start: start the production server
- npm run lint: run lint checks
- npm run db:push: push Drizzle schema to the database
- npm run db:studio: open Drizzle Studio

## Project Structure

- app/: routes, pages, and UI
- app/api/: API routes (attendance, auth, reports)
- app/dashboard/: role-specific dashboards
- app/_components/: shared client components
- utils/schema.js: Drizzle schema definitions
- drizzle.config.js: Drizzle configuration
- lib/email-util.js: email helper for OTP

## Deployment

Build and start:

```bash
npm run build
npm run start
```
