# Pressed & Co. — Online Dry Cleaners Management System

Full MERN stack build of the "Online Dry Cleaners Management System" project
(Customer, Admin, Order Management, Billing and System modules), based on the
uploaded proposal.

## Stack
- **Frontend:** React (plain JavaScript, React Router, Axios) — light editorial theme, no TypeScript
- **Backend:** Node.js + Express (REST API)
- **Database:** MongoDB + Mongoose
- **Auth:** JWT — customers register/log in normally; admin uses a fixed dummy login

## Folder layout
```
dry-cleaners-mern/
  backend/     Express API, MongoDB models, routes, controllers
  frontend/    React app (Create React App)
```

## 1. Backend setup

```
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your real values (dummy ones are already filled in so it
runs immediately):

```
MONGO_URI=mongodb://127.0.0.1:27017/dry_cleaners_db   # replace with your Atlas URI
PORT=5000
JWT_SECRET=dryclean_dummy_jwt_secret_replace_me         # replace with a long random string
ADMIN_USERNAME=Admin123
ADMIN_PASSWORD=123456
```

Then run:
```
npm run dev
```
The API starts on `http://localhost:5000`. It connects to MongoDB using
`MONGO_URI` — as soon as you drop in your own connection string (Atlas or
local), nothing else needs to change.

## 2. Frontend setup

```
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000` and talks to the API at
`http://localhost:5000/api` by default. To point it elsewhere, create
`frontend/.env` with:
```
REACT_APP_API_URL=http://your-api-host/api
```

## 3. Customer support chatbot (optional — free Gemini API)

A floating chat widget on the customer side (bottom-right, every page except
`/admin/*`) answers questions about what the site is, how it works, and its
services/pricing, and can look up a real order by number using the
`track_order` tool.

To enable it, get a **free** key at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) (no card
needed) and add it to `backend/.env`:
```
GEMINI_API_KEY=your-real-gemini-key-here
GEMINI_MODEL=gemini-3.1-flash-lite
```
Without a real key, the widget still renders but replies with a friendly
"not configured yet" message instead of erroring out. The free tier has
per-minute rate limits — plenty for testing and light traffic.

Logic lives in `backend/controllers/chatController.js` (system prompt,
site/pricing info, tool-use loop) and `frontend/src/components/ChatWidget.js`
(UI).

## 4. Logging in

- **Customer:** register a new account at `/register`, then use `/login`.
- **Admin:** go to `/admin/login` and use the dummy credentials:
  - Username: `Admin123`
  - Password: `123456`

  These are read from `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `backend/.env` —
  change them there whenever you're ready to use real credentials; no code
  changes needed.

## 5. Modules implemented (matching the proposal)

| Module | Where |
|---|---|
| Customer — registration, login, profile, order placement, order tracking, order history | `frontend/src/pages/{Register,Login,Profile,PlaceOrder,TrackOrder,OrderHistory}.js` |
| Admin — dashboard, order management, customer records | `frontend/src/pages/Admin*.js` |
| Order management — creation, status updates, history | `backend/controllers/orderController.js`, `adminController.js` |
| Billing — auto-generated invoice per order, payment status | `backend/models/Bill.js`, `billController.js`, `frontend/src/pages/Billing.js`, `AdminBilling.js` |
| System — JWT authentication, route protection, centralized data handling | `backend/middleware/auth.js`, `backend/config/db.js` |
| AI support chatbot — pricing Q&A + real order lookups | `backend/controllers/chatController.js`, `frontend/src/components/ChatWidget.js` |

Known gaps not yet built: admin reports/analytics beyond the dashboard stats,
downloadable PDF invoices, and a real payment gateway (billing is currently
manual — admin marks invoices "Paid").

## Notes
- The logo at `frontend/src/assets/logo.svg` is a placeholder — swap it for
  your real logo (same file name, or update the import in `Navbar.js`).
- Pricing per service (`Washing`, `Dry Cleaning`, `Ironing`, `Stain Removal`)
  is set in `frontend/src/pages/PlaceOrder.js` (`defaultPrices`) — editable
  per line item at checkout, and easy to change permanently there.
- A 5% tax is applied when generating each invoice (`orderController.js`) —
  adjust the rate there if needed.
- Public order tracking (`/track`) works without logging in, by order number.
