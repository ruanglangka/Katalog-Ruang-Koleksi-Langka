/**
 * KATALOG PERPUSTAKAAN — Google Apps Script API
 * ================================================
 * Script ini membaca data dari Google Spreadsheet dan menyajikannya
 * sebagai JSON API gratis yang bisa diakses oleh website React.
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang berisi data buku (13.253 baris).
 *    Baris pertama HARUS berisi nama kolom (header), contoh:
 *    No | Nomor Panggil | Judul | Pengarang | Edisi | Penerbit |
 *    Kota Terbit | Tahun Terbit | ISBN | Deskripsi Fisik | Subjek |
 *    Klasifikasi | Lokasi | Bahasa | Catatan
 *    (Nama kolom bebas — script ini otomatis menyesuaikan header apa pun.)
 *
 * 2. Di spreadsheet, buka menu: Extensions/Ekstensi > Apps Script.
 * 3. Hapus isi default Code.gs, lalu tempel (paste) seluruh isi file ini.
 * 4. Ganti SHEET_NAME di bawah jika nama sheet/tab kamu bukan "Data".
 * 5. Klik Deploy > New deployment (Deploy Baru).
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (Siapa saja)
 * 6. Salin URL Web App yang muncul (diakhiri /exec).
 * 7. Tempelkan URL itu ke file .env di project React sebagai VITE_API_URL.
 *
 * Setiap kali admin mengubah/menambah data di spreadsheet, cukup buka
 * ulang website (atau klik "Segarkan data") — TIDAK perlu deploy ulang,
 * TIDAK perlu edit kode apa pun.
 */

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
