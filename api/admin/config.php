<?php
// APP_KEY global untuk mengacak token keamanan
define('APP_KEY', 'P4h4m_Secur3_Key_2026!@#');

// Fungsi otomatis untuk membuat token aman, mirip cara kerja Laravel
function buat_token($username) {
    return hash('sha256', APP_KEY . $username);
}
?>