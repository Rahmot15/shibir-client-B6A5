# 🚀 Shibir — Digital Reporting & Management Platform

<div align="center">

A modern web-based management & reporting system developed to digitize organizational workflows, reporting, syllabus tracking, and role management.

</div>

---

# 📖 Overview

**Shibir** হলো একটি আধুনিক ওয়েব-ভিত্তিক management & reporting platform, যা মূলত :contentReference[oaicite:0]{index=0} এর সাংগঠনিক কার্যক্রমকে ডিজিটালাইজ করার উদ্দেশ্যে তৈরি করা হয়েছে।

এই প্রজেক্টের মূল লক্ষ্য ছিল traditional manual report book system-কে একটি smart, centralized & scalable digital platform-এ রূপান্তর করা, যেখানে সংগঠনের বিভিন্ন স্তরের সদস্যরা তাদের daily activities, reports, syllabus progress, exams এবং ব্যক্তিগত উন্নয়ন সহজভাবে manage করতে পারে।

সিস্টেমটি এমনভাবে design করা হয়েছে যাতে প্রতিটি পর্যায়ের ব্যবহারকারী —
**সমর্থক, কর্মী, সাথী ও সদস্য** — নিজ নিজ কার্যক্রমের রিপোর্ট submit করতে পারে এবং দায়িত্বশীলরা সহজে monitoring, tracking ও management করতে পারে।

---

# 🎯 Main Objectives

- Manual reporting workflow-কে সম্পূর্ণ digital platform-এ রূপান্তর করা
- Daily organizational activities সহজভাবে সংরক্ষণ করা
- User progress & performance tracking
- Role-based syllabus management
- Exam & role upgrade workflow automation
- Smart organizational management system তৈরি করা

---

# ✨ Core Features

## 🔐 Multi-Role Management System

The platform supports multiple user roles with dedicated dashboards and isolated data management.

### Supported Roles

- সমর্থক (Supporter)
- কর্মী (Worker)
- সাথী (Associate)
- সদস্য (Member)
- Admin

Each role has:
- Separate dashboard
- Role-based access control
- Protected routes
- Independent report management

---

## 📊 Digital Reporting System

The reporting system is the core feature of this platform.

Previously, reports were maintained manually using physical report books.
This project digitizes the entire workflow into an online centralized system.

### Report Categories

#### 🔹 সমর্থক রিপোর্ট
- দৈনিক প্রতিবেদন system

#### 🔹 কর্মী / সাথী / সদস্য রিপোর্ট
Although these roles share a similar report structure, their data is stored separately and securely.

### Reporting Features

- Daily report submission
- Activity tracking
- Personal development monitoring
- Organizational progress tracking
- Performance evaluation

---

## 📈 Automatic Average Calculation

The system automatically calculates report averages based on submitted data.

This helps দায়িত্বশীলরা easily monitor:
- Consistency
- Activity performance
- User engagement
- Monthly progress

---

## 🕘 Report History System

Users can access previous reports and monthly history.

### Features
- Previous month history
- Progress tracking
- Continuous performance monitoring
- Activity review system

---

## 📝 Note Management System

Users can create and manage personal notes using a rich text editor.

### Features
- Personal notes
- Rich text formatting
- Important information storage
- Organized note management

---

## 📚 Syllabus Tracking System

The platform includes a role-based syllabus management & tracking system.

Users can:
- Track syllabus progress
- Monitor completed topics
- Access PDF syllabus materials
- Follow role-based study guidelines

---

# 📖 Role-Based Syllabus

## 🔹 সমর্থক → কর্মী
Required study materials for becoming a কর্মী.

## 🔹 কর্মী → সাথী
সাথী সহায়িকা syllabus tracking.

## 🔹 সাথী → সদস্য
সদস্য সহায়িকা management system.

## 🔹 সদস্য
Advanced organizational syllabus & higher study materials.

---

# 🧪 Online Exam System

A complete exam workflow system is implemented for role upgrades.

## Exam Workflow

### ✅ Step 1 — MCQ Examination

- Users must complete MCQ exam
- Minimum passing score: **70%**
- Eligible users can proceed to Viva

### ✅ Step 2 — Viva Examination

- Viva conducted with দায়িত্বশীলরা
- Real-time communication support
- Role upgrade managed after successful completion

---

# 🔐 Authentication & Security

- JWT Authentication
- Role-Based Authorization
- Protected Dashboard Routes
- Secure API Structure
- Modular Backend Architecture

---

# 🎨 UI/UX Features

- Responsive Design
- Modern Dashboard Interface
- Mobile-Friendly Layout
- Clean User Experience
- Interactive UI Components
- Smooth Animation with Framer Motion

---

# 🛠 Tech Stack

## Frontend (`shibir_client`)

| Technology | Usage |
|---|---|
| Next.js | Frontend Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Shadcn/UI | UI Components |
| Framer Motion | Animation |
| Tiptap Editor | Rich Text Editor |

---

## Backend (`shibir_server`)

| Technology | Usage |
|---|---|
| Node.js | Runtime |
| Express.js | Backend Framework |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |

---

# 📂 Project Structure

## Backend Structure


src/
├── modules/
│   ├── Authentication/
│   ├── User/
│   ├── SupporterReport/
│   ├── WorkerReport/
│   ├── Note/
│   ├── Exam/
│   └── Syllabus/
│
├── middlewares/
├── routes/
└── utils/

---

## Frontend Structure

app/
├── (commonLayout)/
├── (dashboardLayout)/
│   ├── @admin/
│   ├── @supporter/
│   ├── @worker/
│   ├── @associate/
│   └── @member/
│
components/
├── ui/
├── dashboard/
└── shared/

---

# 🚀 Getting Started

## 📦 Prerequisites

Before running this project locally, make sure you have installed:

* Node.js (v18+)
* pnpm
* PostgreSQL

---

# ⚙️ Backend Setup

```bash
cd shibir_server

pnpm install

# Configure environment variables
DATABASE_URL=your_database_url

pnpm prisma generate
pnpm prisma migrate dev

pnpm dev
```

---

# ⚙️ Frontend Setup

```bash
cd shibir_client

pnpm install

# Configure environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000

pnpm dev
```

---

# 🌟 Future Improvements

## 🤖 AI Chatbot Integration

* RAG-based AI assistant
* Syllabus-based Q&A
* Smart reporting assistance
* Organizational knowledge support

---

## 💬 Real-Time Chat System

Using Socket.IO for:

* Live messaging
* Support system
* Instant notifications
* Real-time communication

---

## 📚 Online Book Store

Future integration includes:

* কিশোরকণ্ঠ
* Organizational books
* সহায়িকা books

### Payment Integration

* SSLCommerz
* Stripe

---

# 🔗 Links

## 🌐 Live Demo

[\[Add Live Demo Link\]](https://shibir-client.vercel.app)

## 💻 Client Repository

[\[Add Client GitHub Repository Link\]](https://github.com/Rahmot15/shibir-client-B6A5.git)

## 🖥 Server Repository

[\[Add Server GitHub Repository Link\]](https://github.com/Rahmot15/shibir-server-B6A5.git)

---

# 📈 Vision

The vision of this project is to build a scalable, centralized, and modern digital organizational ecosystem that simplifies reporting, tracking, communication, learning, and management workflows.

---

# 👨‍💻 Author

Developed with ❤️ by **[Rahmatullah]**

```
```
