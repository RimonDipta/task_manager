# Task Manager Application

A modern, full-stack task management application built with the MERN stack. Features secure authentication with 2FA, email verifications, and a beautiful, responsive user interface.

## 🚀 Features

- **Authentication**: Secure user registration and login using JWT.
- **Security**: 
  - Email OTP Verification for new accounts.
  - Two-Factor Authentication (2FA) support (Authenticator App & Email).
  - Secure password hashing with bcrypt.
- **Task Management**: Create, read, update, and delete tasks effectively.
- **Responsive UI**: Built with Tailwind CSS for a seamless experience across all devices.
- **Modern Tech**: Powered by Vite and React for high performance.

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

## 📦 Building for Production

To build the frontend for deployment:

```bash
cd client
npm run build
```

This will create a `dist` folder in the client directory.
