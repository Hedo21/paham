const API_URL =
    'https://script.google.com/macros/s/AKfycbyPYP6sT5ZIAMbfmtYP_rVp6_Vy-PCMSUH3AUhnTMksJ6i4elbkS630cBHxKaSH0qEV/exec';

const tableBody = document.getElementById('tableBody');
const filterStatus = document.getElementById('filterStatus');
const searchInput = document.getElementById('searchInput');
const btnFilter = document.getElementById('btnFilter');
const adminAlert = document.getElementById('adminAlert');
const previewFrame = document.getElementById('previewFrame');
const previewOpenNewTab = document.getElementById('previewOpenNewTab');
const previewModalLabel = document.getElementById('previewModalLabel');

let submissions = [];
let previewModal;

document.addEventListener('DOMContentLoaded', () => {
    previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    loadData();
});

btnFilter.addEventListener('click', () => {
    renderTable(applyFilters(submissions));
});

async function loadData() {
    try {
        showAlert('Memuat data dokumen...', 'info');

        const response = await fetch(API_URL + '?action=getSubmissions');
        const raw = await response.text();
        console.log('ADMIN RAW RESPONSE:', raw);

        let result;
        try {
            result = JSON.parse(raw);
        } catch (e) {
            throw new Error('Response bukan JSON: ' + raw);
        }

        if (!result.success) {
            showAlert(result.message || 'Gagal memuat data.', 'danger');
            return;
        }

        submissions = result.data || [];
        renderTable(applyFilters(submissions));
        hideAlert();
    } catch (error) {
        console.error('ADMIN LOAD ERROR:', error);
        showAlert(error.message || 'Terjadi kesalahan saat memuat data.', 'danger');
    }
}

function applyFilters(data) {
    const status = filterStatus.value.trim().toLowerCase();
    const keyword = searchInput.value.trim().toLowerCase();

    return data.filter(item => {
        const matchStatus = status ? String(item.status || '').toLowerCase() === status : true;

        const matchKeyword = keyword
            ? String(item.judul || '')
                  .toLowerCase()
                  .includes(keyword) ||
              String(item.penulis || '')
                  .toLowerCase()
                  .includes(keyword) ||
              String(item.id || '')
                  .toLowerCase()
                  .includes(keyword)
            : true;

        return matchStatus && matchKeyword;
    });
}

function renderTable(data) {
    if (!data.length) {
        tableBody.innerHTML = `
                        <tr>
                            <td colspan="6" class="text-center">Tidak ada data</td>
                        </tr>
                    `;
        return;
    }

    tableBody.innerHTML = data
        .map(item => {
            const status = String(item.status || '').toLowerCase();
            const badgeClass =
                status === 'published'
                    ? 'success'
                    : status === 'revision'
                      ? 'warning'
                      : status === 'rejected'
                        ? 'danger'
                        : 'secondary';

            return `
                            <tr>
                                <td>${escapeHtml(item.id || '-')}</td>
                                <td>${escapeHtml(item.judul || '-')}</td>
                                <td>${escapeHtml(item.jenis || '-')}</td>
                                <td>${escapeHtml(item.penulis || '-')}</td>
                                <td><span class="badge bg-${badgeClass}">${escapeHtml(status || '-')}</span></td>
                                <td>
                                    <div class="d-flex flex-wrap gap-2">
                                        <button class="btn btn-success btn-sm" onclick="updateStatus('${escapeJs(
                                            item.id || ''
                                        )}', 'published')">
                                            Approve
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="updateStatus('${escapeJs(
                                            item.id || ''
                                        )}', 'rejected')">
                                            Tolak
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm" onclick="openPreview('${escapeJs(
                                            item.file_url || ''
                                        )}', '${escapeJs(item.judul || 'Dokumen')}')">
                                            Preview
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
        })
        .join('');
}

function openPreview(fileUrl, title) {
    if (!fileUrl) {
        showAlert('File preview tidak tersedia.', 'danger');
        return;
    }

    const previewUrl = convertDriveUrlToPreview(fileUrl);
    previewModalLabel.textContent = 'Preview Dokumen - ' + title;
    previewFrame.src = previewUrl;
    previewOpenNewTab.href = previewUrl;
    previewModal.show();
}

function convertDriveUrlToPreview(fileUrl) {
    const fileIdMatch = String(fileUrl).match(/[-\w]{25,}/);
    if (!fileIdMatch) return fileUrl;
    return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
}

async function handleRevision(id) {
    const note = prompt('Masukkan catatan revisi:', '');
    if (note === null) return;
    await updateStatus(id, 'revision', note.trim());
}

async function updateStatus(id, status, revisionNote = '') {
    if (!id) return;

    const confirmation = confirm(`Yakin ingin mengubah status dokumen menjadi "${status}"?`);
    if (!confirmation) return;

    try {
        showAlert('Memproses perubahan status...', 'info');

        const payload = {
            action: 'updateStatus',
            id: id,
            status: status,
            revision_note: revisionNote
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        const raw = await response.text();
        console.log('ADMIN UPDATE RESPONSE:', raw);

        let result;
        try {
            result = JSON.parse(raw);
        } catch (e) {
            throw new Error('Response bukan JSON: ' + raw);
        }

        if (!result.success) {
            showAlert(result.message || 'Gagal mengubah status.', 'danger');
            return;
        }

        showAlert(result.message || 'Status berhasil diperbarui.', 'success');
        await loadData();
    } catch (error) {
        console.error('ADMIN UPDATE ERROR:', error);
        showAlert(error.message || 'Terjadi kesalahan saat mengubah status.', 'danger');
    }
}

function showAlert(message, type) {
    adminAlert.className = `alert alert-${type} mt-4`;
    adminAlert.textContent = message;
    adminAlert.classList.remove('d-none');
}

function hideAlert() {
    adminAlert.className = 'alert mt-4 d-none';
    adminAlert.textContent = '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeJs(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
