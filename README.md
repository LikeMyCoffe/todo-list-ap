<!-- filepath: c:\Users\eduar\Desktop\Projects_VSC\todo-list-ap\README.md -->

# 📝 ToDoList Application

A modern, full-stack to-do list app built with Next.js, Supabase, and Tailwind CSS. Organize your tasks, manage lists, and stay productive with a clean, desktop-focused interface.

---

## ✨ Features

- 🔐 **Authentication** (sign up, sign in, sign out) via Supabase
- ➕ **Add, edit, and delete** to-do tasks
- ✅ **Mark tasks as complete/incomplete**
- 📋 **Organize tasks by lists** (with robust list management and deletion)
- 🖥️ **Desktop-only UI** (no mobile navigation or mobile-specific code)
- 🔔 **Toast notifications** for user feedback
- 💾 **Persistent storage** in Supabase database
- 🚀 **Ready for deployment** on Vercel

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

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your [Supabase dashboard](https://app.supabase.com/).

### 4. Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
.
├── app/                # Next.js app directory (routing, pages, layouts)
│   ├── auth/           # Auth callback route for Supabase
│   ├── login/          # Login page
│   ├── globals.css     # Global styles (Tailwind + custom)
│   ├── layout.tsx      # Root layout
│   ├── client-layout.tsx # Client-side layout logic (auth redirects)
│   └── page.tsx        # Main to-do app page
├── components/         # Reusable React components (Auth, Toast)
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

The application is ready for deployment on [Vercel](https://vercel.com/):

1. Push your repository to GitHub.
2. Import your project into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Click deploy!

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

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
- All code is desktop-only; all mobile, tags, and settings code has been removed.
- For any issues or contributions, please open an issue or pull request on [GitHub](https://github.com/LikeMyCoffe/todo-list-ap).

---

## Quick Reference: Key Files

- `app/page.tsx`: Main UI, list logic, task CRUD, left/right panel rendering
- `app/layout.tsx`: Root layout, font loading, and structure
- `app/client-layout.tsx`: Handles client-side auth/session redirects
- `components/Auth.tsx`: Authentication form (login/signup)
- `components/Toast.tsx`: Toast notification component
- `lib/supabase.js`: Supabase client setup
- `middleware.ts`: Next.js middleware for session/auth
- `public/fonts/`: Static font files (GeistVF.woff, GeistMonoVF.woff)

---

## License

MIT
