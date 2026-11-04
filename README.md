# StockFlow - Multi-Tenant SaaS Inventory Management System

> Built to fulfill the **StockFlow Phase 1 (6-Hour Build PRD)** specifications.

---

## 🛠 Tech Stack
- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide Icons + React Router v6
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JWT tokens + bcrypt password hashing + organization-level tenant isolation

---

## 🌟 Implemented Features & PRD Alignment

| Requirement ID | Feature | Implementation Details |
|---|---|---|
| **FR-1** | **Signup & Login** | Register with Email, Password, Confirm Password, and Organization Name. Bcrypt password hashing and JWT authentication. |
| **FR-2** | **Organization Context** | Every account is linked to an `Organization`. All products and settings are strictly scoped by `organizationId`. |
| **FR-3** | **Product Model** | Fields: Name, SKU (unique per org), Description, Quantity on Hand (int), Cost Price, Selling Price, Low Stock Threshold, Timestamps. |
| **FR-4** | **Product CRUD** | Create product, Table list with live search (Name or SKU), Edit product, Delete product with confirmation modal. |
| **FR-5** | **Simple Stock Updates** | Direct edit in product form + Quick inline adjust modal (+/- units with notes) preventing negative stock. |
| **FR-6** | **Dashboard Overview** | Total Products count, Total Stock on Hand units, Low Stock count & dedicated low stock table. |
| **FR-7** | **Global Settings** | Organization-wide **Default Low Stock Threshold** (default: 5) inherited by any product without a custom threshold. |

---

## 📁 Project Structure

```
Stock_Flow/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js (Mongoose connection), env.js
│   │   ├── constants/       # httpStatusCodes.js, defaultSettings.js
│   │   ├── controllers/     # authController, productController, dashboardController, settingsController
│   │   ├── middlewares/     # authMiddleware, tenantMiddleware, errorMiddleware
│   │   ├── models/          # Organization.js, User.js, Product.js
│   │   ├── routes/          # authRoutes, productRoutes, dashboardRoutes, settingsRoutes, index.js
│   │   ├── utils/           # apiResponse, apiError, jwt
│   │   ├── validators/      # authValidator, productValidator, settingsValidator
│   │   ├── app.js           # Express app with helmet, cors, morgan, json parser
│   │   └── server.js        # Server bootstrap & graceful shutdown
│   ├── .env                 # Port, MONGODB_URI=mongodb://localhost:27017/stockflow, JWT_SECRET
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common (Button, Input, Modal, Badge, Card, Table, ConfirmDialog)
│   │   │                    # Layout (Navbar, Sidebar, DashboardLayout)
│   │   │                    # Products (ProductFilterBar, ProductFormModal, StockAdjustModal)
│   │   ├── context/         # AuthContext, NotificationContext (Toast alerts)
│   │   ├── hooks/           # useAuth, useDebounce
│   │   ├── pages/           # LoginPage, SignupPage, DashboardPage, ProductsPage, SettingsPage
│   │   ├── routes/          # AppRoutes, ProtectedRoute
│   │   ├── services/        # api.js, authService, productService, dashboardService, settingsService
│   │   └── styles/          # index.css (Tailwind CSS directives)
│   ├── vite.config.js       # Proxy /api to backend (http://localhost:5000)
│   └── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18+ (verified with v22.17.0)
- **MongoDB**: Running locally on `mongodb://localhost:27017/` (or specify MongoDB Atlas URI in `backend/.env`)

### 2. Start the Backend API
```bash
cd backend
npm run dev
```
*Backend runs at:* `http://localhost:5000` (API: `http://localhost:5000/api/v1`)

### 3. Start the Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 🧪 Quick Test Walkthrough
1. Open `http://localhost:5173` in your browser.
2. Click **Sign up for free** and register:
   - **Organization Name**: `Apex Retail`
   - **Email**: `admin@apex.com`
   - **Password**: `password123`
3. You will immediately land on the **Dashboard** displaying 0 products and healthy inventory status.
4. Navigate to **Products**:
   - Click **Add Product** to add an item (e.g. Name: `Wireless Mouse`, SKU: `WM-01`, Quantity: `3`, Threshold: `5`).
   - Notice the status badge switches automatically to **Low Stock (≤ 5)**.
5. Return to **Dashboard**:
   - See the KPI summary card updated to `1 Product`, `3 Units`, `1 Low Stock Item`.
   - The item appears in the **Low Stock Items** alert table.
6. Click **Adjust** on the item and add `+10 Units`.
   - Stock increases to `13 Units`, and the low stock alert clears automatically!
