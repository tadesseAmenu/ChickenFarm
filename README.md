🐔 Egg Farm Daily Tracker — Project Overview
The Egg Farm Daily Tracker is a web-based app for small-scale poultry farmers to track egg production, sales, expenses, and profits. Built with HTML, CSS, and JavaScript, it uses localStorage for offline data storage and is hosted on GitHub Pages.
📌 Purpose
Record daily egg collections, sales, and expenses.
Calculate revenue, profit, and running totals.
Export data as Excel or Word files.
Visualize profit trends with a chart.
Support desktop and mobile with light/dark mode.
🧱 Structure
HTML: Single-page layout with header, summary cards, form, buttons, table, and chart.
CSS: Responsive, modern design with CSS variables and media queries.
JavaScript: Handles logic, calculations, storage, exports, and chart rendering.
Libraries:
Chart.js (4.4.3): Profit chart.
SheetJS (0.18.5): Excel import/export.
docx.js (8.5.0): Word export (HTML fallback).
No Backend: Fully client-side.
🔧 Components
1. Header
Title: "🐔 Egg Farm Daily Tracker".
Centered, responsive, light (#333) or dark (#e0e0e0) text.
2. Summary Cards
Metrics: Total Collected, Sold, Profit (green: #2e8b57/#6abf69), Expenses (red: #ff0000/#ff5555).
Style: Light (#f9f9f9) or dark (#3a3a3a) cards, 23% width (desktop), 48% (mobile).
Behavior: Updates dynamically.
3. Data Entry Form
Inputs: Date, Collected, Sold, Price, Expense Amount, Expense Description.
Button: "Add Entry" (or "Update Entry" when editing).
Logic: Calculates remaining eggs, revenue, profit; prevents duplicate dates; updates table/chart/summary.
Style: Card-like, green button (#4CAF50), stacks vertically on mobile.
4. Control Buttons
Save Data: Stores to localStorage.
Load Data: Retrieves from localStorage.
Upload File: Imports .xlsx/.xls/.csv.
Export Excel: Downloads Egg_farm_report.xlsx.
Export Word: Downloads Egg_farm_report.docx (styled table) or .doc (fallback).
Clear Data: Wipes data after confirmation.
Toggle Theme: Switches light/dark mode.
Style: Green buttons, full-width on mobile.
5. Data Table
Columns: Date, Collected, Sold, Remaining, Price, Revenue, Expense (red), Desc, Profit (green/red), Money on Hand, Action (Edit/Delete).
Style: Card-like, light/dark backgrounds, mobile: block layout with labels.
Behavior: Edit populates form; Delete removes entry.
6. Profit Chart
Line chart (Chart.js) showing profit over time.
Style: 300px (desktop), 200px (mobile), green line (#2e8b57).
Behavior: Updates with entries, debounced redraw.
🎨 Design
Colors: Green (#4CAF50), profit (#2e8b57/#6abf69), expense (#ff0000/#ff5555), light (#fffbe6/#f9f9f9), dark (#2e2e2e/#3a3a3a).
Typography: 'Segoe UI' family, bold metrics (24px).
Cards: Shadows, rounded corners, smooth transitions.
Table: Solid borders, color-coded cells, mobile-friendly.
Responsive: Media query (max-width: 576px) stacks elements, adjusts chart.
Themes: Light/dark mode with mobile fixes (correct card colors, profit/expense styling).
🧠 JavaScript Logic
Form: Validates inputs, calculates metrics, updates entries, refreshes UI.
Table: Renders entries, applies color classes, handles Edit/Delete.
Save/Load: Uses localStorage for persistence.
File Upload: Parses Excel/CSV, converts dates, merges entries.
Exports:
Excel: SheetJS generates .xlsx with formatted columns.
Word: docx.js creates .docx with "Grid Table 6 Colorful" style (blue header, alternating rows, green/red profit/expense cells); HTML .doc fallback.
Chart: Updates profit line graph with debouncing.
Error Handling: Alerts for missing elements, invalid files, or export failures.
🚀 Features
Feature
Description
Data Entry
Log eggs, sales, expenses
Calculations
Remaining, revenue, profit, running total
Table
Color-coded profit/loss, edit/delete
Save/Load
Persist data in localStorage
File Upload
Import .xlsx/.xls/.csv
Export
Excel (.xlsx), Word (.docx/.doc)
Chart
Profit-over-time line graph
Responsive
Desktop/mobile, light/dark mode
Clear
Wipe data with confirmation
🛠 Technologies
HTML: Page structure.
CSS: Responsive styling, variables, media queries.
JavaScript: Logic, DOM manipulation, Blob exports.
Libraries: Chart.js, SheetJS, docx.js.
Hosting: GitHub Pages with .nojekyll.
✨ Enhancements (May 2025)
Mobile Fixes: Corrected light mode card backgrounds (#f9f9f9), ensured dark mode profit/expense colors (#6abf69/#ff5555).
Word Export: Styled .docx table with blue header (#4472C4), alternating rows (#D9E2F3/#FFFFFF), green (#C6EFCE) for positive profits, red (#FFC7CE) for negative profits/expenses.
Reliability: HTML .doc fallback, robust error handling, CDN fallbacks.
📋 Notes
Testing: Verified on Chrome, Firefox, Safari, iPhone simulator (<576px), with/without CDNs.
Assumptions: Hosted on GitHub Pages, latest index.html (no docx.js alert).
Future Options: Local docx.js for .docx reliability, simplified .doc-only export.
The Egg Farm Daily Tracker is a lightweight, feature-rich tool for poultry management, optimized for ease of use and cross-device compatibility. Update style.css and script.js with the latest versions to ensure all fixes and enhancements are applied.
