document.addEventListener('DOMContentLoaded', async function () {
    const sheetId = '1MWACcEAcmVtizHWDi9v8Vz8z_IYYKRAenI31GNud4sk';
    const sheetName = 'submissions';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const els = {
        titleInput: document.getElementById('filter-title'),
        categorySelect: document.getElementById('filter-category'),
        statusSelect: document.getElementById('filter-status'),
        filterButton: document.getElementById('filter-submit'),

        keywordInput: document.getElementById('search-keyword'),
        keywordButton: document.getElementById('search-submit'),

        resultInfo: document.getElementById('catalog-result-info'),
        list: document.getElementById('catalog-document-list'),
        pagination: document.getElementById('catalog-pagination'),
        errorBox: document.getElementById('catalog-error')
    };

    if (!els.list) return;

    const ITEMS_PER_PAGE = 6;

    let allData = [];
    let filteredData = [];
    let currentPage = 1;

    try {
        const response = await fetch(url);
        const text = await response.text();

        const jsonText = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonText);

        const rows = json.table.rows || [];
        allData = rows.map(row => mapRowToObject(row));

        bindEvents();
        applyFilters();
    } catch (error) {
        console.error('Gagal mengambil data spreadsheet:', error);

        if (els.list) {
            els.list.innerHTML = `
                <div class="alert alert-danger">
                    Data katalog belum dapat dimuat.
                </div>
            `;
        }

        if (els.errorBox) {
            els.errorBox.style.display = 'block';
            const alertEl = els.errorBox.querySelector('.alert');
            if (alertEl) {
                alertEl.textContent = 'Terjadi kesalahan saat mengambil data spreadsheet.';
            }
        }
    }

    function bindEvents() {
        if (els.filterButton) {
            els.filterButton.addEventListener('click', function () {
                currentPage = 1;
                applyFilters();
            });
        }

        if (els.keywordButton) {
            els.keywordButton.addEventListener('click', function () {
                currentPage = 1;
                applyFilters();
            });
        }

        if (els.titleInput) {
            els.titleInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    currentPage = 1;
                    applyFilters();
                }
            });
        }

        if (els.keywordInput) {
            els.keywordInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    currentPage = 1;
                    applyFilters();
                }
            });
        }

        if (els.categorySelect) {
            els.categorySelect.addEventListener('change', function () {
                currentPage = 1;
                applyFilters();
            });
        }

        if (els.statusSelect) {
            els.statusSelect.addEventListener('change', function () {
                currentPage = 1;
                applyFilters();
            });
        }
    }

    function applyFilters() {
        const titleValue = normalizeText(els.titleInput ? els.titleInput.value : '');
        const keywordValue = normalizeText(els.keywordInput ? els.keywordInput.value : '');
        const categoryValue = String(els.categorySelect ? els.categorySelect.value : 'ALL')
            .trim()
            .toUpperCase();
        const statusValue = String(els.statusSelect ? els.statusSelect.value : 'ALL')
            .trim()
            .toUpperCase();

        filteredData = allData.filter(item => {
            const titleMatch = !titleValue || normalizeText(item.judul).includes(titleValue);

            const keywordMatch =
                !keywordValue ||
                normalizeText(
                    [
                        item.judul,
                        item.jenis,
                        item.kategori,
                        item.topik,
                        item.penulis,
                        item.instansi,
                        item.abstrak,
                        item.status
                    ].join(' ')
                ).includes(keywordValue);

            const categoryMatch =
                categoryValue === 'ALL' ||
                String(item.jenis).toUpperCase() === categoryValue ||
                String(item.kategori).toUpperCase() === categoryValue;

            const statusMatch = statusValue === 'ALL' || String(item.status).trim().toUpperCase() === statusValue;

            return titleMatch && keywordMatch && categoryMatch && statusMatch;
        });

        renderResultInfo();
        renderPage();
    }

    function renderResultInfo() {
        if (!els.resultInfo) return;

        els.resultInfo.innerHTML = `
            <div class="small text-muted">
                Menampilkan <strong>${formatNumber(filteredData.length)}</strong> dokumen
            </div>
        `;
    }

    function renderPage() {
        if (!els.list) return;

        if (els.errorBox) {
            els.errorBox.style.display = 'none';
        }

        const totalItems = filteredData.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const items = filteredData.slice(startIndex, endIndex);

        if (!items.length) {
            els.list.innerHTML = `
                <div class="alert alert-warning">
                    Dokumen tidak ditemukan.
                </div>
            `;
        } else {
            els.list.innerHTML = items.map(renderCard).join('');
        }

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!els.pagination) return;

        if (totalPages <= 1) {
            els.pagination.innerHTML = '';
            return;
        }

        let html = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">«</a>
            </li>
        `;

        for (let page = 1; page <= totalPages; page++) {
            html += `
                <li class="page-item ${page === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${page}">${page}</a>
                </li>
            `;
        }

        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">»</a>
            </li>
        `;

        els.pagination.innerHTML = html;

        els.pagination.querySelectorAll('a[data-page]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const page = Number(this.dataset.page);
                if (!page || page < 1 || page > totalPages || page === currentPage) return;

                currentPage = page;
                renderPage();

                window.scrollTo({
                    top: document.querySelector('.catalog-page')?.offsetTop || 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    function renderCard(item) {
        const detailUrl = `detail.html?id=${encodeURIComponent(item.id)}`;
        const downloadUrl = buildDownloadUrl(item.file_id, item.file_url);
        const previewImage = item.thumbnail || 'assets/img/portfolio/placeholder.jpg';

        return `
            <div class="catalog-document-card">
                <div class="catalog-doc-thumb">
                    <img
                        src="${escapeHtml(previewImage)}"
                        alt="${escapeHtml(item.judul)}"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='assets/img/portfolio/placeholder.jpg';"
                    />
                </div>

                <div class="catalog-doc-content">
                    <div class="catalog-doc-badges">
                        <span class="badge-doc badge-blue">${escapeHtml(formatJenisLabel(item.jenis))}</span>
                        <span class="badge-doc ${getStatusBadgeClass(item.status)}">${escapeHtml(formatStatusLabel(item.status))}</span>
                    </div>

                    <h3 class="catalog-doc-title">
                        ${escapeHtml(item.judul || 'Tanpa Judul')}
                    </h3>

                    <div class="catalog-doc-meta">
                        <span><i class="bi bi-eye"></i> ${formatNumber(item.views)}</span>
                        <span><i class="bi bi-download"></i> ${formatNumber(item.download_count)}</span>
                    </div>

                    <div class="catalog-doc-actions">
                        <a href="${detailUrl}" class="btn-doc-action btn-doc-view">Lihat Dokumen</a>
                        <a
                            href="${escapeHtml(downloadUrl)}"
                            class="btn-doc-action btn-doc-download"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Unduh Dokumen
                        </a>
                    </div>
                </div>
            </div>
        `;
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

    function formatJenisLabel(jenis) {
        const value = String(jenis || '')
            .trim()
            .toUpperCase();

        if (value === 'BAHAN_AJAR') return 'BAHAN AJAR';
        return value || 'DOKUMEN';
    }

    function formatStatusLabel(status) {
        const value = String(status || '').trim();
        return value || '-';
    }

    function getStatusBadgeClass(status) {
        const value = String(status || '')
            .trim()
            .toLowerCase();

        if (value === 'published' || value === 'berlaku' || value === 'publik') {
            return 'badge-green';
        }

        if (value === 'tidak berlaku') {
            return 'badge-red';
        }

        return 'badge-gray';
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
    }

    function normalizeText(value) {
        return String(value || '')
            .toLowerCase()
            .trim();
    }

    function escapeHtml(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
