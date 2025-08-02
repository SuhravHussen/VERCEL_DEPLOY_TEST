# Fluency Checker

A multilingual fluency assessment tool for language learners.

## Features

- Multi-language support (English, French, Dutch, Bengali)
- Authentication system with email/password and Google OAuth
- Fluency assessment tools
- Modern UI with responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following content:

   ```
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"

   # App configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. To get a Google Client ID:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Set up the consent screen if prompted
   - Choose "Web application" as the application type
   - Add authorized JavaScript origins (e.g., http://localhost:3000)
   - Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/callback/google)
   - Copy the generated Client ID to your .env.local file

5. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- Next.js
- TypeScript
- React Query
- Tailwind CSS
- Zod for validation
- @react-oauth/google for Google authentication

<!-- Exam managment added  -->
