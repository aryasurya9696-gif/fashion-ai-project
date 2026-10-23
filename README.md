
# FashionAI - Your Personal AI Stylist

A modern Next.js application that provides AI-powered fashion recommendations and styling advice.

## Features

- **AI-Powered Styling**: Upload photos of your dresses and get personalized outfit recommendations
- **Smart Photo Analysis**: Advanced AI analyzes your clothing for style, color, and occasion suitability
- **Occasion-Based Recommendations**: Get perfect looks for family functions, office meetings, parties, and more
- **Save & Organize**: Save your favorite outfits and build your personal style collection
- **Real-time Chat**: Interactive chat interface with AI stylist
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn/UI
- **Database**: PostgreSQL with PostgREST
- **State Management**: React Context, localStorage
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fashionai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Database Configuration (for production)
POSTGREST_URL=your_postgrest_url
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_api_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### For Production (PostgreSQL)

1. Set up a PostgreSQL database
2. Run the schema creation script:
```sql
-- See src/lib/database-schema.sql for complete schema
```

3. Configure PostgREST to connect to your database
4. Update environment variables with your database credentials

### For Development

The app uses localStorage for demo purposes and can run without a database connection.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── chat/              # AI chat interface
│   ├── dashboard/         # User dashboard
│   ├── history/           # Saved outfits history
│   ├── profile/           # User profile management
│   └── next_api/          # API routes
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   ├── api-client.ts     # API client for frontend
│   ├── api-utils.ts      # API utilities
│   ├── crud-operations.ts # Database operations
│   └── postgrest.ts      # Database connection
└── hooks/                # Custom React hooks
```

## API Routes

- `POST /next_api/users` - Create user account
- `GET /next_api/users?id={id}` - Get user profile
- `PUT /next_api/users?id={id}` - Update user profile
- `GET /next_api/outfits?user_id={id}` - Get saved outfits
- `POST /next_api/outfits` - Save new outfit
- `DELETE /next_api/outfits?id={id}` - Delete outfit
- `GET /next_api/chat-history?user_id={id}` - Get chat history
- `POST /next_api/chat-history` - Save chat session

## Key Features Implementation

### AI Styling Recommendations
- Upload multiple dress photos
- AI analyzes images and provides occasion-specific recommendations
- Complete outfit cards with styling tips

### User Authentication
- Demo account for quick testing
- Full signup/login flow
- Persistent user sessions

### Data Management
- PostgreSQL database for production
- localStorage fallback for development
- CRUD operations for all user data

### Responsive Design
- Mobile-first approach
- Glass morphism UI effects
- Smooth animations with Framer Motion

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

```env
# Required for production database
POSTGREST_URL=your_postgrest_endpoint
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_api_key

# Optional
NEXT_PUBLIC_APP_URL=your_app_url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
