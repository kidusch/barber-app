#!/bin/bash

# Configuration
FTP_HOST="barber-dashboard.abyssinia-vs.ch"
FTP_USER="sy85i_barber"
FTP_PASS="Adminbarber12."
REMOTE_DIR="/sites/barber-dashboard.abyssinia-vs.ch"

echo "Starting deployment process..."
echo "Testing FTP connection..."

# Test FTP connection
lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" << EOF
pwd
quit
EOF

if [ $? -ne 0 ]; then
    echo "FTP connection failed. Please check your credentials."
    exit 1
fi

echo "FTP connection successful."

# Create production .env file
echo "Creating production .env file..."
cat > .env << 'EOF'
###> symfony/framework-bundle ###
APP_ENV=prod
APP_SECRET=2846384c0983274bca39847726s92846
APP_DEBUG=0
###< symfony/framework-bundle ###

###> doctrine/doctrine-bundle ###
DATABASE_URL="mysql://sy85i_barber:Adminbarber12.@localhost:3306/sy85i_barber?serverVersion=8.0.32&charset=utf8mb4"
###< doctrine/doctrine-bundle ###

###> nelmio/cors-bundle ###
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
###< nelmio/cors-bundle ###

###> symfony/messenger ###
MESSENGER_TRANSPORT_DSN=doctrine://default
###< symfony/messenger ###
EOF

# Move index.php to public directory if it exists in root
if [ -f "index.php" ]; then
    mv index.php public/index.php
fi

# Install dependencies
echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

# Clear cache
echo "Clearing and warming up cache..."
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod

# Set proper permissions
echo "Setting permissions..."
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 755 bin/console
chmod -R 777 var/
chmod -R 777 public/
chmod -R 777 config/
chmod -R 777 src/
chmod -R 777 vendor/

echo "Starting file upload..."

# Upload files using lftp with verbose output
lftp -c "
set ssl:verify-certificate no;
set ftp:ssl-allow no;
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
set xfer:log yes;
mirror --reverse --verbose --delete --parallel=4 --exclude-glob .git* --exclude-glob .env.* ./ $REMOTE_DIR;
put -O $REMOTE_DIR .env;
quit;
"

echo "Setting remote permissions..."
lftp -c "
set ssl:verify-certificate no;
set ftp:ssl-allow no;
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
chmod 644 $REMOTE_DIR/.htaccess;
chmod 644 $REMOTE_DIR/public/.htaccess;
chmod 644 $REMOTE_DIR/public/index.php;
chmod 644 $REMOTE_DIR/.env;
chmod -R 777 $REMOTE_DIR/var;
chmod -R 777 $REMOTE_DIR/public;
chmod -R 777 $REMOTE_DIR/config;
chmod -R 777 $REMOTE_DIR/src;
chmod -R 777 $REMOTE_DIR/vendor;
chmod -R 755 $REMOTE_DIR/bin;
quit;
"

# List remote directory contents
echo "Listing remote directory contents..."
lftp -c "
set ssl:verify-certificate no;
set ftp:ssl-allow no;
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
ls -la $REMOTE_DIR;
ls -la $REMOTE_DIR/public;
quit;
"

echo "Deployment completed!"
echo "Please check http://barber-dashboard.abyssinia-vs.ch/ to verify the application is working" 