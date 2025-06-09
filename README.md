<!-- filepath: c:\Users\eduar\Desktop\Projects_VSC\todo-list-ap\README.md -->

<p align="center">
  <img src="https://raw.githubusercontent.com/LikeMyCoffe/todo-list-ap/main/public/favicon.ico" width="64" alt="To-do List Logo" />
</p>

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
