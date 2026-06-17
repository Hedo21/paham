<?php
include 'config.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($username === 'Hedom' && $password === 'Hedom123') {
    // Membuat token aman lewat fungsi di config.php
    $token = buat_token($username);

    // Set Cookie dengan pengamanan ketat (HttpOnly & Secure)
    setcookie("admin_session", $token, [
        'expires' => time() + 3600, // Berlaku selama 1 jam
        'path' => '/',
        'secure' => true,           // Wajib HTTPS (Sangat cocok untuk Vercel)
        'httponly' => true,         // Proteksi dari pencurian skrip jahat (Anti-XSS)
        'samesite' => 'Strict'      // Proteksi dari serangan CSRF
    ]);

    header("Location: admin.php");
    exit;
}

// Jika salah, kembalikan ke halaman login dengan pesan eror
header("Location: admin_login.php?error=1");
exit;
