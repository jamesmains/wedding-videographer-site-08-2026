### Portfolio Web Application
A full-stack single-page web application built with React, Express, and SQLite for showcasing video work and managing client inquiries.

#### Features
Video gallery with dynamic playback controls

Integrated contact form for client inquiries

SQLite database integration for inquiry storage

Password-protected admin interface for reviewing and deleting inquiries

Single-page application routing without page reloads

Custom responsive styling with warm linen and gold themes

#### Tech Stack
Frontend: React, Vite, CSS3

Backend: Node.js, Express

Database: SQLite (sqlite / sqlite3)

#### Getting Started
##### Prerequisites
Node.js (v18 or higher recommended)

npm

##### Installation
Clone the repository:
git clone 
cd

Install backend dependencies:
npm install

Install frontend dependencies:
cd client
npm install
cd ..

##### Configuration
Create a .env file in the root directory and define the following variables:

PORT=3000
SESSION_SECRET=your_secret_key_here
ADMIN_PASSWORD=your_admin_password_here

Running the Application
Start the backend server:
npm run dev

In a separate terminal, start the frontend development server:
cd client
npm run dev

Open your browser and navigate to http://localhost:5173.

#### API Endpoints
POST /api/inquiries - Submit a new client inquiry

POST /api/login - Authenticate admin session

POST /api/logout - Clear admin session

GET /api/inquiries - Fetch all inquiries (requires authentication)

DELETE /api/inquiries/:id - Delete an inquiry by ID (requires authentication)

#### Project Structure
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── db.js
│   └── index.js
├── .env.example
├── package.json
└── README.md