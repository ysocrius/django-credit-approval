# Credit Approval System - Frontend

Modern React frontend for the Credit Approval System built with TypeScript, Tailwind CSS, and React Query.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Vite** - Build tool
- **React Router** - Navigation

## Features

- ✅ Customer Registration
- ✅ Loan Eligibility Checker
- ✅ Loan Creation
- ✅ View Customer Loans Dashboard
- ✅ Real-time API integration
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utilities and API client
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the Django REST API backend. Make sure the backend is running before starting the frontend.

All API calls are handled through `src/lib/api.ts` using Axios.
