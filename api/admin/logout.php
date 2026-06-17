<?php
// Menghapus cookie 'admin_session' dari browser
setcookie("admin_session", "", time() - 3600, "/");

// Lempar kembali ke halaman beranda utama
header("Location: ../../index.html");
exit;
