document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('entryForm');
  const tableBody = document.querySelector('#dataTable tbody');
  const saveBtn = document.getElementById('saveData');
  const loadBtn = document.getElementById('loadData');
  const clearBtn = document.getElementById('clearData');
  const themeToggle = document.getElementById('themeToggle');
  const fileUpload = document.getElementById('fileUpload');
  const uploadFileBtn = document.getElementById('uploadFile');
  const downloadExcelBtn = document.getElementById('downloadExcel');
  const downloadWordBtn = document.getElementById('downloadWord');

  const totalCollectedEl = document.getElementById('totalCollected');
  const totalSoldEl = document.getElementById('totalSold');
  const totalProfitEl = document.getElementById('totalProfit');
  const totalExpenseEl = document.getElementById('totalExpense');

  const ctx = document.getElementById('profitChart')?.getContext('2d');
  let chart;
  let entries = [];
  let runningTotal = 0;
  let editIndex = -1;
  let chartUpdateTimeout = null;

  // Null checks
  if (!form || !tableBody || !saveBtn || !loadBtn || !clearBtn || !themeToggle || !fileUpload || !uploadFileBtn || !downloadExcelBtn || !downloadWordBtn) {
    console.error('One or more DOM elements not found:', {
      form, tableBody, saveBtn, loadBtn, clearBtn, themeToggle, fileUpload, uploadFileBtn, downloadExcelBtn, downloadWordBtn
    });
    alert('Error: Page elements not loaded. Please refresh the page.');
    return;
  }

  if (!totalCollectedEl || !totalSoldEl || !totalProfitEl || !totalExpenseEl) {
    console.error('Summary elements not found:', {
      totalCollectedEl, totalSoldEl, totalProfitEl, totalExpenseEl
    });
    alert('Error: Summary elements not loaded.');
    return;
  }

  if (!ctx) {
    console.error('Chart canvas #profitChart not found');
    alert('Error: Chart canvas not found.');
    return;
  }

  // Utility to convert Excel serial date to YYYY-MM-DD
  function excelSerialToDate(serial) {
    if (!serial || isNaN(serial)) return '';
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400 * 1000;
    const date = new Date(utc_value);
    if (serial < 60) {
      date.setDate(date.getDate() - 1);
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function updateChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js library not loaded');
      return;
    }

    if (chartUpdateTimeout) {
      clearTimeout(chartUpdateTimeout);
    }

    chartUpdateTimeout = setTimeout(() => {
      const labels = entries.map(e => e.date || 'Unknown');
      const data = entries.map(e => e.profit || 0);

      console.log('Updating chart with:', { labels, data, canvasWidth: ctx.canvas.width, canvasHeight: ctx.canvas.height });

      if (chart) {
        chart.destroy();
        console.log('Previous chart destroyed');
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
            maintainAspectRatio: false,
            scales: {
              x: {
                display: true,
                maxTicksLimit: 10,
              },
              y: {
                display: true,
                beginAtZero: true,
              }
            },
            plugins: {
              legend: {
                display: true,
              }
            }
          }
        });
        console.log('Chart rendered successfully', {
          width: ctx.canvas.width,
          height: ctx.canvas.height,
          entryCount: entries.length
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }, 100);
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
    console.log('Summary updated:', { collected, sold, profit, expenses });
  }

  function updateRunningTotals() {
    runningTotal = 0;
    entries.forEach(e => {
      runningTotal += e.profit;
      e.runningTotal = runningTotal;
    });
    console.log('Running totals updated:', { runningTotal });
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
        td.setAttribute('data-label', labels[i] || 'Unknown');
        if (cell.className) td.className = cell.className;
        row.appendChild(td);
      });

      tableBody.appendChild(row);
    });
    console.log('Table rendered with', entries.length, 'entries');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Form submitted');
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
      console.log('Entry edited at index:', editIndex);
    } else {
      if (!entries.some(e => e.date === entry.date)) {
        entries.push(entry);
        console.log('New entry added:', entry);
      } else {
        console.warn('Duplicate entry for date:', entry.date);
        alert('Entry for this date already exists. Please edit the existing entry or choose a different date.');
        return;
      }
    }

    updateRunningTotals();
    try {
      renderTable();
    } catch (error) {
      console.error('Error rendering table:', error);
      alert('Error updating table. Please check console for details.');
      return;
    }
    updateChart();
    updateSummary();
    form.reset();
    console.log('Form processing complete');
  });

  tableBody.addEventListener('click', e => {
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
      console.log('Editing entry at index:', index);
    }

    if (btn.classList.contains('btn-delete')) {
      if (confirm('Are you sure you want to delete this entry?')) {
        entries.splice(index, 1);
        updateRunningTotals();
        renderTable();
        updateChart();
        updateSummary();
        console.log('Entry deleted at index:', index);
      }
    }
  });

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('chickenEntries', JSON.stringify(entries));
    alert('Data saved.');
    console.log('Data saved to localStorage:', entries);
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
      console.log('Data loaded from localStorage:', entries);
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
      console.log('Data cleared');
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    console.log('Theme toggled:', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  uploadFileBtn.addEventListener('click', () => {
    if (fileUpload) {
      fileUpload.click();
      console.log('Upload file button clicked');
    } else {
      console.error('File input element not found');
      alert('Error: File upload element not found.');
    }
  });

  fileUpload.addEventListener('change', (e) => {
    console.log('File input changed');
    const file = e.target.files[0];
    if (!file) {
      alert('No file selected.');
      console.log('No file selected');
      return;
    }

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      alert('Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
      fileUpload.value = '';
      console.log('Invalid file extension:', fileExt);
      return;
    }

    if (typeof XLSX === 'undefined') {
      alert('File upload library not loaded. Please refresh the page.');
      console.error('XLSX not defined');
      fileUpload.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        console.log('File data loaded:', { fileName: file.name, size: file.size, type: file.type });

        const workbook = XLSX.read(data, { type: 'array', dateNF: 'yyyy-mm-dd' });
        if (!workbook.SheetNames.length) {
          throw new Error('No sheets found in the file.');
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
          throw new Error(`Sheet "${sheetName}" not found.`);
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
        console.log('Parsed JSON data:', jsonData);

        if (jsonData.length < 2) {
          alert('File is empty or has no data rows.');
          fileUpload.value = '';
          console.log('Empty or no data rows');
          return;
        }

        const headers = jsonData[0].map(h => h.toString().trim().toLowerCase());
        const expectedHeaders = ['date', 'collected', 'sold', 'price', 'expense amt', 'expense desc'];
        const headerMap = {};
        expectedHeaders.forEach((eh) => {
          const index = headers.findIndex(h => h.replace(/\s+/g, '').includes(eh.replace(/\s+/g, '')));
          if (index !== -1) headerMap[eh] = index;
        });

        if (Object.keys(headerMap).length < 4) {
          alert('Invalid file structure. Ensure columns: Date, Collected, Sold, Price, Expense Amt, Expense Desc.');
          fileUpload.value = '';
          console.log('Invalid header structure:', headers);
          return;
        }

        const newEntries = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length < 4) continue;

          let dateValue = row[headerMap['date']] ? row[headerMap['date']].toString() : '';
          if (!isNaN(dateValue) && Number(dateValue) > 10000) {
            dateValue = excelSerialToDate(Number(dateValue));
          } else if (fileExt === '.csv' && dateValue) {
            const dateObj = new Date(dateValue);
            if (!isNaN(dateObj.getTime())) {
              dateValue = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dateObj.getUTCDate()).padStart(2, '0')}`;
            } else {
              dateValue = '';
            }
          }

          const entry = {
            date: dateValue,
            collected: parseInt(row[headerMap['collected']], 10) || 0,
            sold: parseInt(row[headerMap['sold']], 10) || 0,
            price: parseFloat(row[headerMap['price']]) || 0,
            expenseAmt: parseFloat(row[headerMap['expense amt']]) || 0,
            expenseDesc: row[headerMap['expense desc']] ? row[headerMap['expense desc']].toString() : '',
          };

          entry.remaining = entry.collected - entry.sold;
          entry.revenue = entry.sold * entry.price;
          entry.profit = entry.revenue - entry.expenseAmt;

          if (!entries.some(e => e.date === entry.date)) {
            newEntries.push(entry);
          }
        }

        if (newEntries.length === 0) {
          alert('No valid data found in the file.');
          fileUpload.value = '';
          console.log('No valid entries parsed');
          return;
        }

        entries = [...entries, ...newEntries];
        updateRunningTotals();
        try {
          renderTable();
        } catch (error) {
          console.error('Error rendering table:', error);
          alert('Error updating table after file upload. Please check console for details.');
          return;
        }
        updateChart();
        updateSummary();
        alert(`${newEntries.length} entries uploaded successfully.`);
        console.log('Uploaded entries:', newEntries);
        fileUpload.value = '';
      } catch (error) {
        console.error('Error parsing file:', {
          message: error.message,
          stack: error.stack,
          fileName: file.name,
          fileType: file.type,
        });
        alert(`Error reading file: ${error.message}. Please ensure it’s a valid Excel (.xlsx, .xls) or CSV file.`);
        fileUpload.value = '';
      }
    };

    reader.onerror = () => {
      console.error('FileReader error:', { fileName: file.name });
      alert('Error reading file. Please try again or use a different file.');
      fileUpload.value = '';
    };

    reader.readAsArrayBuffer(file);
  });

  downloadExcelBtn.addEventListener('click', () => {
    if (entries.length === 0) {
      alert('No data to export.');
      console.log('Export to Excel failed: No entries');
      return;
    }

    try {
      const worksheetData = [
        ['Date', 'Collected', 'Sold', 'Remaining', 'Price', 'Revenue', 'Expense', 'Desc', 'Profit', 'Money on Hand']
      ];

      entries.forEach(entry => {
        worksheetData.push([
          entry.date,
          entry.collected,
          entry.sold,
          entry.remaining,
          entry.price,
          entry.revenue,
          entry.expenseAmt,
          entry.expenseDesc,
          entry.profit,
          entry.runningTotal
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ChickenFarmData');

      worksheet['!cols'] = [
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 12 }
      ];

      XLSX.writeFile(workbook, 'chicken_farm_report.xlsx');
      console.log('Exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel. Please try again.');
    }
  });

  downloadWordBtn.addEventListener('click', () => {
    if (entries.length === 0) {
      alert('No data to export.');
      console.log('Export to Word failed: No entries');
      return;
    }

    try {
      // Check if docx.js is loaded
      if (typeof docx === 'undefined') {
        console.warn('docx.js not loaded, using HTML-based Word export fallback');
        // Fallback to HTML-based .doc export
        const header = `
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Chicken Farm Daily Tracker Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #000; padding: 8px; text-align: center; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Chicken Farm Daily Tracker Report</h1>
            <table>
              <tr>
                <th>Date</th>
                <th>Collected</th>
                <th>Sold</th>
                <th>Remaining</th>
                <th>Price</th>
                <th>Revenue</th>
                <th>Expense</th>
                <th>Desc</th>
                <th>Profit</th>
                <th>Money on Hand</th>
              </tr>
        `;
        const rows = entries.map(entry => `
          <tr>
            <td>${entry.date}</td>
            <td>${entry.collected}</td>
            <td>${entry.sold}</td>
            <td>${entry.remaining}</td>
            <td>${entry.price.toFixed(2)}</td>
            <td>${entry.revenue.toFixed(2)}</td>
            <td>${entry.expenseAmt.toFixed(2)}</td>
            <td>${entry.expenseDesc}</td>
            <td>${entry.profit.toFixed(2)}</td>
            <td>${entry.runningTotal.toFixed(2)}</td>
          </tr>
        `).join('');
        const footer = `
            </table>
          </body>
          </html>
        `;
        const htmlContent = header + rows + footer;
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chicken_farm_report.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Exported to Word (HTML fallback) successfully');
        return;
      }

      // Standard docx.js export with "Grid Table 6 Colorful" style
      console.log('Creating Word document with docx.js');
      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: [
            new docx.Paragraph({
              text: 'Chicken Farm Daily Tracker Report',
              heading: docx.HeadingLevel.HEADING_1,
              alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Table({
              rows: [
                // Header row
                new docx.TableRow({
                  children: [
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Date', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' }, // Blue header
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Collected', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Sold', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Remaining', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Price', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Revenue', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Expense', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Desc', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Profit', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph({ text: 'Money on Hand', bold: true })],
                      shading: { fill: '4472C4', color: 'FFFFFF' },
                    }),
                  ],
                }),
                // Data rows
                ...entries.map((entry, index) => new docx.TableRow({
                  children: [
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.date || '')],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' }, // Alternating rows
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.collected.toString())],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.sold.toString())],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.remaining.toString())],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.price.toFixed(2))],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.revenue.toFixed(2))],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.expenseAmt.toFixed(2))],
                      shading: { fill: 'FFC7CE' }, // Red for expenses
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.expenseDesc || '')],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.profit.toFixed(2))],
                      shading: { fill: entry.profit >= 0 ? 'C6EFCE' : 'FFC7CE' }, // Green for profit, red for loss
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(entry.runningTotal.toFixed(2))],
                      shading: { fill: index % 2 === 0 ? 'D9E2F3' : 'FFFFFF' },
                    }),
                  ],
                })),
              ],
              width: {
                size: 100,
                type: docx.WidthType.PERCENTAGE,
              },
              borders: {
                top: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
                bottom: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
                left: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
                right: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
                insideHorizontal: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
                insideVertical: { style: docx.BorderStyle.SINGLE, size: 2, color: '000000' },
              },
            }),
          ],
        }],
      });

      console.log('Packing Word document');
      docx.Packer.toBlob(doc).then(blob => {
        console.log('Word document Blob created, initiating download');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chicken_farm_report.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Exported to Word successfully');
      }).catch(error => {
        console.error('Error packing Word document:', error);
        alert('Failed to export to Word: Error creating document. Please try again.');
      });
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Failed to export to Word: ' + error.message);
    }
  });

  // Initialize
  updateChart();
  updateSummary();
  renderTable();
  console.log('Page initialized');
});
