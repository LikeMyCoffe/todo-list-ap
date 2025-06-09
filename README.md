# To-do List Application

A university JavaScript project — To-do list application built using **Next.js** (TypeScript), styled with **CSS** (via Tailwind CSS), leveraging **Supabase** for the database, and intended for deployment on **Vercel**.

---

## Features

- Add, edit, and delete to-do items
- User authentication via Supabase
- Persistent storage in Supabase database
- Modern, responsive UI with Next.js and Tailwind CSS
- Ready for deployment on Vercel

---

## Tech Stack

- **Framework:** Next.js (TypeScript)
- **Database:** Supabase
- **Styling:** Tailwind CSS, raw CSS
- **Deployment:** Vercel

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LikeMyCoffe/todo-list-ap.git
cd todo-list-ap
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your [Supabase dashboard](https://app.supabase.com/).

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `/app` — App directory (Next.js routing, pages, etc.)
- `/components` — Reusable React components
- `/lib` — Utilities (Supabase client, helpers)
- `/public` — Static files and assets
- `middleware.ts` — Middleware for Next.js (e.g., authentication)
- `tailwind.config.ts` — Tailwind CSS configuration
- `next.config.mjs` — Next.js configuration

---

## Scripts

- `dev` — Start the development server
- `build` — Build the app for production
- `start` — Start the production server
- `lint` — Run ESLint

---

## Deployment

The application is ready for deployment on [Vercel](https://vercel.com/):

1. Push your forked repo to GitHub.
2. Import your project into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Click deploy!

For more information: [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## Notes

- This documentation is generated from a partial API listing and may not cover every file. Explore the full repo on [GitHub](https://github.com/LikeMyCoffe/todo-list-ap/tree/main) for all details.
