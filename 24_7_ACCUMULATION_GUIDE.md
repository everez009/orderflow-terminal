# 24/7 Volume Accumulation Setup Guide

## The Problem

**Volume does NOT accumulate when:**
- ❌ Computer is asleep
- ❌ Laptop lid is closed
- ❌ Browser tab is closed
- ❌ Internet is disconnected
- ❌ Computer is turned off

**Why?** The HTML runs in YOUR browser, not on the web server. When your computer sleeps, the browser stops running.

## Solutions for Continuous Accumulation

---

## Option 1: Keep Your Computer Awake (Easiest)

### **Windows:**
```
1. Settings → System → Power & Sleep
2. Set "Sleep" to "Never"
3. Set "Screen" to preferred timeout (saves power)
4. Plug in charger (laptop)
```

### **Mac:**
```
1. System Preferences → Energy Saver
2. Uncheck "Put hard disks to sleep when possible"
3. Check "Prevent computer from sleeping automatically"
4. Or use: caffeinate command in Terminal
   $ caffeinate -i  # Keeps system awake indefinitely
```

### **Linux:**
```bash
# Disable sleep
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# Or use caffeine/caffeine-ng
sudo apt install caffeine
caffeine  # Toggle from system tray
```

### **Pros:**
- ✅ No extra cost
- ✅ Easy to setup
- ✅ Full control

### **Cons:**
- ❌ Uses electricity
- ❌ Computer must stay on
- ❌ Not ideal for laptops (battery/heat)

---

## Option 2: Cloud VPS with Headless Browser (Best for 24/7)

Run the terminal on a cloud server that never sleeps.

### **Step 1: Get a VPS**

**Recommended Providers:**
- DigitalOcean ($5-6/month)
- Linode/Akamai ($5/month)
- AWS EC2 t2.micro (Free tier eligible)
- Google Cloud e2-micro (Free tier)
- Oracle Cloud Always Free

### **Step 2: Install Dependencies**

```bash
# SSH into your VPS
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Puppeteer (headless Chrome)
npm install puppeteer

# Install PM2 (process manager)
sudo npm install -g pm2
```

### **Step 3: Create Automation Script**

Create `volume-accumulator.js`:

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting 24/7 Volume Accumulator...');
  
  // Launch headless browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to your orderflow terminal
  await page.goto('http://your-domain.com/orderflow_1304262038-v4.html', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  
  console.log('✅ Terminal loaded');
  
  // Keep page alive indefinitely
  // Puppeteer will maintain WebSocket connection
  
  // Periodic health check
  setInterval(async () => {
    try {
      // Check if still connected
      const isConnected = await page.evaluate(() => {
        return ws && ws.readyState === WebSocket.OPEN;
      });
      
      if (!isConnected) {
        console.log('⚠️ WebSocket disconnected, reloading...');
        await page.reload({ waitUntil: 'networkidle0' });
      } else {
        console.log('✅ Health check passed - accumulating volume');
      }
    } catch (e) {
      console.error('Health check failed:', e.message);
    }
  }, 60000); // Check every minute
  
  // Handle errors
  page.on('error', (err) => {
    console.error('Page error:', err);
  });
  
  page.on('pageerror', (err) => {
    console.error('Page JS error:', err);
  });
  
  console.log('📊 Volume accumulator running 24/7');
  console.log('💾 Data persists in browser localStorage');
  console.log('🔄 Auto-reconnects on disconnection');
  
})();
```

### **Step 4: Run with PM2**

```bash
# Start the accumulator
pm2 start volume-accumulator.js --name "volume-accum"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it shows you

# Monitor
pm2 logs volume-accum
pm2 status
```

### **Step 5: Access Accumulated Data**

The headless browser saves to its own localStorage. To retrieve:

```javascript
// Add this to your script to export data periodically
setInterval(async () => {
  const vpData = await page.evaluate(() => {
    return {
      PAXGUSDT: JSON.parse(localStorage.getItem('orderflow_vp_PAXGUSDT_vp_' + getVPDateKey()) || '{}'),
      BTCUSDT: JSON.parse(localStorage.getItem('orderflow_vp_BTCUSDT_vp_' + getVPDateKey()) || '{}'),
      journal: JSON.parse(localStorage.getItem('orderflow_journal') || '[]')
    };
  });
  
  // Save to file
  fs.writeFileSync('/path/to/data/vp-backup.json', JSON.stringify(vpData, null, 2));
  console.log('💾 Backup saved');
}, 3600000); // Every hour
```

### **Pros:**
- ✅ True 24/7 accumulation
- ✅ No local computer needed
- ✅ Reliable (cloud uptime >99%)
- ✅ Low cost ($5-6/month)

### **Cons:**
- ❌ Requires setup
- ❌ Monthly cost
- ❌ Need to retrieve data periodically

---

## Option 3: Raspberry Pi (Low-Power 24/7)

Dedicated low-power device that stays on.

### **Hardware:**
- Raspberry Pi 4 (4GB): ~$55
- MicroSD card: ~$10
- Power supply: ~$8
- **Total: ~$73 one-time**

### **Setup:**

```bash
# Install Raspbian OS
# Enable SSH
# Install Chromium browser
sudo apt install chromium-browser

