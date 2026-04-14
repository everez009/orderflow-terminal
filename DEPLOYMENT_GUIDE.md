# Deploy Orderflow Terminal to DigitalOcean

## Quick Deployment Steps

### Option 1: Using the Deployment Script (Recommended)

1. **Edit the deployment script** with your server details:
   ```bash
   nano deploy-to-digitalocean.sh
   ```
   
   Update these lines:
   ```bash
   DO_SERVER_IP="your_droplet_ip"  # Your DigitalOcean Droplet IP
   DO_USER="root"  # Your SSH username (usually 'root' or 'ubuntu')
   ```

2. **Make the script executable**:
   ```bash
   chmod +x deploy-to-digitalocean.sh
   ```

3. **Run the deployment**:
   ```bash
   ./deploy-to-digitalocean.sh
   ```

---

### Option 2: Manual Deployment

If you prefer manual steps:

#### Step 1: Upload the file to your server
```bash
scp orderflow_1304262038-v2.html root@YOUR_DROPLET_IP:/var/www/orderflow/
```

#### Step 2: SSH into your server
```bash
ssh root@YOUR_DROPLET_IP
```

#### Step 3: Create directory and start server
```bash
# Create directory
mkdir -p /var/www/orderflow

# Move file if needed
mv orderflow_1304262038-v2.html /var/www/orderflow/

# Kill any existing server on port 8080
pkill -f "python.*8080" 2>/dev/null || true

# Start HTTP server on port 8080
cd /var/www/orderflow
nohup python3 -m http.server 8080 > /var/log/orderflow.log 2>&1 &

# Verify it's running
ps aux | grep "http.server 8080"
```

#### Step 4: Configure Firewall (if needed)
```bash
# Allow port 8080 through firewall
ufw allow 8080/tcp
ufw reload
```

---

## Access Your Orderflow Terminal

Once deployed, access it at:
```
http://YOUR_DROPLET_IP:8080/orderflow_1304262038-v2.html
```

---

## Troubleshooting

### Check if server is running:
```bash
ssh root@YOUR_DROPLET_IP "ps aux | grep 'http.server 8080'"
```

### Check server logs:
```bash
ssh root@YOUR_DROPLET_IP "tail -f /var/log/orderflow.log"
```

### Restart the server:
```bash
ssh root@YOUR_DROPLET_IP << 'EOF'
    pkill -f "python.*8080" 2>/dev/null || true
    sleep 1
    cd /var/www/orderflow
    nohup python3 -m http.server 8080 > /var/log/orderflow.log 2>&1 &
    echo "Server restarted"
EOF
```

### Check if port 8080 is open:
```bash
ssh root@YOUR_DROPLET_IP "netstat -tlnp | grep 8080"
```

---

## Auto-Start on Server Reboot (Optional)

To make the server start automatically after reboot, add to crontab:

```bash
ssh root@YOUR_DROPLET_IP "crontab -l 2>/dev/null; echo '@reboot cd /var/www/orderflow && nohup python3 -m http.server 8080 > /var/log/orderflow.log 2>&1 &' | crontab -"
```

---

## Notes

- The Python HTTP server is simple and suitable for serving static HTML files
- For production use with high traffic, consider using Nginx or Apache
- Make sure port 8080 is open in your DigitalOcean firewall settings
- The file will be accessible to anyone who knows the URL
