    const form = document.getElementById('entryForm');
    const tableBody = document.querySelector('#dataTable tbody');
    const saveBtn = document.getElementById('saveData');
    const loadBtn = document.getElementById('loadData');
    const clearBtn = document.getElementById('clearData');

    let entries = [];
    let runningTotal = 0;
    let editIndex = -1;

    form.addEventListener('submit', e => {
      e.preventDefault();
const entry = {
        date: document.getElementById('date').value,
        collected: parseInt(document.getElementById('collected').value, 10),
        sold: parseInt(document.getElementById('sold').value, 10),
        price: parseFloat(document.getElementById('price').value),
        expenseAmt: parseFloat(document.getElementById('expenseAmt').value),
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
      form.reset();
    });

    function updateRunningTotals() {
      runningTotal = 0;
      entries.forEach((e, i) => {
        runningTotal += e.profit;
        e.runningTotal = runningTotal;
      });
    }

    saveBtn.addEventListener('click', () => {
      localStorage.setItem('chickenEntries', JSON.stringify(entries));
      alert('Data saved to local storage.');
    });

    loadBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('chickenEntries') || '[]');
      if (data.length) {
        entries = data;
        updateRunningTotals();
        renderTable();
        alert('Data loaded from local storage.');
      } else {
        alert('No data found in local storage.');
      }
    });

    // Download as Excel (CSV)
document.getElementById('downloadExcel').addEventListener('click', () => {
  let csv = 'Date,Collected,Sold,Remaining,Price,Revenue,Expense Amt,Expense Desc,Profit,Money on Hand\n';
  entries.forEach(e => {
    csv += `${e.date},${e.collected},${e.sold},${e.remaining},${e.price.toFixed(2)},${e.revenue.toFixed(2)},${e.expenseAmt.toFixed(2)},${e.expenseDesc},${e.profit.toFixed(2)},${e.runningTotal.toFixed(2)}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chicken_farm_data.csv';
  link.click();
});

// Download as Word
document.getElementById('downloadWord').addEventListener('click', () => {
  let html = `
    <html>
      <head><meta charset="utf-8"><title>Chicken Farm Report</title></head>
      <body>
        <h2>Chicken Farm Daily Report</h2>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Date</th><th>Collected</th><th>Sold</th><th>Remaining</th><th>Price</th><th>Revenue</th><th>Expense Amt</th><th>Expense Desc</th><th>Profit</th><th>Money on Hand</th>
            </tr>
          </thead>
          <tbody>
  `;

  entries.forEach(e => {
    html += `
      <tr>
        <td>${e.date}</td>
        <td>${e.collected}</td>
        <td>${e.sold}</td>
        <td>${e.remaining}</td>
        <td>${e.price.toFixed(2)}</td>
        <td>${e.revenue.toFixed(2)}</td>
        <td>${e.expenseAmt.toFixed(2)}</td>
        <td>${e.expenseDesc}</td>
        <td>${e.profit.toFixed(2)}</td>
        <td>${e.runningTotal.toFixed(2)}</td>
      </tr>`;
  });

  html += `
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + html], {
    type: 'application/msword',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chicken_farm_report.doc';
  link.click();
});


    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data?')) {
        entries = [];
        runningTotal = 0;
        localStorage.removeItem('chickenEntries');
        renderTable();
      }
    });

    function renderTable() {
      tableBody.innerHTML = '';
      entries.forEach((e, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
  <td>${e.date}</td>
  <td>${e.collected}</td>
  <td>${e.sold}</td>
  <td>${e.remaining}</td>
  <td>${e.price.toFixed(2)}</td>
  <td>${e.revenue.toFixed(2)}</td>
  <td>${e.expenseAmt.toFixed(2)}</td>
  <td>${e.expenseDesc}</td>
  <td>${e.profit.toFixed(2)}</td>
  <td>${e.runningTotal.toFixed(2)}</td>
  <td><button class="edit-btn" onclick="editEntry(${index})">Edit</button></td>
`;

        tableBody.appendChild(row);
      });
    }

    window.editEntry = function(index) {
      const e = entries[index];
      document.getElementById('date').value = e.date;
      document.getElementById('collected').value = e.collected;
      document.getElementById('sold').value = e.sold;
      document.getElementById('price').value = e.price;
      document.getElementById('expenseAmt').value = e.expenseAmt;
      document.getElementById('expenseDesc').value = e.expenseDesc;
      editIndex = index;
    };