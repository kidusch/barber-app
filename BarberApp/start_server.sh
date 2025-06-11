#!/bin/bash

# SSH Configuration
SSH_HOST="ftp.habesha-cuisine.ch"
SSH_USER="u681833359.barber"
SSH_PASS="Adminbarber12."
REMOTE_DIR="/barber-dashboard"

echo "Connecting to server and starting Symfony..."

# Start Symfony server in production mode
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" << EOF
cd $REMOTE_DIR
php bin/console server:start 0.0.0.0:8000 --env=prod
EOF

if [ $? -eq 0 ]; then
    echo "Symfony server started successfully!"
    echo "You can access your application at: http://barbershop-dashboard.habesha-cuisine.ch:8000"
else
    echo "Failed to start Symfony server. Please check the SSH connection and server status."
fi 