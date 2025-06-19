<?php
$host = "localhost";
$db = "your_db";
$user = "root";
$pass = ""; // باسورد قاعدة البيانات

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);

// تأمين البيانات (بسيط)
$username = $conn->real_escape_string($_POST['username']);
$password = $conn->real_escape_string($_POST['password']);

$sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
if ($conn->query($sql)) {
    echo "تم الحفظ بنجاح";
} else {
    echo "خطأ: " . $conn->error;
}

$conn->close();
?>
$user_ip = $_SERVER['REMOTE_ADDR'];
$page = $_SERVER['REQUEST_URI']; // أو $_SERVER['HTTP_REFERER']

$sql = "INSERT INTO visits (user_ip, page) VALUES ('$user_ip', '$page')";
