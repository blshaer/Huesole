# LumeGradients

LumeGradients is a professional monorepo for generating and managing CSS gradients. It provides a specialized environment for discovering, composing, and fine-tuning visual design assets through AI-powered tools and an interactive interface.

## Core Features

- **AI-Powered Generation**: Integration with Google Gemini AI for natural language gradient composition.
- **Canvas Sizing Engine**: Device-specific presets (iPhone, Tablet, Desktop) with automated viewport containment.
- **Interactive Design Tools**: Visual angle controllers for linear, radial, and conic gradients.
- **Dynamic Animation Controls**: High-performance animated gradients with real-time speed and color management.
- **Responsive Architecture**: Specialized mobile optimization layer for zero-latency interactions.
- **Asset Repository**: Curated gradient gallery with local favorites management and clipboard integration.

## Technical Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Styled Components
- **Animation**: Framer Motion, Motion, AOS, animate.css
- **UI Components**: Radix UI (Primitives), Lucide React
- **Graphics**: Three.js, @react-three/fiber, OGL
- **Data Visualization**: Recharts

### Backend
- **Environment**: Node.js, Express
- **Language**: TypeScript
- **AI Integration**: @google/generative-ai (Gemini)
- **Database**: MongoDB via Mongoose
- **Security**: JWT, Bcryptjs, Google Auth Library
- **Utilities**: Nodemailer, Multer, Axios

## Installation

### Prerequisites
- Node.js (v18+)
- npm

### Setup

```bash
# Install dependencies (from root)
npm run install:all
```

### Configuration

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

### Development

Execute the following command in the root directory to start the full stack:
```bash
npm run dev
```

The application is accessible at `http://localhost:5173`.

## Architecture

- **client/**: React-based frontend with feature-based organization.
- **server/**: TypeScript Express backend with Gemini AI integration.

---

Developed by [blshaer](https://github.com/blshaer).
