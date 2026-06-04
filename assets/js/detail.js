document.addEventListener('DOMContentLoaded', async function () {
    const sheetId = '1MWACcEAcmVtizHWDi9v8Vz8z_IYYKRAenI31GNud4sk';
    const sheetName = 'submissions';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const params = new URLSearchParams(window.location.search);
    const docId = params.get('id');

    const els = {
        title: document.getElementById('doc-title'),
        frame: document.getElementById('doc-frame'),
        jenis: document.getElementById('meta-jenis'),
        kategori: document.getElementById('meta-kategori'),
        topik: document.getElementById('meta-topik'),
        penulis: document.getElementById('meta-penulis'),
        tahun: document.getElementById('meta-tahun'),
        status: document.getElementById('meta-status'),
        abstrak: document.getElementById('meta-abstrak'),
        views: document.getElementById('doc-views'),
        downloads: document.getElementById('doc-downloads'),
        downloadLink: document.getElementById('doc-download-link'),
        errorBox: document.getElementById('doc-error')
    };

    if (!docId) {
        showError('Parameter id tidak ditemukan di URL.');
        return;
    }

    try {
        const response = await fetch(url);
        const text = await response.text();

        const jsonText = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonText);

        const rows = json.table.rows || [];
        const data = rows.map(mapRowToObject);

        const item = data.find(row => String(row.id) === String(docId));

        if (!item) {
            showError('Dokumen dengan ID tersebut tidak ditemukan.');
            return;
        }

        renderDocument(item);
    } catch (error) {
        console.error('Gagal memuat detail dokumen:', error);
        showError('Terjadi kesalahan saat mengambil data spreadsheet.');
    }

    function renderDocument(item) {
        document.title = `${safeText(item.judul)} - PAHAM`;

        if (els.title) els.title.textContent = safeText(item.judul, 'Tanpa Judul');

        if (els.jenis) els.jenis.textContent = safeText(item.jenis);
        if (els.kategori) els.kategori.textContent = safeText(item.kategori);
        if (els.topik) els.topik.textContent = safeText(item.topik);
        if (els.penulis) els.penulis.textContent = safeText(item.penulis);
        if (els.tahun) els.tahun.textContent = safeText(item.tahun);
        if (els.status) els.status.textContent = safeText(item.status);
        if (els.abstrak) els.abstrak.textContent = safeText(item.abstrak, '-');

        if (els.views) els.views.textContent = formatNumber(item.views);
        if (els.downloads) els.downloads.textContent = formatNumber(item.download_count);

        const previewUrl = buildPreviewUrl(item.file_id, item.file_url);
        if (els.frame && previewUrl) {
            els.frame.src = previewUrl;
        }

        const downloadUrl = buildDownloadUrl(item.file_id, item.file_url);
        if (els.downloadLink && downloadUrl) {
            els.downloadLink.href = downloadUrl;
        }

        if (els.errorBox) {
            els.errorBox.style.display = 'none';
        }
    }

    function showError(message) {
        if (els.title) els.title.textContent = 'Dokumen tidak ditemukan';
        if (els.abstrak) els.abstrak.textContent = message;
        if (els.errorBox) {
            els.errorBox.style.display = 'block';
            els.errorBox.querySelector('.alert').textContent = message;
        }
    }

    function mapRowToObject(row) {
        const cells = row.c || [];

        return {
            id: getCellValue(cells, 0),
            judul: getCellValue(cells, 1),
            jenis: normalizeJenis(getCellValue(cells, 2)),
            kategori: getCellValue(cells, 3),
            topik: getCellValue(cells, 4),
            penulis: getCellValue(cells, 5),
            ig_penulis: getCellValue(cells, 6),
            instansi: getCellValue(cells, 7),
            tahun: getCellValue(cells, 8),
            abstrak: getCellValue(cells, 9),
            file_id: getCellValue(cells, 10),
            file_url: getCellValue(cells, 11),
            thumbnail: buildThumbnail(getCellValue(cells, 10), getCellValue(cells, 12)),
            status: getCellValue(cells, 13),
            views: getCellValue(cells, 14),
            likes: getCellValue(cells, 15),
            download_count: getCellValue(cells, 16),
            slug: getCellValue(cells, 17),
            upload_date: getCellValue(cells, 18),
            version: getCellValue(cells, 19),
            update_date: getCellValue(cells, 20),
            revision_note: getCellValue(cells, 21)
        };
    }

    function getCellValue(cells, index) {
        if (!cells[index]) return '';
        return cells[index].v ?? '';
    }

    function normalizeJenis(jenis) {
        const value = String(jenis || '')
            .trim()
            .toUpperCase();

        if (value === 'BAHANAJAR' || value === 'BAHAN AJAR' || value === 'BAHAN_AJAR') {
            return 'BAHAN_AJAR';
        }

        return value;
    }

    function buildThumbnail(fileId, thumbnailValue) {
        if (thumbnailValue) return thumbnailValue;
        if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=s1200`;
        return 'assets/img/portfolio/placeholder.jpg';
    }

    function buildPreviewUrl(fileId, fileUrl) {
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }

        const extractedId = extractDriveFileId(fileUrl);
        if (extractedId) {
            return `https://drive.google.com/file/d/${extractedId}/preview`;
        }

        return '';
    }

    function buildDownloadUrl(fileId, fileUrl) {
        if (fileId) {
            return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

        const extractedId = extractDriveFileId(fileUrl);
        if (extractedId) {
            return `https://drive.google.com/uc?export=download&id=${extractedId}`;
        }

        return fileUrl || '#';
    }

    function extractDriveFileId(url) {
        const value = String(url || '');

        const patterns = [/\/file\/d\/([^/]+)/, /[?&]id=([^&]+)/, /\/d\/([^/]+)/];

        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return '';
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
    }

    function safeText(value, fallback = '-') {
        const text = String(value ?? '').trim();
        return text || fallback;
    }
});
