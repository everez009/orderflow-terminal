#!/bin/bash

# Deploy orderflow HTML to DigitalOcean server
# This script uploads the file and starts a simple HTTP server on port 8080

echo "🚀 Deploying orderflow_1304262038-v2.html to DigitalOcean..."

# Configuration - Update these with your DigitalOcean server details
DO_SERVER_IP="165.22.55.118"  # Replace with your actual Droplet IP
DO_USER="root"  # or your SSH username
REMOTE_DIR="/var/www/orderflow"
REMOTE_FILE="orderflow_1304262038-v2.html"
LOCAL_FILE="orderflow_1304262038-v2.html"

# Check if local file exists
if [ ! -f "$LOCAL_FILE" ]; then
    echo "❌ Error: $LOCAL_FILE not found in current directory"
    exit 1
fi

echo "📁 Creating remote directory..."
ssh ${DO_USER}@${DO_SERVER_IP} "mkdir -p ${REMOTE_DIR}"

echo "📤 Uploading file to DigitalOcean..."
scp "${LOCAL_FILE}" ${DO_USER}@${DO_SERVER_IP}:${REMOTE_DIR}/${REMOTE_FILE}

if [ $? -eq 0 ]; then
    echo "✅ File uploaded successfully!"
    
    echo "🌐 Starting/restarting HTTP server on port 8080..."
    ssh ${DO_USER}@${DO_SERVER_IP} << 'EOF'
        # Kill any existing Python HTTP server on port 8080
        pkill -f "python.*8080" 2>/dev/null || true
        sleep 1
        
        # Start new HTTP server in background
        cd /var/www/orderflow
        nohup python3 -m http.server 8080 > /var/log/orderflow.log 2>&1 &
        
        echo "Server PID: $!"
        echo "Server started on port 8080"
    EOF
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your orderflow terminal is now available at:"
    echo "   http://${DO_SERVER_IP}:8080/${REMOTE_FILE}"
    echo ""
    echo "📝 To check server logs: ssh ${DO_USER}@${DO_SERVER_IP} 'tail -f /var/log/orderflow.log'"
else
    echo "❌ Upload failed!"
    exit 1
fi
