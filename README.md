<!-- filepath: c:\Users\eduar\Desktop\Projects_VSC\todo-list-ap\README.md -->

<h1 align="center">📝 To-do List Application</h1>

<p align="center">
  <b>A modern, full-stack to-do list app built with Next.js, Supabase, and Tailwind CSS</b><br/>
  <i>Organize your tasks, stay productive, and access your lists anywhere.</i>
</p>

<p align="center">
  <a href="https://nextjs.org/">Next.js</a> •
  <a href="https://supabase.com/">Supabase</a> •
  <a href="https://tailwindcss.com/">Tailwind CSS</a> •
  <a href="https://vercel.com/">Vercel</a>
</p>

---

## ✨ Features

- 🔐 <b>Authentication</b> (sign up, sign in, sign out) via Supabase
- ➕ <b>Add, edit, and delete</b> to-do tasks
- ✅ <b>Mark tasks as complete/incomplete</b>
- 🏷️ <b>Organize tasks</b> by lists and tags
- 📱 <b>Responsive UI</b> with mobile navigation
- 🔔 <b>Toast notifications</b> for user feedback
- 💾 <b>Persistent storage</b> in Supabase database
- 🚀 <b>Ready for deployment</b> on Vercel

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|--------------|-----------------------------------|
| Framework    | Next.js (App Router, TypeScript)  |
| Database/Auth| Supabase                          |
| Styling      | Tailwind CSS                      |
| Deployment   | Vercel                            |

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/LikeMyCoffe/todo-list-ap.git
cd todo-list-ap
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a <code>.env.local</code> file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your <a href="https://app.supabase.com/">Supabase dashboard</a>.

### 4. Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Visit <a href="http://localhost:3000">http://localhost:3000</a> in your browser.

---

## 📁 Project Structure

```text
.
├── app/                # Next.js app directory (routing, pages, layouts)
│   ├── auth/           # Auth callback route for Supabase
│   ├── fonts/          # Custom font files
│   ├── login/          # Login page
│   ├── globals.css     # Global styles (Tailwind + custom)
│   ├── layout.tsx      # Root layout
│   ├── client-layout.tsx # Client-side layout logic (auth redirects)
│   └── page.tsx        # Main to-do app page
├── components/         # Reusable React components (Auth, Toast, MobileNav)
├── lib/                # Supabase client initialization
├── public/             # Static assets (fonts, favicon)
├── middleware.ts       # Next.js middleware for auth/session
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## 📜 Scripts

- `dev` — Start the development server
- `build` — Build the app for production
- `start` — Start the production server
- `lint` — Run ESLint

---

## ☁️ Deployment

The application is ready for deployment on <a href="https://vercel.com/">Vercel</a>:

1. Push your repository to GitHub.
2. Import your project into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Click deploy!

For more information, see the <a href="https://nextjs.org/docs/app/building-your-application/deploying">Next.js deployment documentation</a>.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 📝 Notes

- This project uses the Next.js App Router and React Server Components.
- Authentication and session management are handled via Supabase and Next.js middleware.
- For any issues or contributions, please open an issue or pull request on <a href="https://github.com/LikeMyCoffe/todo-list-ap">GitHub</a>.

---

# ToDoList Next.js Application

## Project Structure Overview

This project is a Next.js application for managing a ToDo list, using Supabase for authentication and data storage. Below is a summary of the purpose of each folder and key file in the workspace:

---

### Root Files
- **middleware.ts**: Custom Next.js middleware for handling authentication or request/response logic.
- **next-env.d.ts**: TypeScript definitions for Next.js, required for type checking.
- **next.config.mjs**: Next.js configuration file.
- **package.json**: Project metadata and dependencies.
- **postcss.config.mjs**: Configuration for PostCSS (used for CSS processing).
- **README.md**: Project documentation (this file).
- **tailwind.config.ts**: Tailwind CSS configuration file.
- **tsconfig.json**: TypeScript configuration file.

---

### Folders

#### app/
- **layout.tsx**: Root layout for the app directory, wraps all pages and provides global structure.
- **page.tsx**: Main landing page of the application.
- **client-layout.tsx**: Client-side layout logic, handles authentication redirects and session checks.
- **globals.css**: (If present) Global CSS for the app directory.
- **favicon.ico**: Application favicon.
- **_shared/**: Shared components or layouts used across multiple routes.
  - **ClientLayout.tsx**: Shared client-side layout logic for authentication/session management.
- **auth/**: Authentication-related routes and logic.
  - **callback/route.ts**: Handles authentication callbacks (e.g., OAuth redirects).
- **fonts/**: (If present) Font files for use in the app directory (should be in public/fonts for production).
- **login/**: Login page and related logic.
  - **page.tsx**: Login page component.

#### components/
- **Auth.tsx**: Authentication form/component for login/signup.
- **MobileNav.tsx**: Mobile navigation component.
- **Toast.tsx**: Toast notification component for user feedback.

#### lib/
- **supabase.js**: Supabase client setup for database and authentication operations.

#### public/
- **fonts/**: Static font files served by Next.js (should be referenced in your font loader).

#### styles/
- **globals.css**: Global CSS styles for the application, imported in the root layout.

---

## Notes
- All configuration files are at the root for compatibility with Next.js and build tools.
- Static assets (fonts) should be referenced from the `public/fonts/` directory.
- The `app/` directory uses the Next.js App Router for routing and layouts.
- The `lib/` directory is for utilities and API clients (e.g., Supabase).
- The `components/` directory contains reusable UI components.

---

## Getting Started
1. Install dependencies: `npm install`
2. Add your Supabase credentials to a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the development server: `npm run dev`

---

For more details, see the comments in each file or folder.
