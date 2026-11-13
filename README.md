# Doora — Task Manager Application

A modern, full-stack productivity platform built with the MERN stack. Features secure authentication with 2FA, email verification, task and project management, multiple task views, a Pomodoro focus timer, analytics, and a polished, responsive UI.

## 🚀 Features

- **Authentication & Security**
  - JWT-based registration and login, with email OTP verification for new accounts
  - Two-Factor Authentication (Authenticator App & Email)
  - Secure password hashing with bcrypt, rate-limited auth endpoints, and `helmet` security headers
- **Task Management**
  - Full task fields: priority, due dates, tags, subtasks, recurrence, reminders, time tracking
  - Statuses: To Do, In Progress, In Review, Done, and Archived
  - Bulk actions (complete, archive, delete) across selected tasks
  - Multiple views: List, Grid, Kanban (drag-and-drop), Priority, and monthly Calendar
- **Projects**
  - Create, edit, archive/restore, and delete projects
  - Per-project detail page with live progress, overdue count, and task list
  - Projects overview page with per-project stats
- **Productivity Tools**
  - Pomodoro-style Focus Mode that keeps running across navigation and logs time to the task
  - Notifications for overdue and due-today tasks
  - Activity history timeline of task creation/completion
  - Global search (Ctrl/Cmd+K) across tasks, projects, and pages
- **Analytics**: real metrics (no mock data) with a selectable 7/14/30-day range
- **Settings**: profile, theme (including dark/system/custom themes), default landing view, calendar week-start, 2FA, password change, account deletion
- **Responsive UI**: built with Tailwind CSS, dark-first design, works across desktop and mobile

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern UI library.
- **Vite**: Fast build tool and dev server.
- **Tailwind CSS 4**: Utility-first CSS framework for styling.
- **Framer Motion**: For smooth animations.
- **Lucide React**: Beautiful icons.
- **Axios**: HTTP client for API requests.
- **React Router 7**: For client-side routing.

### Backend
- **Node.js & Express**: Robust server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Nodemailer**: For sending transactional emails (OTPs).
- **Speakeasy**: For handling 2FA tokens.
- **Bcrypt**: For password encryption.

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install Root Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### ⚙️ Environment Configuration

You need to configure environment variables for both the server and the client.

#### 1. Server (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development

# Email Configuration (for OTPs)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Task Manager

# Development URLs
CLIENT_URL_DEV=http://localhost:5173
API_URL_DEV=http://localhost:5000

# Production URLs
CLIENT_URL_PROD=https://your-production-app.netlify.app
API_URL_PROD=https://your-production-api.onrender.com
```

#### 2. Client (`client/.env.development`)
Create a `.env.development` file in the `client` directory for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3. Client (`client/.env.production`)
Create a `.env.production` file in the `client` directory for production builds:

```env
VITE_API_URL=https://your-production-api.onrender.com/api
```

### 🏃‍♂️ Running the App

The project uses `concurrently` to run both the client and server with a single command from the root directory.

```bash
# Run from the root directory
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 🌱 Demo Account

To explore the app without registering a real account, seed a demo user with sample projects and tasks:

```bash
cd server
npm run seed
```

This creates (or resets) a pre-verified demo account:

- **Email**: `demo@doora.app`
- **Password**: `Demo1234!`

Safe to re-run — it only ever touches this one demo account's data, never anyone else's. Requires `MONGO_URI` to be set in `server/.env`.

## 📦 Building for Production

To build the frontend for deployment:

```bash
cd client
npm run build
```

This will create a `dist` folder in the client directory.

## 🚢 Deployment

This app can deploy as two services (recommended) or as a single combined service.

### Option A: Two services (e.g. Render — see `render.yaml`)

- **Server**: deploy `server/` as a Node web service (`npm install` / `npm start`). Set the environment variables from `server/.env.example` in the host's dashboard — never commit a real `.env` file.
- **Client**: deploy `client/` as a static site (`npm install && npm run build`, publish `dist/`). Set `VITE_API_URL` to the deployed server's `/api` URL, and configure a rewrite of `/*` → `/index.html` for client-side routing.
- A `render.yaml` is included at the repo root as a ready-to-use blueprint for Render; adapt it for other hosts (Railway, Fly.io, etc.) as needed.

### Option B: Single service

Set `NODE_ENV=production` and run `npm run build` in `client/` before starting the server — `server.js` serves the built client files and falls back to `index.html` for client-side routes when `NODE_ENV=production`. `CLIENT_URL_PROD` should still point at wherever the service is reachable, since it's used for CORS.

### Required environment variables

See `server/.env.example` for the full list (Mongo connection string, JWT secret, email credentials for OTP/2FA, and optional Cloudinary credentials for profile picture uploads).
