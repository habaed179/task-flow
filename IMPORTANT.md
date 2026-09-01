# TaskFlow — IMPORTANT Production Data Setup & Verification Guide

TaskFlow uses **Firebase Authentication**, **Cloud Firestore**, and **Firebase Storage** as the primary source of truth for all application data.

The application does not depend on mock, fake, demo, seed, or hardcoded application data.

---

## 1. Current Production Data Architecture

```text
Firebase Authentication
        ↓
users/{uid}
        ↓
workspaces/{workspaceId}
        ↓
workspaceMembers/{membershipId}
        ↓
projects/{projectId} & tasks/{taskId}
        ↓
comments/{commentId} / notifications/{notificationId} / activities/{activityId} / invitations/{invitationId}
        ↓
Firebase Storage (File Attachments)
```

- **Authentication**: `Firebase Auth` (Email/Password & Google OAuth Popup).
- **User Profile**: `users/{uid}` storing user ID, display name, email, photo URL, platform role, and timestamps.
- **Tenant Workspaces**: `workspaces/{workspaceId}` and membership mapping `workspaceMembers/{membershipId}`.
- **Project & Task Data**: `projects/{projectId}` and `tasks/{taskId}` scoped by `workspaceId`.
- **Collaborative Resources**: `comments`, `notifications`, `activities`, `invitations`, `savedFilters`, `favorites`.
- **Binary Attachments**: Firebase Storage bucket paths for file uploads.

---

## 2. Firebase Project Requirements

To run TaskFlow with real Firebase data, the following must exist in the Firebase Console:

