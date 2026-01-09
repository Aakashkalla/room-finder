# RoomFinder

RoomFinder is a full-stack web application that allows users to find rental rooms and enables property owners to list and manage their rooms with images, pricing, and preferences.

This project was built as part of an internship assignment and focuses on clean architecture, role-based access, and a polished user experience.

---

## 🔗 Live Demo
https://room-finder-one.vercel.app

---

## ✨ Features

### Authentication & Roles
- Email-based magic link authentication using Supabase
- Role selection on first login (Room Finder / Room Owner)
- Role-based access control for protected pages

### Room Owner
- Add new room listings
- Upload multiple room images
- View all rooms added by the owner
- Delete rooms (with automatic image cleanup from storage)

### Room Finder
- Browse all available rooms
- Filter rooms by:
  - Location
  - Price range
  - Property type
  - Tenant preference
- Clean, responsive card-based layout

### UI & UX
- Fully responsive design (mobile & desktop)
- Dark, minimal, and consistent UI
- Smooth loading states and empty states
- SEO-friendly public landing page

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend / Services**
- Supabase
  - Authentication (Magic Link)
  - PostgreSQL database
  - Storage for room images
  - Row Level Security (RLS)

**Deployment**
- Vercel

---

## 🔐 Security & Data Integrity

- Row Level Security policies for:
  - Room ownership
  - Public room visibility
  - Secure image uploads
- Images are automatically deleted from storage when a room is removed
- Database constraints to prevent invalid data insertion

---

## 🚀 Getting Started (Local Setup)

1. Clone the repository
```bash
git clone <your-repo-url>
cd room-finder
```

2. Install Dependencies
```bash
npm install
```

3. Create a .env.local file
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

5. Open http://localhost:3000

---
<br>

# Notes
- Authentication uses email magic links (no passwords).
- The home route (/) acts as an authentication and role-based router.