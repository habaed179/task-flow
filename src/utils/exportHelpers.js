export function exportToJSON(data, filename = 'taskflow-export.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportToCSV(data = [], filename = 'taskflow-export.csv') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const escaped = ('' + (val !== undefined && val !== null ? val : '')).replace(
        /"/g,
        '""'
      );
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
    csvRows.join('\n')
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', csvString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
