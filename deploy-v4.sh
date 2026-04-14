#!/bin/bash

# Deploy orderflow v4 to DigitalOcean
echo "🚀 Deploying orderflow_1304262038-v4.html to DigitalOcean..."

SERVER_IP="165.22.55.118"
LOCAL_FILE="orderflow_1304262038-v4.html"
REMOTE_DIR="/var/www/orderflow"

echo "📤 Uploading file..."
scp "$LOCAL_FILE" root@${SERVER_IP}:${REMOTE_DIR}/

if [ $? -eq 0 ]; then
    echo "✅ File uploaded successfully!"
    echo ""
    echo "🌐 Your orderflow v4 terminal is now available at:"
    echo "   http://${SERVER_IP}:8080/${LOCAL_FILE}"
    echo ""
    echo "✅ Deployment complete!"
else
    echo "❌ Upload failed!"
    exit 1
fi
