document.addEventListener('DOMContentLoaded', async function () {
    const sheetId = '1MWACcEAcmVtizHWDi9v8Vz8z_IYYKRAenI31GNud4sk';
    const sheetName = 'submissions';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const container = document.getElementById('popular-list');
    const filterButtons = document.querySelectorAll('#popular-filters li');

    if (!container) return;

    let allData = [];

    try {
        const response = await fetch(url);
        const text = await response.text();

        const jsonText = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonText);

        const rows = json.table.rows || [];
        const data = rows.map(row => mapRowToObject(row));

        allData = data
            .filter(item => String(item.status).toLowerCase() === 'published')
            .map(item => ({
                ...item,
                score: getScore(item)
            }))
            .sort((a, b) => b.score - a.score);

        renderByFilter('all');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('filter-active'));
                this.classList.add('filter-active');

                const filterValue = this.dataset.filter;
                renderByFilter(filterValue);
            });
        });
    } catch (error) {
        console.error('Gagal mengambil data spreadsheet:', error);
        container.innerHTML = `
            <div class="col-12">
                <p>Data publikasi belum dapat dimuat.</p>
            </div>
        `;
    }

    function renderByFilter(filterValue) {
        if (filterValue === 'all') {
            const modulTop = getTopByJenis('MODUL', 1);
            const bahanajarTop = getTopByJenis('BAHAN_AJAR', 1);
            const artikelTop = getTopByJenis('ARTIKEL', 1);

            const mixedTop = [...modulTop, ...bahanajarTop, ...artikelTop];
            renderList(mixedTop);
            return;
        }

        const filteredTop = getTopByJenis(filterValue, 3);
        renderList(filteredTop);
    }

    function getTopByJenis(jenis, limit = 3) {
        return allData
            .filter(item => String(item.jenis).toUpperCase() === jenis)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    function getScore(item) {
        const views = Number(item.views) || 0;
        const likes = Number(item.likes) || 0;
        return views + likes;
    }

    function renderList(items) {
        if (!items.length) {
            container.innerHTML = `
                <div class="col-12">
                    <p>Belum ada publikasi untuk ditampilkan.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(renderCard).join('');

        if (typeof GLightbox === 'function') {
            GLightbox({ selector: '.glightbox' });
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

        if (value === 'BAHANaJAR' || value === 'BAHAN AJAR' || value === 'BAHAN_AJAR') {
            return 'BAHAN_AJAR';
        }

        return value;
    }

    function buildThumbnail(fileId, thumbnailValue) {
        if (thumbnailValue) return thumbnailValue;
        if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=s1200`;
        return 'assets/img/portfolio/placeholder.jpg';
    }
    function renderCard(item) {
        const detailUrl = `detail.html?id=${encodeURIComponent(item.id)}`;
        const previewImage = item.thumbnail || 'assets/img/portfolio/placeholder.jpg';

        return `
        <div class="col-lg-4 col-md-6">
            <div class="portfolio-content h-100">
                <a href="${detailUrl}" class="portfolio-thumb d-block">
                    <img
                        src="${escapeHtml(previewImage)}"
                        alt="${escapeHtml(item.judul)}"
                        referrerpolicy="no-referrer"
                    />
                </a>

                <div class="portfolio-info">
                    <h4>
                        <a href="${detailUrl}">${escapeHtml(item.judul)}</a>
                    </h4>
                    <p>👁 ${formatNumber(item.views)} · 👍 ${formatNumber(item.likes)}</p>

                    <a
                        href="${escapeHtml(previewImage)}"
                        title="${escapeHtml(item.judul)}"
                        class="glightbox preview-link"
                    >
                        <i class="bi bi-zoom-in"></i>
                    </a>

                    <a href="${detailUrl}" title="Lihat Detail" class="details-link">
                        <i class="bi bi-link-45deg"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
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
