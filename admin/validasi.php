<?php
session_start();
?>

<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Akses Ditolak - PAHAM</title>

    <link href="../assets/img/favicon.png" rel="icon">
    <link href="../assets/img/apple-touch-icon.png" rel="apple-touch-icon">

    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" />
    <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="../assets/vendor/aos/aos.css" rel="stylesheet">
    <link href="../assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
    <link href="../assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

    <link href="../assets/css/main.css" rel="stylesheet">
</head>

<body>

    <!-- Navbar -->
    <header id="header" class="header d-flex align-items-center fixed-top">
        <div class="container-fluid container-xl position-relative d-flex align-items-center">

            <a href="index.html" class="logo d-flex align-items-center me-auto">
                <img src="../assets/img/logo.png" alt="">
                <h1 class="sitename">PAHAM</h1>
            </a>

            <nav id="navmenu" class="navmenu">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../index.html#about">Tentang</a></li>
                    <li><a href="../index.html#services">Kategori</a></li>
                    <li><a href="../katalog.html">Katalog Dokumen</a></li>
                </ul>
                <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>

            <a class="btn-getstarted flex-md-shrink-0" href="../upload.html">
                Upload Karya
            </a>

        </div>
    </header>

    <main class="main">

        <section class="section" style="padding-top: 180px; padding-bottom: 120px;">
            <div class="container">
                <div class="text-center">
                    <h1 class="display-1 fw-bold text-primary">
                        403
                    </h1>
                    <h2 class="mb-3">
                        Akses Ditolak
                    </h2>
                    <p class="text-muted mb-4">
                        Halaman Admin PAHAM hanya dapat diakses oleh administrator yang berwenang.
                    </p>
                    <div class="d-flex justify-content-center gap-3 flex-wrap">
                        <a href="admin_login.php" class="btn btn-primary">
                            <i class="bi bi-box-arrow-in-right"></i>
                            Login Administrator
                        </a>
                        <a href="index.html" class="btn btn-outline-primary">
                            <i class="bi bi-house"></i>
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer id="footer" class="footer">
        <div class="container footer-top">
            <div class="row gy-4 justify-content-center align-items-center text-center text-lg-start">
                <div class="col-lg-4 col-md-6 footer-about">
                    <a href="index.html" class="d-flex align-items-center">
                        <img src="../assets/img/logo.png" style="height:50px; margin-right:10px;">
                        <span class="sitename">
                            Kementerian Hak Asasi Manusia Republik Indonesia
                        </span>
                    </a>
                    <p class="mt-3">
                        Publikasi Akademik Hak Asasi Manusia
                    </p>
                </div>
                <div class="col-lg-4 col-md-6 footer-contact">
                    <h4>Hubungi Kami</h4>
                    <p>
                        Jl. HR. Rasuna Said Kav – 4 - 5
                        Kuningan Jakarta Selatan
                        Jakarta, Indonesia
                    </p>
                    <p class="mt-3">
                        <strong>Telp :</strong> (021) – 252 1344
                    </p>
                    <p>
                        <strong>Fax :</strong> (021) – 252 2915
                    </p>
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
                <strong class="px-1 sitename">
                    - Pandu Hedo Muhaimin
                </strong>
            </p>
        </div>

    </footer>

    <a href="#" id="scroll-top"
        class="scroll-top d-flex align-items-center justify-content-center">
        <i class="bi bi-arrow-up-short"></i>
    </a>

    <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/vendor/aos/aos.js"></script>
    <script src="../assets/vendor/glightbox/js/glightbox.min.js"></script>
    <script src="../assets/vendor/swiper/swiper-bundle.min.js"></script>
    <script src="../assets/js/main.js"></script>

</body>

</html>