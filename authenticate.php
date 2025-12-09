<?php
// FILE: authenticate.php

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// 1. DATABASE CONNECTION PARAMETERS (CHANGE THESE!)
$host = 'localhost';
$db   = 'freshcart_db';
$user = 'your_db_user'; // e.g., 'root'
$pass = 'your_db_password'; // WARNING: Use a secure password!

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 2. PREPARE THE QUERY to prevent SQL injection
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if ($user) {
        // 3. VERIFY PASSWORD (using password_verify for security)
        // Since we are mocking, we'll do a plain check for now:
        if ($password === 'p187' || $password === 'p188' || $password === 's216' || $password === 's224' || $password === 'u262') { 
            echo json_encode(['success' => true]);
        } else {
             echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        }
        
        // --- REAL-WORLD CODE WOULD BE: ---
        // if (password_verify($password, $user['password_hash'])) {
        //     echo json_encode(['success' => true]);
        // } else {
        //     echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        // }

    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }

} catch (PDOException $e) {
    // Log the error securely and send a generic failure message to the client
    error_log("DB Error: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'A server error occurred.']);
}
?>