# Create autostart script
nano /home/pi/start-terminal.sh

#!/bin/bash
chromium-browser --kiosk --incognito \
  http://your-domain.com/orderflow_1304262038-v4.html \
  --disable-infobars \
  --no-first-run

# Make executable
chmod +x /home/pi/start-terminal.sh

# Add to autostart
nano /etc/xdg/lxsession/LXDE-pi/autostart

@/home/pi/start-terminal.sh

# Prevent sleep
sudo raspi-config
# Performance Options → Screen Blanking → Disable

# Reboot
sudo reboot
```

### **Pros:**
- ✅ One-time cost
- ✅ Very low power (~3W)
- ✅ Runs 24/7 reliably
- ✅ Silent, compact

### **Cons:**
- ❌ Initial hardware cost
- ❌ Requires physical setup
- ❌ Need monitor/TV to view (or VNC)

---

## Option 4: Hybrid Approach (Recommended)

**Combine localStorage persistence with strategic uptime:**

### **Strategy:**

```
Trading Hours (e.g., 8 AM - 10 PM):
✅ Keep computer/browser open
✅ Volume accumulates actively
✅ Real-time monitoring

Non-Trading Hours:
💾 Data saved to localStorage
😴 Computer can sleep
🔄 Resume next trading day

Result:
- Capture all active trading volume
- Save power when markets quiet
- Fresh session at midnight UTC anyway
```

### **Implementation:**

Already implemented! The system:
1. ✅ Auto-saves every 30 seconds
2. ✅ Persists across refreshes
3. ✅ Resets at midnight UTC
4. ✅ Loads previous state on startup

**Just keep browser open during trading hours!**

---

## Comparison Table

| Method | Cost | Complexity | Reliability | Best For |
|--------|------|------------|-------------|----------|
| Keep PC Awake | $0 (electricity) | Easy | Good | Casual traders |
| Cloud VPS | $5-6/month | Medium | Excellent | Serious traders |
| Raspberry Pi | $73 one-time | Medium | Excellent | Dedicated setup |
| Hybrid (Trading Hours) | $0 | Easiest | Good | Most users ⭐ |

---

## Recommendation

### **For Most Users:**
Use **Option 4 (Hybrid)** - Keep browser open during trading hours only.

**Why:**
- Midnight UTC reset anyway
- Most volume during active sessions
- No extra cost
- Simple to manage
- localStorage handles gaps

### **For Serious 24/7 Monitoring:**
Use **Option 2 (Cloud VPS)**.

**Why:**
- True continuous accumulation
- No local resource usage
- Professional reliability
- Affordable ($5-6/month)

### **Quick Decision Guide:**

```
Question                          Answer
─────────────────────────────────────────────
Trade only during day?           → Hybrid (Option 4)
Need overnight accumulation?     → Cloud VPS (Option 2)
Want one-time cost?              → Raspberry Pi (Option 3)
Just testing?                    → Keep PC Awake (Option 1)
Professional trading?            → Cloud VPS (Option 2)
```

---

## Important Note About Midnight Reset

Remember: **Volume resets at midnight UTC automatically!**

```
Even with 24/7 accumulation:
- 11:59 PM UTC: Full day's volume
- 12:00 AM UTC: Resets to zero
- 12:01 AM UTC: Fresh session starts

This is BY DESIGN for:
✅ Clean daily sessions
✅ Consistent signal generation
✅ Standard trading day boundaries
✅ Prevents unlimited growth
```

So 24/7 accumulation gives you:
- Complete intraday volume profile
- Better key level detection
- More accurate signals during the day
- But still resets daily (intentionally)

---

## Summary

**Volume accumulation requires:**
1. ✅ Browser tab OPEN
2. ✅ Computer AWAKE
3. ✅ Internet CONNECTED
4. ✅ WebSocket ACTIVE

**Web server role:**
- ❌ Does NOT accumulate volume
- ❌ Does NOT run JavaScript
- ✅ Only serves HTML file once
- ✅ Can be offline after page loads

**Best solution for most:**
Keep browser open during trading hours + localStorage persistence handles the rest! 🎯
