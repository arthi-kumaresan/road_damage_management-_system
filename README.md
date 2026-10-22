# WEB-BASED ROAD DAMAGE REPORTING AND MAINTENANCE TRACKING SYSTEM

A production-ready full-stack **MERN** web application connecting citizens, civic road authorities, and field maintenance teams for transparent road hazard resolution.

---

## 🌟 Key Features

### 1. Citizen Module
- **JWT-Secured Authentication:** Citizen registration, login, and protected profiles.
- **Damage Reporting Form:** Submits road name, locality, description, damage classification, and severity.
- **Evidence Photos:** Multi-file image upload stored locally on the server.
- **GPS Coordinates Detection:** Native browser Geolocation API integration to capture pinpoint coordinates.
- **Live Complaint Tracking:** Timeline tracking from `SUBMITTED` &rarr; `UNDER REVIEW` &rarr; `VERIFIED` &rarr; `ASSIGNED` &rarr; `WORK IN PROGRESS` &rarr; `REPAIRED` &rarr; `COMPLETED`.
- **Citizen Feedback & Reopen:** Star ratings, remarks, and ability to trigger `REOPENED` status if repairs are unsatisfactory.

### 2. Admin & Authority Operations
- **Analytical Operations Center:** Real-time KPI summaries, status breakdowns, hazard distributions, and average turnaround time calculation.
- **Complaint Verification & Rejection:** Verify complaints, reject with explicit reasons, and override priorities.
- **Automated Priority Engine:** Computes a composite score (0-100) and maps to `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` based on severity, damage type, age, and duplicate clustering.
- **Duplicate Detection & Merging:** Identifies duplicate reports on the same road/locality and merges them while tracking citizen community participation.
- **Road Condition Score (0-100 Index):** Categorizes roads as Good (0-30), Moderate (31-60), Poor (61-80), or Critical (81-100).
- **Fleet & Maintenance Team Management:** Register squads, assign operational zones, and dispatch tasks.

### 3. Maintenance Team Module
- **Task Dashboard:** Crew-specific view of assigned repairs.
- **Field Execution Workflow:** Transition tasks to `WORK IN PROGRESS` and `REPAIRED`.
- **Side-by-Side Photographic Evidence:** Upload before-repair and after-repair verification photographs.

### 4. Advanced Modular AI Ready Pipeline
- Decoupled endpoint `/api/ai/detect-damage` for simulated or integrated computer vision damage classification with confidence scoring.

---

## 🏗️ Technology Stack

- **Frontend:** React.js (Vite), React Router v6, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **File Storage:** Local server disk storage via `multer` (No Cloudinary dependency)
- **API Architecture:** RESTful JSON APIs

---

## 📁 Project Structure

```
PROJECT_ROAD/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT session state)
│   │   ├── pages/              # Landing, Login, Register, CitizenDashboard,
│   │   │                       # ReportDamage, ComplaintDetails,
│   │   │                       # AdminDashboard, AdminComplaints, AdminUsers,
│   │   │                       # MaintenanceDashboard, About
│   │   ├── services/           # Axios API configuration & Interceptor
│   │   ├── App.jsx             # Main Router definition
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Express Backend
│   ├── config/                 # db.js (MongoDB Connection)
│   ├── controllers/            # Auth, Complaints, Maintenance, Analytics, Users, Feedback, Notifications
│   ├── middleware/             # Auth (JWT & Roles), Uploads (Multer), Error handlers
│   ├── models/                 # User, Complaint, MaintenanceTeam, Notification, Feedback
│   ├── routes/                 # Express REST route files
│   ├── services/               # Priority calculation, Duplicate detection, Road condition scores
│   ├── uploads/                # Local storage for road damage photos
│   ├── utils/                  # seed.js (Demo dataset)
│   ├── server.js               # Express application entrypoint
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started & Execution

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI string.

---

### 2. Backend Setup
1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Verify environment configuration (`.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/road_damage_db
   JWT_SECRET=supersecretjwtkeyforroaddamage
   CLIENT_URL=http://localhost:5173
   ```
3. Populate database with realistic demonstration accounts and sample complaints:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *Server will run at `http://localhost:5000`*

---

### 3. Frontend Setup
1. In a separate terminal window, open the `client` directory:
   ```bash
   cd client
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin / Authority** | `admin@roadcare.gov` | `password123` | Full dashboard, complaint verification, team assignment, priority overrides, analytics |
| **Citizen** | `citizen@example.com` | `password123` | Report road damage, track reports, give feedback, reopen complaints |
| **Maintenance Lead**| `teamlead@roadcare.gov`| `password123` | Task dashboard, repair status update, before & after photo evidence upload |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create new citizen/user account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Fetch authenticated user profile

### Complaints
- `POST /api/complaints` - Submit report with photos & coordinates (Citizen)
- `GET /api/complaints` - Fetch complaints with search, filter, and pagination
- `GET /api/complaints/:id` - Fetch complaint details and timeline audit trail
- `PUT /api/complaints/:id/status` - Update status (Verify, Reject, Close) (Admin)
- `PUT /api/complaints/:id/assign` - Assign to a maintenance fleet (Admin)
- `PUT /api/complaints/:id/priority` - Manually override priority (Admin)
- `POST /api/complaints/:id/merge` - Merge duplicate complaints (Admin)

### Maintenance Operations
- `GET /api/maintenance/tasks` - Fetch assigned tasks for logged-in crew
- `POST /api/maintenance/tasks/:id/repair` - Update progress with before/after photos

### Citizen Feedback & Reopening
- `POST /api/feedback/:complaintId` - Submit satisfaction rating & reopen if needed
- `GET /api/feedback/:complaintId` - Fetch all feedback on complaint

### Analytics & Road Scores
- `GET /api/analytics/dashboard` - Global metrics, status and damage type charts
- `GET /api/analytics/roads` - Calculated Road Condition Index (0-100) per road

### Notifications
- `GET /api/notifications` - In-app notification list
- `PUT /api/notifications/read-all` - Mark all notifications as read

### AI Detection (Modular Demo Service)
- `POST /api/ai/detect-damage` - Modular AI damage classifier endpoint
