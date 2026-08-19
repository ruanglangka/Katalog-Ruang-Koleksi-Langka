const SHEET_NAME = 'Sheet1'; // Ganti sesuai nama tab/sheet kamu

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ error: `Sheet bernama "${SHEET_NAME}" tidak ditemukan.` }, 404);
    }

    const range = sheet.getDataRange();
    const values = range.getValues();

    if (values.length === 0) {
      return jsonResponse({ meta: { total: 0, headers: [] }, data: [] });
    }

    const headers = values[0].map((h) => String(h).trim()).filter((h) => h.length > 0);
    const rows = values.slice(1);

    const data = rows
      .filter((row) => row.some((cell) => String(cell).trim() !== '')) // lewati baris kosong
      .map((row, idx) => {
        const item = { id: idx + 1 };
        headers.forEach((header, colIdx) => {
          let cell = row[colIdx];
          if (cell instanceof Date) {
            cell = Utilities.formatDate(cell, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          }
          item[header] = cell === undefined || cell === null ? '' : cell;
        });
        return item;
      });

    const payload = {
      meta: {
        total: data.length,
        headers: headers,
        generatedAt: new Date().toISOString(),
      },
      data: data,
    };

    return jsonResponse(payload);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
