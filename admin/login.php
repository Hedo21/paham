<?php
session_start();

$username = $_POST['username'];
$password = $_POST['password'];

if (
    $username === 'admin' &&
    $password === '123456'
) {
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    header("Location: admin.php");
    exit;
}

header("Location: admin_login.php?error=1");
exit;
