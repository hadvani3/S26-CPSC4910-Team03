# Project Architecture & Development Guide — Team 03

## 1. Full-Stack Flow

Our application is split into two main parts: the **Client (Frontend)** and the **Server (Backend)**. They talk to each other using JSON over an API.

| Layer | Tech | Role |
|-------|------|------|
| **Frontend** | React / Vite | What the user sees in the browser. |
| **Backend** | Node / Express | Handles the MySQL database queries, password hashing (bcrypt), and security tokens. |
| **Database** | MySQL RDS | Permanent storage hosted on AWS. |


## 2. File Responsibilities

### The "Skeleton" — `index.html`

- **Location:** `client` folder.
- **Content:** A single `<div id="root"></div>`.
- **Role:** We almost never edit this file; React **injects** our entire app into that one div.


### The Engine — `main.jsx`

- **Location:** `client/src/main.jsx`
- **Role:** Entry point for React. It connects our JavaScript code to `index.html` and is the starter for the frontend.
- **Loads:** `index.css` (global base styles), then `App.jsx`.


### The Traffic Controller — `App.jsx`

- **Location:** `client/src/App.jsx`
- **Role:** Uses **React Router**. It looks at the URL and decides which page to show:

| URL | Page |
|-----|------|
| `/` | Login Page |
| `/home` | Dashboard Home |
| `/about` | About Page |
| `/create_account` | Create Account Page |

- **Also loads:** `App.css` (global layout and component styles).

---

### The Pages — `.jsx` files in `src/pages/`

- **Location:** `client/src/pages/`
- **Role:** The actual screens (Login, Home, About, CreateAccount, etc.).
- **JSX** lets us write HTML-like code inside JavaScript.
- **`useState`** — lets the page remember things (whether data is still loading).
- **`useEffect`** — used to fetch data from the backend when the page opens.

---

### The Styling — CSS (Global Styles)

We keep the app looking professional by avoiding inline styles. Define classes in our CSS files and use them in JSX as `className="container"`.

#### Two stylesheets and how they relate to JSX

| File | Loaded in | Purpose |
|------|-----------|--------|
| **`index.css`** | `main.jsx` | **Global base:** `:root` (fonts, colors), `*` (box-sizing), `body` (margins, min-height). No `className` usage in JSX—it’s the base layer. |
| **`App.css`** | `App.jsx` | **Layout & components:** Defines classes that JSX actually uses. |

#### Classes from `App.css` used in JSX

| Class | Used in |
|-------|--------|
| `.container` | Page content wrapper (Login, About, Home, etc.) |
| `.nav-list` | `Nav.jsx` — navigation bar |
| `.label` | Field labels (About page) |
| `.item` | List/block items (About page) |

`App.css` also styles raw elements used inside those components: `body`, `#root`, `h1`, `form`, `input`, `a`, `button`. No extra class needed—they apply by element type.

**Flow:** `index.html` → `main.jsx` loads `index.css` + `App.jsx` → `App.jsx` loads `App.css` → each route renders pages that use `Nav` and `className="container"` (and others as needed).

---

## 3. How to Develop (The Vite Workflow)

We use **Vite** because it is significantly faster than traditional tools. Instead of rebuilding the app every time you change a pixel, Vite **hot-swaps** the code.

### Step 1: Start the Backend (API & Database)

In your **first terminal**, run:

```bash
node app.react.js
```

- **Port:** 3000  
- **Purpose:** Keeps the connection to AWS MySQL alive. If this isn’t running, your pages will show "Loading..." forever.

### Step 2: Start the Frontend (Vite Dev Server)

In a **second terminal**:

```bash
cd client
npm run dev
```

- **Port:** 5173  
- **The magic:** Open **http://localhost:5173**. Every time you press **Ctrl+S** in a `.jsx` or `.css` file, the browser updates instantly without a full refresh.

---

## 4. Why We Don’t Use Port 3000 for Testing

You might notice the app also lives on **Port 3000**. Do **not** use this for active coding.

- **Port 3000** serves the `client/dist` folder.
- That folder only updates when you run `npm run build`.

**Use Port 5173** for development so you don’t have to build the app every time you make a change.

---

## 5. Summary

| Goal | Where to go |
|------|-------------|
| Change the layout | Edit the `.jsx` files in `src/pages/`. |
| Change colors / spacing | Edit `App.css` (and `index.css` for global base). |
| **Add a new page** | 1. Create the `.jsx` file in `src/pages/`. 2. Add a `<Route>` in `App.jsx`. 3. Add a `<Link>` in `Nav.jsx`. |
