<?php
header('Content-Type: text/plain');

echo "PHP Diagnostic Information\n";
echo "=========================\n\n";

// Basic PHP Information
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "\n\n";

// Directory Permissions
echo "Directory Permissions:\n";
echo "----------------------\n";
$dirs = [
    '.',
    '..',
    '../var',
    '../var/cache',
    '../var/log',
    '../public'
];

foreach ($dirs as $dir) {
    $path = realpath($dir);
    if ($path) {
        $perms = fileperms($path);
        echo sprintf(
            "%s: %s (%o)\n",
            $dir,
            $path,
            $perms
        );
    }
}

// PHP Configuration
echo "\nPHP Configuration:\n";
echo "------------------\n";
echo "display_errors: " . ini_get('display_errors') . "\n";
echo "error_reporting: " . ini_get('error_reporting') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "\n\n";

// Environment Variables
echo "Environment Variables:\n";
echo "----------------------\n";
foreach ($_SERVER as $key => $value) {
    if (strpos($key, 'PHP_') === 0 || strpos($key, 'HTTP_') === 0) {
        echo "$key: $value\n";
    }
}
?> 