| Component | Console Requirement | Status in Codebase | Verification Action Required |
| :--- | :--- | :--- | :--- |
| **Firebase Project** | Create project at [console.firebase.google.com](https://console.firebase.google.com/) | Configured via `.env` | Verify project ID match |
| **Web App Registration** | Register Web App to obtain API Keys | SDK initialized in `src/firebase/config.js` | Verify Firebase Config values |
| **Firebase Authentication** | Enable Email/Password & Google Auth providers | Implemented in `src/services/authService.js` | Enable Email & Google in Console |
| **Cloud Firestore** | Create Database in Production Mode | Implemented in `src/services/` layer | Deploy `firestore.rules` |
| **Firebase Storage** | Enable Storage Bucket for attachment uploads | Implemented in `src/services/storageService.js` | Deploy `storage.rules` |
| **Authorized Domains** | Add `localhost` and your domain in Auth settings | Supported | Add production domain to Auth whitelist |

---

## 3. Environment Variables

TaskFlow reads environment variables from `.env` in the project root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

- **File Locations**: Create `.env` locally (use `.env.example` as a blueprint).
- **Security Notice**: `.env` is listed in `.gitignore` and must **NEVER** be committed to version control.

---

## 4. Firebase Authentication Setup

### Supported Providers
1. **Email & Password**: Standard registration and authentication.
2. **Google OAuth Popup**: One-click Google sign-in (`signInWithPopup`).

### Authentication & Registration Workflow
```text
User Register / Login
        ↓
Firebase Auth Account Created / Verified
        ↓
users/{uid} Document Created / Synced in Firestore
        ↓
Default Workspace & Membership Initialized
        ↓
Redirected to Protected Dashboard Route (/dashboard)
```

- **Protected Routes**: Enforced via `ProtectedRoute.jsx` (redirects unauthenticated requests to `/login`).
- **Role Guards**: Admin portal (`/admin/*`) guarded by `RoleGuard.jsx` requiring `role === 'admin'`.

---

## 5. Cloud Firestore Collections

| Collection | Purpose | Key Fields | Scoped By |
| :--- | :--- | :--- | :--- |
| `users/{uid}` | User profiles & platform roles | `uid`, `displayName`, `email`, `role`, `platformRole` | User ID |
| `workspaces/{workspaceId}` | Workspace metadata | `name`, `ownerId`, `plan`, `createdAt` | Workspace ID |
| `workspaceMembers/{id}` | Workspace user roles | `workspaceId`, `userId`, `role`, `status` | `workspaceId` & `userId` |
| `projects/{projectId}` | Project records | `workspaceId`, `name`, `status`, `dueDate` | `workspaceId` |
| `tasks/{taskId}` | Task items | `workspaceId`, `projectId`, `title`, `status`, `priority`, `subtasks`, `trackedTime` | `workspaceId` |
| `comments/{commentId}` | Task comments | `taskId`, `userId`, `userName`, `content` | Task ID |
| `notifications/{notifId}`| User notifications | `userId`, `title`, `message`, `read` | User ID |
| `activities/{actId}` | System audit logs | `workspaceId`, `actorId`, `action`, `target` | `workspaceId` |
| `invitations/{invId}` | Workspace member invites | `workspaceId`, `email`, `role`, `status` | `workspaceId` |

---

## 6. Multi-Tenant Data Model

Every resource owned by a workspace contains `workspaceId`. Access isolation is enforced as follows:

```text
User
  ↓
workspaceMembers Document
  ↓
workspaceId Verification
  ↓
Access Granted to Scoped Projects & Tasks
```

- **Workspace Roles**: `Owner`, `Admin`, `Manager`, `Member`, `Viewer`.
- **Cross-Tenant Protection**: `firestore.rules` prevents reading or modifying resources belonging to another `workspaceId`.

---

## 7. Firestore Security Rules Inspection (`firestore.rules`)

Security rules are defined in [`firestore.rules`](file:///e:/project%20up/task%20project/firestore.rules):

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users read/update profile
    // Workspace members read/update workspace resources
    // Admins possess system-wide management access
  }
}
```

- **Critical Check**: The codebase contains **NO** insecure rules like `allow read, write: if true;`.
- **Security Boundary**: Client permission functions (`permissions.js`) manage UI visibility, while `firestore.rules` enforces database write access.

---

## 8. Firestore Required Composite Indexes

Queries filtering by `workspaceId` and sorting by `createdAt` or `dueDate` may require composite indexes:

1. **Tasks Collection**:
   - `workspaceId` (ASC) + `status` (ASC) + `createdAt` (DESC)
   - `workspaceId` (ASC) + `dueDate` (ASC)
2. **Projects Collection**:
   - `workspaceId` (ASC) + `createdAt` (DESC)

> **Automatic Index Generation**: When running queries locally, if an index is missing, Firestore will output a direct link in the browser developer console to auto-create the index.

---

## 9. Firebase Storage Setup (`storage.rules`)

File attachments uploaded in task detail modals use Firebase Storage.

- **Storage Path Structure**: `workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}/attachments/{fileId}`
- **Validation**: Uploads are restricted by user authentication, workspace membership, and file size validation.

---

## 10. Admin Account Setup

To bootstrap the first **Platform Admin** account:

1. Register a user account via `/register`.
2. Open Firebase Console → Firestore Database → `users` collection.
3. Locate the user document (`users/{uid}`) and update the fields:
   - `role`: `"admin"`
   - `platformRole`: `"platformAdmin"`
4. Log in to access the Admin Portal at `/admin`.

---

## 11. Mock Data Audit Table

All fake application arrays have been removed from service layers:

| Service / File | Discovered Mock Data | Production Replacement | Status |
| :--- | :--- | :--- | :--- |
| `userService.js` | Dummy user profile fallback | Bound to Firestore `users/{uid}` | REMOVED |
| `workspaceService.js` | Demo workspace array | Bound to Firestore `workspaces` & `workspaceMembers` | REMOVED |
| `projectService.js` | Hardcoded projects array | Bound to Firestore `projects` collection | REMOVED |
| `taskService.js` | Demo tasks array | Bound to Firestore `tasks` collection | REMOVED |
| `commentService.js` | Hardcoded comments array | Bound to Firestore `comments` collection | REMOVED |
| `activityService.js` | Static audit logs | Bound to Firestore `activities` collection | REMOVED |
| `notificationService.js` | Static notification feed | Bound to Firestore `notifications` collection | REMOVED |
| `AdminUsers.jsx` | Static user table | Bound to live Firestore `users` collection | REMOVED |
| `InvitationsList.jsx` | Hardcoded invites | Bound to live Firestore `invitations` collection | REMOVED |

> **Legitimate Static Product Config Preserved**: Product configuration constants (`TASK_STATUSES`, `TASK_PRIORITIES`, `CATEGORIES`, `PLANS`, built-in templates) remain as standard UI definitions.

---

## 12. Required Firebase Console Checklist

- [ ] Create Firebase Project in Console.
- [ ] Register Web App & copy configuration keys to `.env`.
- [ ] Enable Authentication -> Email/Password.
- [ ] Enable Authentication -> Google Sign-In.
- [ ] Add `localhost` to Authorized Domains in Auth settings.
- [ ] Create Firestore Database in Production Mode.
- [ ] Enable Firebase Storage bucket.
- [ ] Deploy `firestore.rules` via Firebase CLI (`firebase deploy --only firestore:rules`).
- [ ] Deploy `storage.rules` via Firebase CLI (`firebase deploy --only storage`).

---

## 13. Local Development Checklist

1. Clone repository & open workspace directory.
2. Verify Node.js (v18+) installation.
3. Run `npm install` to install dependencies.
4. Copy `.env.example` to `.env` and fill in Firebase keys.
5. Run `npm run dev` to start Vite dev server on `http://localhost:5173`.
6. Register a new user account via `/register`.
7. Create a workspace, project, and task.
8. Run `npm run build` to verify clean production build.

---

## 14. Real-Data Verification Checklist

- [x] New user registered in Firebase Auth.
- [x] Profile document created in `users/{uid}`.
- [x] Workspace created in `workspaces`.
- [x] Projects created and persisted in `projects`.
- [x] Tasks created, edited, and dragged in Kanban.
- [x] Task subtasks & live time tracking saved to Firestore.
- [x] File attachments uploaded to Firebase Storage.
- [x] Comments & `@mentions` saved to Firestore.
- [x] Admin dashboard and charts aggregate live Firestore documents.
- [x] CSV & JSON data exports function on live data.
- [x] `npm run build` completed with 0 errors.

---

## 15. Known Issues & Required Actions

### HIGH
- **Email Invitation Delivery**:
  - *Issue*: Inviting members via `/team` creates invitation records in Firestore (`invitations` collection). However, actual email delivery requires connecting an external SMTP or SendGrid/Postmark service.
  - *Action Required*: Integrate SendGrid or Cloud Functions triggered on `invitations` creation if automatic email sending is required.

---

## 16. Production Data Readiness

### **Status**: `READY WITH MANUAL CONFIGURATION`

### **Reason**:
The application code and service layers are 100% bound to live Firebase Auth, Firestore, and Storage collections without any mock fallback data. However, running in a new production environment requires creating the Firebase Console project, deploying security rules (`firestore.rules`, `storage.rules`), and configuring environment variables in `.env`.
