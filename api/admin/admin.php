<?php
include 'config.php';

// Validasi Token Cookie yang dikirim oleh browser
$token_sah = buat_token('Hedom');

if (!isset($_COOKIE['admin_session']) || $_COOKIE['admin_session'] !== $token_sah) {
    // Jika tidak punya akses, tendang ke halaman login
    header("Location: admin_login.php");
    exit;
}
?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Admin Panel PAHAM</title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />

    <link href="../../assets/img/favicon.png" rel="icon" />
    <link href="../../assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" />
    <link href="../../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
    <link href="../../assets/vendor/aos/aos.css" rel="stylesheet" />
    <link href="../../assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
    <link href="../../assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
    <link href="../../assets/css/main.css" rel="stylesheet" />
</head>

<body class="blog-page">
    <header id="header" class="header d-flex align-items-center fixed-top">
        <div class="container-fluid container-xl position-relative d-flex align-items-center">
            <a href="../../index.html" class="logo d-flex align-items-center me-auto">
                <img src="../../assets/img/logo.png" alt="" />
                <h1 class="sitename">PAHAM</h1>
            </a>
            <nav id="navmenu" class="navmenu">
                <ul>
                    <li><a href="../../index.html">Home</a></li>
                    <li><a href="../../index.html#about">Tentang</a></li>
                    <li><a href="../../index.html#services">Kategori</a></li>
                    <li><a href="../../katalog.html">Katalog Dokumen</a></li>
                    <li><a href="../../upload.html">Upload</a></li>
                    <a href="logout.php" class="btn btn-danger">
                        <i class="bi bi-box-arrow-right"></i>
                        Logout
                    </a>
                </ul>
                <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
        </div>
    </header>

    <main class="main">
        <section class="upload-page section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="upload-card">
                            <div class="upload-header">
                                <h2>Admin Panel</h2>
                                <p>Kelola dokumen masuk (pending), approve, revisi, atau tolak.</p>
                            </div>
                            <div class="row g-3 mb-4">
                                <div class="col-md-4">
                                    <select id="filterStatus" class="form-select">
                                        <option value="">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="published">Published</option>
                                        <option value="revision">Revision</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div class="col-md-5">
                                    <input
                                        type="text"
                                        id="searchInput"
                                        class="form-control"
                                        placeholder="Cari judul dokumen..." />
                                </div>
                                <div class="col-md-3">
                                    <button id="btnFilter" class="btn btn-primary w-100 btn-upload-submit">
                                        <i class="bi bi-search"></i> Cari
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Judul</th>
                                            <th>Jenis</th>
                                            <th>Penulis</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBody">
                                        <tr>
                                            <td colspan="6" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="adminAlert" class="alert mt-4 d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="previewModalLabel">Preview Dokumen</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <div class="modal-body p-0">
                    <iframe
                        id="previewFrame"
                        src=""
                        style="width: 100%; height: 75vh; border: 0"
                        title="Preview PDF"></iframe>
                </div>
                <div class="modal-footer">
                    <a id="previewOpenNewTab" href="#" target="_blank" class="btn btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right"></i> Buka di Tab Baru
                    </a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>

    <footer id="footer" class="footer">
        <div class="container footer-top">
            <div class="row gy-4 justify-content-center align-items-center text-center text-lg-start">
                <div class="col-lg-4 col-md-6 footer-about">
                    <a href="../../index.html" class="d-flex align-items-center">
                        <img src="../../assets/img/logo.png" style="height: 50px; margin-right: 10px" />
                        <span class="sitename">Kementerian Hak Asasi Manusia Republik Indonesia</span>
                    </a>
                    <p class="mt-3">Publikasi Akademik Hak Asasi Manusia</p>
                </div>

                <div class="col-lg-4 col-md-6 footer-contact">
                    <h4>Hubungi Kami</h4>
                    <p>Jl. HR. Rasuna Said Kav – 4 - 5 Kuningan Jakarta Selatan Jakarta, Indonesia</p>
                    <p class="mt-3"><strong>Telp :</strong> (021) – 252 1344</p>
                    <p><strong>Fax :</strong> (021) – 252 2915</p>
                </div>

                <div class="col-lg-3 col-md-6 footer-contact">
                    <h4>Pusat Pengembangan Sumber Daya Manusia</h4>
                    <p><strong>Telp :</strong> (021) – 252 1344</p>
                    <p><strong>Fax :</strong> (021) – 252 2915</p>
                    <p><strong>Email :</strong> ppsdm@kemenham.go.id</p>
                </div>
            </div>
        </div>

        <div class="container copyright text-center">
            <p>
                © <span>Copyright</span>
                <strong class="px-1 sitename">- Pandu Hedo Muhaimin</strong>
            </p>
        </div>
    </footer>

    <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center">
        <i class="bi bi-arrow-up-short"></i>
    </a>

    <script src="../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../../assets/vendor/php-email-form/validate.js"></script>
    <script src="../../assets/vendor/aos/aos.js"></script>
    <script src="../../assets/vendor/glightbox/js/glightbox.min.js"></script>
    <script src="../../assets/vendor/purecounter/purecounter_vanilla.js"></script>
    <script src="../../assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
    <script src="../../assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
    <script src="../../assets/vendor/swiper/swiper-bundle.min.js"></script>
    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/admin.js"></script>
</body>

</html>