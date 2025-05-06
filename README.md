# Asakiri - Language Learning Platform

Asakiri is a community driven platform for learning and teaching languages. Built with SvelteKit 5 and Supabase, it offers an interactive environment for language education.

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Course Creation**: Create and manage language courses with a powerful editor
- **Structured Learning**: Organize courses into units with different section types:
  - Grammar sections with explanations and examples
  - Vocabulary sections with flashcards
  - Reading sections with text and translations
- **Spaced Repetition**: Review vocabulary and characters with an integrated spaced repetition system
- **Federation**: Connect with other Asakiri instances to discover and share courses

## Tech Stack

- **Frontend**: SvelteKit with Svelte 5
- **Backend**: Supabase (Authentication, Database, Storage)
- **Styling**: SCSS with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Supabase CLI installed (`npm install -g supabase`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alekoii/asakiri.git
   cd asakiri
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   PUBLIC_FRONTEND_URL=your_frontend_url
   ```

4. Set up the database schema:
   ```bash
   # Login to Supabase CLI
   supabase login

   # Link your local project to your Supabase project
   supabase link --project-ref your-project-id

   # Push the database schema to your Supabase project
   supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app.html            # Base HTML template
├── app.d.ts            # TypeScript definitions
├── components/         # Reusable components
│   ├── common/         # Shared UI components
│   ├── editor/         # Course editing components
│   ├── review/         # Flashcard review components
│   └── section/        # Section type components
├── layouts/            # Layout components (NavBar, Footer)
├── lib/                # Utility functions and client libraries
│   ├── supabase/       # Supabase client
│   ├── state/          # State management
│   └── actions/        # Svelte actions
├── routes/             # SvelteKit routes and API endpoints
│   ├── api/            # API endpoints
│   ├── auth/           # Authentication routes
│   ├── course/         # Course routes (view, edit)
│   ├── profile/        # User profile routes
│   └── admin/          # Admin routes
├── styles/             # Global styles and variables
└── types/              # TypeScript type definitions
```

## Key Concepts

### Courses

Courses are the main content structure, containing units, which in turn contain sections. Each course has metadata like language taught, course language, and instructor information.

### Units

Units organize the content within a course. Each unit can contain various section types like grammar, vocabulary, and reading.

### Sections

Sections are the actual learning materials within units. The platform supports different section types:

- **Grammar**: For explaining language grammar rules with examples
- **Vocabulary**: For learning new words and phrases through flashcards
- **Reading**: For reading practice with translations

### Flashcard System

The platform includes a spaced repetition system for vocabulary review, tracking user progress and scheduling reviews based on performance.

## License

MIT LICENSE