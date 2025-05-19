Here’s a **cleaned-up, Markdown-formatted version** of your Egg Farm Daily Tracker description, ready to paste into your GitHub repository's `README.md`:

---

# 🐔 Egg Farm Daily Tracker

A lightweight, feature-rich **web app** designed for small-scale poultry farmers to track egg production, sales, expenses, and profits. Built with **HTML, CSS, and JavaScript**, using `localStorage` for offline data and hosted on **GitHub Pages**.

---

## 📌 Purpose

* Record daily egg collections, sales, and expenses
* Calculate revenue, profit, and running totals
* Export data as Excel or Word files
* Visualize profit trends with a chart
* Support both desktop and mobile devices (light/dark mode)

---

## 🧱 Structure

* **HTML**: Single-page layout with header, summary cards, form, buttons, table, and chart
* **CSS**: Responsive design with CSS variables and media queries
* **JavaScript**: Logic, calculations, storage, export, and chart rendering

**Libraries Used:**

* 📊 [Chart.js v4.4.3](https://www.chartjs.org/)
* 📄 [SheetJS v0.18.5](https://sheetjs.com/)
* 📝 [docx.js v8.5.0](https://github.com/dolanmiu/docx)

> ⚠️ Fully client-side — No backend required

---

## 🔧 Components

### 1. Header

* Title: `🐔 Egg Farm Daily Tracker`
* Centered, responsive text (light: `#333`, dark: `#e0e0e0`)

### 2. Summary Cards

* Metrics: Collected, Sold, Profit, Expenses
* Color-coded:

  * Profit (green: `#2e8b57` / `#6abf69`)
  * Expenses (red: `#ff0000` / `#ff5555`)
* Responsive card layout (23% desktop, 48% mobile)

### 3. Data Entry Form

* Fields: Date, Collected, Sold, Price, Expense Amount, Description
* Button: "Add Entry" / "Update Entry"
* Features:

  * Calculates remaining eggs, revenue, profit
  * Prevents duplicate dates
  * Updates chart, table, and summary
* Style: Card-like form, green button (`#4CAF50`)

### 4. Control Buttons

* `Save Data`: Save to localStorage
* `Load Data`: Load from localStorage
* `Upload File`: Import `.xlsx`, `.xls`, or `.csv`
* `Export Excel`: Download `.xlsx` file
* `Export Word`: Download `.docx` (styled) or `.doc` (fallback)
* `Clear Data`: Confirm and wipe data
* `Toggle Theme`: Switch between light and dark mode
* Fully responsive layout (full-width buttons on mobile)

### 5. Data Table

* Columns:
  `Date`, `Collected`, `Sold`, `Remaining`, `Price`, `Revenue`, `Expense`, `Description`, `Profit`, `Money on Hand`, `Action`
* Style:

  * Color-coded profit/loss cells
  * Responsive block layout with labels on mobile
* Behavior:

  * Edit fills the form
  * Delete removes entry

### 6. Profit Chart

* 📈 Line chart showing profit over time (Chart.js)
* Style:

  * Height: 300px (desktop), 200px (mobile)
  * Color: green line (`#2e8b57`)
* Live updates with debounced redraw

---

## 🎨 Design

* **Colors**:

  * Main: `#4CAF50`
  * Profit: `#2e8b57` / `#6abf69`
  * Expense: `#ff0000` / `#ff5555`
  * Backgrounds: `#fffbe6`, `#f9f9f9`, `#2e2e2e`, `#3a3a3a`
* **Typography**: `Segoe UI`, bold metrics (24px)
* **Cards**: Rounded corners, shadows, smooth transitions
* **Tables**: Solid borders, color-coded cells, fully mobile-friendly
* **Responsive Design**: Media queries for layout adaptation under `576px`
* **Themes**: Toggle between light/dark with correct profit/expense color fixes

---

## 🧠 JavaScript Logic

* **Form**: Input validation, calculations, UI refresh
* **Table**: Dynamic rendering, color classes, Edit/Delete
* **Save/Load**: Persistent via `localStorage`
* **Upload**: Parse Excel/CSV, merge dates
* **Export**:

  * Excel (`.xlsx`): Formatted via SheetJS
  * Word (`.docx`): Styled via docx.js (`Grid Table 6 Colorful`)
  * Fallback: HTML-generated `.doc`
* **Chart**: Debounced updates with real-time profit plotting
* **Error Handling**: Alerts for missing elements, file issues, CDN fallback

---

## 🚀 Features

| Feature      | Description                             |
| ------------ | --------------------------------------- |
| Data Entry   | Log eggs, sales, expenses               |
| Calculations | Remaining, revenue, profit, totals      |
| Table        | Color-coded with edit/delete            |
| Save/Load    | Uses localStorage                       |
| File Upload  | Import `.xlsx`, `.xls`, `.csv`          |
| Export       | Excel (`.xlsx`), Word (`.docx`, `.doc`) |
| Chart        | Profit-over-time visualization          |
| Responsive   | Light/dark mode, mobile-friendly        |
| Clear        | Confirmation-based data wipe            |

---

## 🛠 Technologies

* **HTML**: Page structure
* **CSS**: Responsive styling, variables, transitions
* **JavaScript**: DOM logic, localStorage, Blob export
* **Libraries**:

  * Chart.js
  * SheetJS
  * docx.js
* **Hosting**: GitHub Pages (`.nojekyll` for compatibility)

---

## ✨ Enhancements (May 2025)

* **Mobile Fixes**: Light mode card backgrounds (`#f9f9f9`), dark mode colors corrected
* **Word Export**:

  * `.docx`: Blue header (`#4472C4`), alternating rows (`#D9E2F3`/`#FFFFFF`)
  * Profit/expense: Green (`#C6EFCE`), Red (`#FFC7CE`)
* **Reliability**:

  * HTML fallback for `.doc`
  * CDN fallbacks with dynamic script loading
  * Error alerts for missing libraries or elements

---

## 📋 Notes

* ✅ **Tested On**: Chrome, Firefox, Safari, iPhone simulator (`<576px`), with/without CDNs
* 🛠 **Assumptions**: Hosted on GitHub Pages with `index.html` at root
* 💡 **Future Options**:

  * Local fallback for docx.js
  * Simplified Word export (`.doc` only)

---

> The **Egg Farm Daily Tracker** is a complete solution for poultry management — designed for simplicity, offline support, and visual clarity across devices.
> ✅ Keep your `style.css` and `script.js` updated to benefit from the latest enhancements.

---

Let me know if you’d like a matching banner, badges (like MIT license, GitHub Pages link), or GitHub-flavored emoji enhancements!
