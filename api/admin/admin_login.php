<?php
session_start();

if (isset($_SESSION['admin'])) {
    header("Location: admin.php");
    exit;
}
?>

<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Login Admin PAHAM</title>

    <link href="../../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="../../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <link href="../../assets/css/main.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" />
</head>

<body>

    <header id="header" class="header d-flex align-items-center fixed-top">
        <div class="container-fluid container-xl position-relative d-flex align-items-center">
            <a href="../../index.html" class="logo d-flex align-items-center me-auto">
                <img src="../../assets/img/logo.png">
                <h1 class="sitename">PAHAM</h1>
            </a>
            <nav id="navmenu" class="navmenu">
                <ul>
                    <li><a href="../../index.html">Home</a></li>
                    <li><a href="../../katalog.html">Katalog</a></li>
                    <li><a href="../../upload.html">Upload</a></li>
                    <li><a href="../../admin_login.php" class="active">Admin</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="main">
        <section class="section" style="margin-top:100px;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-5">
                        <div class="card shadow border-0">
                            <div class="card-body p-4">
                                <div class="text-center mb-4">
                                    <h2>Login Administrator</h2>
                                    <p class="text-muted">
                                        Silakan login untuk mengakses Panel Admin PAHAM
                                    </p>
                                </div>
                                <?php if (isset($_GET['error'])): ?>
                                    <div class="alert alert-danger">
                                        Username atau Password salah.
                                    </div>
                                <?php endif; ?>
                                <form action="login.php" method="POST">
                                    <div class="mb-3">
                                        <label>Username</label>
                                        <input type="password"
                                            name="username"
                                            class="form-control"
                                            required>
                                    </div>
                                    <div class="mb-3">
                                        <label>Password</label>
                                        <input type="password"
                                            name="password"
                                            class="form-control"
                                            required>
                                    </div>
                                    <button type="submit"
                                        class="btn btn-primary w-100">
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

</body>

</html>