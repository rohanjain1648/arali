# ⚡ Arali Live CRM - Real-Time Notification & Assignment System

A modern, full-stack CRM application featuring **targeted real-time notification delivery via Socket.IO**, role-based entity ownership/assignments (Companies & Contacts), persistent SQLite storage with Prisma ORM, and automated background workers.

---

## 🌟 Key Features

1. **Role-Based Entity Assignments**:
   - Assign Users to Companies or Contacts with custom titles (e.g. *Account Owner*, *Lead Account Manager*, *Technical Lead*, *Customer Success Director*).
   - Tracks assigner identity, entity relations, and timestamps in SQLite database.

2. **Targeted Live Notifications (WebSockets)**:
   - Built on Socket.IO rooms (`user:${userId}`).
   - **Zero Broadcast Pollution**: When an assignment or notification is triggered for User A, **only User A's socket receives the event**. Other logged-in users do not receive User A's private notifications.
   - Real-time animated toast popups, unread badge count updates, and sound/visual indicators.

3. **Multi-User Session Switcher (Built for Testing & Reviewers)**:
   - Includes an active user selector in the header bar. Reviewers can easily switch between **Alex Vance (Admin)**, **Sarah Jenkins (Sales Rep)**, **Marcus Chen (Enterprise Rep)**, and **Elena Rostova (Customer Success Manager)** in a single browser window or across separate browser windows/tabs to observe real-time targeted notification delivery.

4. **Background Worker Process**:
   - Integrated **Node-Cron** background worker scanning system assignments to generate automated follow-up reminders.
   - Includes a **"Run Background Job"** action button in the navbar to immediately simulate background cron tasks on-demand during live testing.

5. **Notification Persistence & State Management**:
   - Notifications are stored permanently in the database.
   - View unread count, filter by read/unread/type, and mark individual or all notifications as read.

---

## 🏗️ Architecture & Technical Stack

```
 ┌─────────────────────────────────────────────────────────────┐
 │                  React 18 Single Page App                   │
 │   (Vite + Tailwind CSS + Lucide Icons + Socket.IO Client)   │
 └──────────────┬───────────────────────────────┬──────────────┘
                │ HTTP REST                     │ WebSockets (Socket.IO)
                ▼                               ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    Express.js Node Backend                  │
 │  ┌──────────────────┬──────────────────┬─────────────────┐  │
 │  │ Controllers &    │ Notification     │ Socket.IO       │  │
 │  │ API Router       │ Dispatcher       │ Room Manager    │  │
 │  └────────┬─────────┴────────┬─────────┴────────┬────────┘  │
 └───────────┼──────────────────┼──────────────────┼───────────┘
             │                  │                  │
             ▼                  ▼                  ▼
 ┌──────────────────────┐    ┌──────────────────────────────┐
 │ Prisma ORM / SQLite  │    │  Node-Cron Background Worker │
 │ (Users, Companies,   │◄───┤  (Periodic Follow-up Tasks,  │
 │  Contacts, Assigns,  │    │   Account Health Scans)      │
 │  Notifications)      │    └──────────────────────────────┘
 └──────────────────────┘
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Socket.io-client.
- **Backend**: Express.js, Node.js, TypeScript, Socket.IO, Prisma ORM.
- **Database**: SQLite (dev.db) - zero external setup required.
- **Background Worker**: `node-cron` scheduled worker & asynchronous event dispatch.

---

## 🛠️ Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Install Dependencies & Setup Database

From the root directory of the project, run:

```bash
npm run setup
```

*What `npm run setup` does automatically:*
1. Installs server node_modules (`cd server && npm install`).
2. Generates Prisma client and runs database push (`npx prisma db push`).
3. Seeds initial data into `server/prisma/dev.db` (`npm run seed`).
4. Installs client node_modules (`cd client && npm install`).

---

### 2. Start Application in Development Mode

Run the following command in the root folder to start both backend & frontend concurrently:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **WebSocket Server**: `http://localhost:5000/socket.io`

---

## 🧪 Step-by-Step Live Notification Testing Flow

Follow these simple steps to test the real-time notification engine:

### Method A: Testing in Two Browser Windows (Recommended)
1. Open **Window 1** at `http://localhost:3000` and ensure the active user in the top right header is set to **Alex Vance (ADMIN)**.
2. Open **Window 2** in another browser window (or Incognito tab) at `http://localhost:3000` and switch the active user in the top right to **Sarah Jenkins (SALES_REP)**.
3. In **Window 1 (Alex Vance)**:
   - Click the **"Assign Entity"** button (or click **"Assign User"** on a Company card like *Acme Corporation*).
   - Choose **Acme Corporation**, select **Sarah Jenkins** as target user, set role as **"Account Owner"**, and click **"Assign & Dispatch Notification"**.
4. Observe **Window 2 (Sarah Jenkins)**:
   - **Instantly** a toast popup alert appears on Sarah's screen: *"You have been assigned to Acme Corporation as Account Owner by Alex Vance."* without refreshing the page!
   - The notification bell badge increments to **1**.
   - Sarah can click **"Mark as Read"** directly on the toast or in the notification dropdown menu.

### Method B: Testing Single-Tab Session Switching
1. In `http://localhost:3000`, click **"Assign Entity"**.
2. Assign **Stark Tech Solutions** to **Marcus Chen** as **"Lead Account Manager"**.
3. Now switch the active user dropdown in the top right from *Alex Vance* to **Marcus Chen**.
4. Click the Notification Bell or navigate to **Notification Center** tab to see Marcus's unread targeted notification!

### Method C: Testing Background Worker Notifications
1. In the top navbar, click the **"Run Background Job"** button.
2. The background worker asynchronously generates a follow-up reminder notification targeting active assignments.
3. The active assigned user receives a live toast notification from the background worker.

---

## 📊 Database Schema (Prisma)

- **User**: `id`, `name`, `email`, `role` (ADMIN, MANAGER, SALES_REP), `title`, `avatarUrl`, `createdAt`
- **Company**: `id`, `name`, `industry`, `annualRevenue`, `status`, `website`, `phone`, `createdAt`
- **Contact**: `id`, `firstName`, `lastName`, `email`, `phone`, `title`, `companyId`, `createdAt`
- **Assignment**: `id`, `userId` (assignee), `assignedByUserId` (assigner), `role`, `companyId`, `contactId`, `createdAt`
- **Notification**: `id`, `userId` (target recipient), `title`, `message`, `type`, `entityType`, `entityId`, `isRead`, `createdAt`

---

## 💡 Assumptions & Engineering Decisions

1. **Targeted Room Routing**: Used Socket.IO rooms (`socket.join('user:' + userId)`). This ensures strict security & privacy boundaries so users only receive events intended for their specific user ID.
2. **SQLite + Prisma ORM**: Chosen for zero-config local execution. SQLite file (`server/prisma/dev.db`) operates locally without requiring local PostgreSQL/Redis installation.
3. **Dual Trigger Worker Design**: Provided both scheduled `node-cron` worker execution and an instant HTTP trigger button (`/api/background/trigger`) to ensure background jobs are easy to test during evaluation without waiting for cron timers.
