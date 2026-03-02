# 🏦 Insurance & Mutual Fund CRM — Complete Unified System v3.0

**ALL modules fully integrated in one system:** Roles, Employees, Tasks, Clients, Policies, Claims, Reminders, Targets

---

## 🚀 Quick Start

```bash
# Extract
tar -xzf insurance-crm-unified.tar.gz && cd insurance-crm-unified

# Backend
cd backend && npm install && cp .env.example .env
# Edit .env: set MONGODB_URI
npm run seed && npm run dev    # → :5000

# Frontend (new terminal)
cd ../frontend && npm install && cp .env.example .env
npm run dev                     # → :3000
```

**Login:** arun@crm.com / password123

---

## 📦 What's Included

✅ Role & Permission Management (10 granular permissions)
✅ Employee Registration with bcrypt password hashing
✅ Task Management with full transfer workflow (accept/decline)
✅ Client Records Management
✅ Policy Lifecycle Tracking (renewals, maturity)
✅ Claims Processing Engine (status history)
✅ Smart Reminders (8 types)
✅ Sales Target Management (achievement tracking)
✅ Complete REST API (9 resource endpoints + dashboard)
✅ React Dashboard UI (9 modules)

---

## 🌐 API Endpoints

**Base:** http://localhost:5000/api

- `/roles` — Role & permission management
- `/employees` — Register, assign roles, stats
- `/tasks` — Assign, transfer (with approve), notes
- `/clients` — Client records
- `/policies` — Life/Health/Motor/Mutual Fund policies
- `/claims` — Claim processing with status tracking
- `/reminders` — Renewals, birthdays, follow-ups
- `/targets` — Sales targets with achievement %
- `/reports/dashboard` — Aggregated stats

---

## 🗂️ Key Features

### Task Transfer Workflow
1. Employee requests transfer → status: "Transfer Requested"
2. Target employee receives notification
3. Accept → task reassigned | Decline → stays with original
4. Full history tracked with timestamps & reasons

### Role-Based Access Control
10 permissions: all, clients, policies, claims, reminders, targets, reports, tasks, employees, roles

### Auto-Sync Counters
Employee activeTasks & completedTasks auto-sync via Mongoose hooks

### Business Logic Protection
- Cannot delete roles with assigned employees
- Cannot delete employees with active tasks
- Only one pending transfer per task

---

## 🛠️ Tech Stack

Backend: Node.js 18, Express, MongoDB, Mongoose, bcryptjs
Frontend: React 18, Vite, Tailwind CSS, Axios
Tools: ExcelJS, PDFKit, Morgan

---

## 📊 Sample Data (after seed)

- 4 Roles: Admin, Manager, Senior Agent, Agent
- 4 Employees: Arun, Priya, Vivek, Sneha
- 2 Clients: Ajay Verma, Pooja Gupta
- 1 Policy: LIC Jeevan Anand (₹50K)
- 1 Claim: Medical (₹75K)
- 1 Reminder: LIC renewal
- 1 Target: Quarterly (₹50L)
- 2 Tasks: Follow-up, Claim processing

---

## 🔐 Security

✅ bcrypt password hashing (10 rounds)
✅ Rate limiting (100 req/15min)
✅ Helmet security headers
✅ CORS restricted to FRONTEND_URL
✅ Input validation (Mongoose + express-validator)

---

## 📁 Structure

```
backend/src/
  server.js
  config/ (database, seed)
  models/ (Role, Employee, Task, Client, OtherModels)
  controllers/ (roleController, employeeController, taskController, etc.)
  routes/ (index.js - all 9 endpoints)

frontend/src/
  App.jsx (9-module navigation)
  services/api.js (Axios client)

docs/ (6 markdown guides)
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection | Check mongod running or Atlas URI |
| Email exists | Use unique email per employee |
| Cannot delete role | Reassign employees first |
| Cannot delete employee | Complete their tasks first |
| CORS errors | Set FRONTEND_URL in backend .env |

---

## 📚 Full Documentation

See docs/ folder:
1. Installation Guide
2. API Reference (all endpoints)
3. User Guide (roles, employees, tasks)
4. Architecture (system design + DB schema)
5. Deployment Guide (VPS, Docker, Cloud)
6. FAQ & Changelog

---

Built for Insurance Professionals 🚀

# incurence-crm-merge
