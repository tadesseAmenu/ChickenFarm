const form = document.getElementById('entryForm');
const tableBody = document.querySelector('#dataTable tbody');
const saveBtn = document.getElementById('saveData');
const loadBtn = document.getElementById('loadData');
const clearBtn = document.getElementById('clearData');
const themeToggle = document.getElementById('themeToggle');

let entries = [];
let runningTotal = 0;
let editIndex = -1;

const totalCollectedEl = document.getElementById('totalCollected');
const totalSoldEl = document.getElementById('totalSold');
const totalProfitEl = document.getElementById('totalProfit');
const totalExpenseEl = document.getElementById('totalExpense');

const ctx = document.getElementById('profitChart')?.getContext('2d');
let chart;

function updateChart() {
  if (!ctx) {
    console.error('Chart canvas #profitChart not found');
    return;
  }
  if (typeof Chart === 'undefined') {
    console.error('Chart.js library not loaded');
    return;
  }

  const labels = entries.map(e => e.date || 'Unknown');
  const data = entries.map(e => e.profit || 0);

  console.log('Chart data:', { labels, data }); // Debug chart data

  if (chart) {
    chart.destroy();
  }

  try {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Profit Over Time',
          data,
          borderColor: '#2e8b57',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

function updateSummary() {
  let collected = 0, sold = 0, profit = 0, expenses = 0;
  entries.forEach(e => {
    collected += e.collected;
    sold += e.sold;
    profit += e.profit;
    expenses += e.expenseAmt;
  });
  totalCollectedEl.textContent = collected;
  totalSoldEl.textContent = sold;
  totalProfitEl.textContent = profit.toFixed(2);
  totalExpenseEl.textContent = expenses.toFixed(2);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const entry = {
    date: document.getElementById('date').value,
    collected: parseInt(document.getElementById('collected').value, 10) || 0,
    sold: parseInt(document.getElementById('sold').value, 10) || 0,
    price: parseFloat(document.getElementById('price').value) || 0,
    expenseAmt: parseFloat(document.getElementById('expenseAmt').value) || 0,
    expenseDesc: document.getElementById('expenseDesc').value,
  };

  entry.remaining = entry.collected - entry.sold;
  entry.revenue = entry.sold * entry.price;
  entry.profit = entry.revenue - entry.expenseAmt;

  if (editIndex >= 0) {
    entries[editIndex] = entry;
    editIndex = -1;
  } else {
    entries.push(entry);
  }

  updateRunningTotals();
  renderTable();
  updateChart();
  updateSummary();
  form.reset();
});

function updateRunningTotals() {
  runningTotal = 0;
  entries.forEach(e => {
    runningTotal += e.profit;
    e.runningTotal = runningTotal;
  });
}

function renderTable() {
  tableBody.innerHTML = '';
  const labels = [
    'Date', 'Collected', 'Sold', 'Remaining', 'Price', 'Revenue',
    'Expense', 'Desc', 'Profit', 'Money on Hand', 'Action'
  ];

  entries.forEach((e, index) => {
    const row = document.createElement('tr');
    const cells = [
      { value: e.date, className: '' },
      { value: e.collected, className: '' },
      { value: e.sold, className: '' },
      { value: e.remaining, className: '' },
      { value: e.price.toFixed(2), className: '' },
      { value: e.revenue.toFixed(2), className: '' },
      { value: e.expenseAmt.toFixed(2), className: 'expense' },
      { value: e.expenseDesc, className: '' },
      { value: e.profit.toFixed(2), className: 'profit' },
      { value: e.runningTotal.toFixed(2), className: '' },
      { value: `<button class="btn-edit" data-index="${index}">✏️ Edit</button>
                <button class="btn-delete" data-index="${index}">🗑️ Delete</button>`, className: '' }
    ];

    cells.forEach((cell, i) => {
      const td = document.createElement('td');
      td.innerHTML = cell.value;
      const label = labels[i];
      if (!label) {
        console.warn(`Missing label for index ${i} in table row`);
      }
      td.setAttribute('data-label', label || 'Unknown');
      if (cell.className) td.className = cell.className;
      row.appendChild(td);
    });

    tableBody.appendChild(row);
  });
}

// Event delegation for dynamically created edit/delete buttons
tableBody.addEventListener('click', (e) => {
  const btn = e.target;
  const index = parseInt(btn.getAttribute('data-index'), 10);

  if (btn.classList.contains('btn-edit')) {
    const entry = entries[index];
    document.getElementById('date').value = entry.date;
    document.getElementById('collected').value = entry.collected;
    document.getElementById('sold').value = entry.sold;
    document.getElementById('price').value = entry.price;
    document.getElementById('expenseAmt').value = entry.expenseAmt;
    document.getElementById('expenseDesc').value = entry.expenseDesc;
    editIndex = index;
  }

  if (btn.classList.contains('btn-delete')) {
    if (confirm('Are you sure you want to delete this entry?')) {
      entries.splice(index, 1);
      updateRunningTotals();
      renderTable();
      updateChart();
      updateSummary();
    }
  }
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem('chickenEntries', JSON.stringify(entries));
  alert('Data saved.');
});

loadBtn.addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('chickenEntries') || '[]');
  if (data.length) {
    entries = data;
    updateRunningTotals();
    renderTable();
    updateChart();
    updateSummary();
    alert('Data loaded.');
  } else {
    alert('No data found.');
  }
});

clearBtn.addEventListener('click', () => {
  if (confirm('Clear all data?')) {
    entries = [];
    runningTotal = 0;
    localStorage.removeItem('chickenEntries');
    renderTable();
    updateChart();
    updateSummary();
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function exportToExcel() {
  const tableClone = document.getElementById("dataTable").cloneNode(true);
  Array.from(tableClone.querySelectorAll("tr")).forEach(row => {
    row.removeChild(row.lastElementChild);
  });
  Array.from(tableClone.querySelectorAll("tr")).forEach((row, i) => {
    const cells = row.cells;
    if (i === 0) return;
    const expenseCell = cells[6];
    const profitCell = cells[8];
    const collectedCell = cells[1];
    if (expenseCell) expenseCell.style.color = "red";
    if (profitCell) profitCell.style.color = "green";
    if (collectedCell) collectedCell.style.color = "black";
  });
  tableClone.style.borderCollapse = "collapse";
  Array.from(tableClone.querySelectorAll("td, th")).forEach(cell => {
    cell.style.border = "1px solid #000";
    cell.style.padding = "5px";
  });
  const html = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        ${tableClone.outerHTML}
      </body>
    </html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chicken_farm_report.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToWord() {
  const tableClone = document.getElementById("dataTable").cloneNode(true);
  Array.from(tableClone.querySelectorAll("tr")).forEach(row => {
    row.removeChild(row.lastElementChild);
  });
  Array.from(tableClone.querySelectorAll("tr")).forEach((row, i) => {
    const cells = row.cells;
    if (i === 0) return;
    const expenseCell = cells[6];
    const profitCell = cells[8];
    const collectedCell = cells[1];
    if (expenseCell) expenseCell.style.color = "red";
    if (profitCell) profitCell.style.color = "green";
    if (collectedCell) collectedCell.style.color = "black";
  });
  tableClone.style.borderCollapse = "collapse";
  Array.from(tableClone.querySelectorAll("td, th")).forEach(cell => {
    cell.style.border = "1px solid #000";
    cell.style.padding = "5px";
  });
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Chicken Farm Report</title></head><body>`;
  const footer = "</body></html>";
  const sourceHTML = header + tableClone.outerHTML + footer;
  const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chicken_farm_report.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateChart();
});
