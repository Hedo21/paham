document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const jenisEl = document.getElementById('jenis');
    const previewIdEl = document.getElementById('previewId');
    const alertEl = document.getElementById('uploadAlert');

    const WEB_APP_URL =
        'https://script.google.com/macros/s/AKfycbyPYP6sT5ZIAMbfmtYP_rVp6_Vy-PCMSUH3AUhnTMksJ6i4elbkS630cBHxKaSH0qEV/exec';

    const previewMap = {
        MODUL: 'modul_XXX',
        BAHAN_AJAR: 'bahanajar_XXX',
        ARTIKEL: 'artikel_XXX'
    };

    jenisEl.addEventListener('change', () => {
        const jenis = jenisEl.value;
        previewIdEl.textContent = previewMap[jenis] || 'akan dibuat otomatis';
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            previewIdEl.textContent = 'akan dibuat otomatis';
        }, 0);
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        hideAlert();

        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (!file) {
            showAlert('Pilih file PDF terlebih dahulu.', 'danger');
            return;
        }

        if (file.type !== 'application/pdf') {
            showAlert('File harus berformat PDF.', 'danger');
            return;
        }

        try {
            showAlert('Sedang mengunggah dokumen...', 'info');

            const base64File = await fileToBase64(file);

            const payload = {
                action: 'uploadSubmission',
                judul: document.getElementById('judul').value.trim(),
                jenis: document.getElementById('jenis').value.trim(),
                kategori: document.getElementById('kategori').value.trim(),
                topik: document.getElementById('topik').value.trim(),
                penulis: document.getElementById('penulis').value.trim(),
                ig_penulis: document.getElementById('ig_penulis').value.trim(),
                instansi: document.getElementById('instansi').value.trim(),
                tahun: document.getElementById('tahun').value.trim(),
                abstrak: document.getElementById('abstrak').value.trim(),
                fileName: file.name,
                mimeType: file.type,
                fileBase64: base64File.split(',')[1]
            };

            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            const raw = await response.text();
            console.log('RAW RESPONSE:', raw);

            let result;
            try {
                result = JSON.parse(raw);
            } catch (parseError) {
                throw new Error('Response bukan JSON: ' + raw);
            }

            if (!result.success) {
                showAlert(result.message || 'Upload gagal.', 'danger');
                return;
            }

            const newId = result.id || 'berhasil dibuat';

            form.reset();

            showAlert(
                `Upload berhasil. Dokumen Anda telah diterima dengan ID ${newId} dan akan ditinjau oleh admin.`,
                'success'
            );
        } catch (error) {
            console.error('UPLOAD ERROR:', error);
            showAlert(error.message || 'Terjadi kesalahan saat upload dokumen.', 'danger');
        }
    });

    function showAlert(message, type) {
        alertEl.className = `alert alert-${type} mt-4`;
        alertEl.textContent = message;
        alertEl.classList.remove('d-none');
    }

    function hideAlert() {
        alertEl.className = 'alert mt-4 d-none';
        alertEl.textContent = '';
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});
