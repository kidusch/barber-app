<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// FTP connection details
$ftp_server = "ftp.habesha-cuisine.ch";
$ftp_username = "u681833359.barber";
$ftp_password = "Adminbarber12.";

// Try to connect
echo "Attempting to connect to $ftp_server...\n";
$conn_id = ftp_connect($ftp_server);

if ($conn_id === false) {
    die("Could not connect to $ftp_server\n");
}

echo "Connected to $ftp_server\n";

// Try to login
echo "Attempting to login...\n";
if (@ftp_login($conn_id, $ftp_username, $ftp_password)) {
    echo "Successfully logged in as $ftp_username\n";
    
    // Get current directory
    $current_dir = ftp_pwd($conn_id);
    echo "Current directory: $current_dir\n";
    
    // List directory contents
    echo "Directory contents:\n";
    $contents = ftp_nlist($conn_id, ".");
    print_r($contents);
} else {
    echo "Login failed for user $ftp_username\n";
}

// Close the connection
if ($conn_id) {
    ftp_close($conn_id);
    echo "FTP connection closed\n";
} 