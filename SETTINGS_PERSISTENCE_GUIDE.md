# Settings Persistence Guide - Telegram & WhatsApp

## ✅ Your Settings Are SAFE!

**Good news:** Your Telegram and WhatsApp settings **WILL NOT be cleared** when you update the code. They are stored in **localStorage**, which persists independently of the HTML file.

---

## How It Works

### **Storage Location:**

Settings are saved in your **browser's localStorage**:
```javascript
// These keys store your settings:
localStorage.setItem('tgTok', 'your-telegram-token');
localStorage.setItem('tgCid', 'your-chat-id');
localStorage.setItem('waNr', 'your-phone-number');
localStorage.setItem('waKey', 'your-api-key');
```

### **Persistence Characteristics:**

| Scenario | Settings Status |
|----------|----------------|
| Refresh page | ✅ **PRESERVED** |
| Close browser | ✅ **PRESERVED** |
| Restart computer | ✅ **PRESERVED** |
| Update HTML file | ✅ **PRESERVED** |
| Deploy new version | ✅ **PRESERVED** |
| Clear browser cache | ❌ **LOST** ⚠️ |
| Use different browser | ❌ **NOT AVAILABLE** |
| Incognito/Private mode | ❌ **CLEARED on close** |

---

## Verification

### **Check Settings on Boot:**

Every time you load the terminal, check the console (F12):

```javascript
🔔 Notification Settings Check:
   Telegram Token: ✅ SET (1234567890...)
   Telegram Chat ID: ✅ SET
   WhatsApp Phone: ✅ SET
   WhatsApp API Key: ✅ SET
   ℹ️ Settings persist in localStorage - they survive code updates!
```

### **Manual Check:**

Open console and run:
```javascript
// Check all settings
console.log('Telegram Token:', localStorage.getItem('tgTok') ? 'SET' : 'NOT SET');
console.log('Telegram Chat ID:', localStorage.getItem('tgCid') ? 'SET' : 'NOT SET');
console.log('WhatsApp Phone:', localStorage.getItem('waNr') ? 'SET' : 'NOT SET');
console.log('WhatsApp API Key:', localStorage.getItem('waKey') ? 'SET' : 'NOT SET');
```

---

## When Settings MIGHT Be Lost

### **1. Clearing Browser Data**

**What clears localStorage:**
- "Clear browsing data" → "Cookies and site data"
- "Clear site data" in Chrome DevTools
- Browser reset/clear all settings

**How to avoid:**
- Don't clear "Cookies and other site data"
- Or re-enter settings after clearing

### **2. Using Different Browser**

localStorage is **browser-specific**:
- Settings in Chrome ≠ Settings in Firefox
- Settings in Desktop ≠ Settings in Mobile

**Solution:**
- Configure each browser separately
- Or use same browser everywhere

### **3. Incognito/Private Mode**

Private browsing **deletes localStorage** when closed:
- Settings work during session
- Lost when you close incognito window

**Solution:**
- Use regular browsing mode for trading
- Or reconfigure each time (not recommended)

### **4. Different Domain/URL**

localStorage is **domain-specific**:
- `localhost:3000` ≠ `127.0.0.1:3000`
- `example.com` ≠ `www.example.com`

**Solution:**
- Always use same URL
- Or reconfigure for each domain

---

## Backup Your Settings

### **Export Settings (Recommended):**

Run this in console to backup:
```javascript
// Export settings as JSON
const settings = {
  telegram: {
    token: localStorage.getItem('tgTok'),
    chatId: localStorage.getItem('tgCid')
  },
  whatsapp: {
    phone: localStorage.getItem('waNr'),
    apiKey: localStorage.getItem('waKey')
  }
};

// Copy this output and save somewhere safe
console.log(JSON.stringify(settings, null, 2));
```

**Save the output to a secure location** (password manager, encrypted file, etc.)

### **Import Settings:**

If you need to restore:
```javascript
// Paste your backed-up settings here
const settings = {
  telegram: {
    token: 'YOUR_TOKEN_HERE',
    chatId: 'YOUR_CHAT_ID_HERE'
  },
  whatsapp: {
    phone: 'YOUR_PHONE_HERE',
    apiKey: 'YOUR_API_KEY_HERE'
  }
};

// Restore to localStorage
localStorage.setItem('tgTok', settings.telegram.token);
localStorage.setItem('tgCid', settings.telegram.chatId);
localStorage.setItem('waNr', settings.whatsapp.phone);
localStorage.setItem('waKey', settings.whatsapp.apiKey);

console.log('✅ Settings restored!');
location.reload(); // Reload to apply
```

---

## Code Updates Are Safe

### **Why Settings Survive Updates:**

```
Browser Storage Architecture:

┌─────────────────────────────────────┐
│  HTML File (orderflow_v4.html)     │  ← Updated frequently
│  - JavaScript code                  │
│  - UI structure                     │
│  - Logic                            │
└─────────────────────────────────────┘
              ↓ Reads/Writes
┌─────────────────────────────────────┐
│  Browser localStorage               │  ← Persists independently
│  - tgTok: "1234567890:ABC..."      │
│  - tgCid: "-1001234567890"         │
│  - waNr: "+1234567890"             │
│  - waKey: "abc123def456"           │
└─────────────────────────────────────┘
```

**The HTML file and localStorage are separate!**
- Updating HTML doesn't touch localStorage
- localStorage only changes when you explicitly save/clear it

### **Safe Operations:**

These operations **WON'T** affect your settings:
- ✅ Replacing HTML file with new version
- ✅ Editing JavaScript code
- ✅ Changing CSS styles
- ✅ Adding new features
- ✅ Fixing bugs
- ✅ Refreshing page
- ✅ Closing/reopening browser

### **Unsafe Operations:**

These operations **WILL** affect your settings:
- ❌ Clearing browser cookies/site data
- ❌ Using "Clear all browsing data"
- ❌ Resetting browser settings
- ❌ Switching to different browser
- ❌ Using incognito mode

---

## Troubleshooting

### **Problem: Settings disappeared**

**Step 1: Check if localStorage was cleared**
```javascript
console.log('tgTok:', localStorage.getItem('tgTok'));
console.log('tgCid:', localStorage.getItem('tgCid'));
console.log('waNr:', localStorage.getItem('waNr'));
console.log('waKey:', localStorage.getItem('waKey'));
```

**If all show `null`:**
- Browser data was cleared
- You're using a different browser
- You're in incognito mode

**Solution:**
- Re-enter settings via ⚙ ALERTS button
- Or restore from backup (see above)

---

### **Problem: Settings not working after update**

**Step 1: Verify settings exist**
```javascript
const cfg = getCfg();
console.log(cfg);
```

**Step 2: Test notifications**
```javascript
// In settings modal, click "Test Telegram" or "Test WhatsApp"
// Or manually test:
testTG(); // Test Telegram
testWA(); // Test WhatsApp
```

**Step 3: Check for typos**
- Open ⚙ ALERTS settings
- Verify no extra spaces
- Verify correct format

---

### **Problem: Want to transfer settings to another device**

**Method 1: Manual Entry**
1. Note down current settings
2. Enter them on new device

**Method 2: Export/Import**
1. Export from old device (see backup section)
2. Import to new device (see import section)

**Method 3: Screenshot**
1. Open ⚙ ALERTS settings
2. Take screenshot
3. Manually type on new device

---

## Best Practices

### **1. Backup Regularly**

After configuring settings:
```javascript
// Run this monthly or after changes
const backup = {
  tgTok: localStorage.getItem('tgTok'),
  tgCid: localStorage.getItem('tgCid'),
  waNr: localStorage.getItem('waNr'),
  waKey: localStorage.getItem('waKey')
};
console.log('Backup:', JSON.stringify(backup));
// Save output securely
```

### **2. Use Same Browser**

Stick to one browser for consistency:
- Chrome (recommended)
- Firefox
- Edge
- Safari

### **3. Avoid Clearing Site Data**

When clearing browser data:
- ✅ Clear cache
- ✅ Clear download history
- ❌ DON'T clear "Cookies and other site data"

### **4. Test After Updates**

After updating HTML:
1. Open console (F12)
2. Check boot message:
   ```
   🔔 Notification Settings Check:
      Telegram Token: ✅ SET
      ...
   ```
3. If shows ❌, re-enter settings

### **5. Document Your Settings**

Keep a secure record:
```
Telegram Bot Token: [token]
Telegram Chat ID: [chat_id]
WhatsApp Phone: +[country][number]
WhatsApp API Key: [api_key]
Configured: 2026-04-14
```

Store in:
- Password manager (1Password, Bitwarden, etc.)
- Encrypted note
- Secure cloud storage

---

## Technical Details

### **How Settings Are Loaded:**

```javascript
// On page load (boot function):
const notifCfg = getCfg();
console.log('🔔 Notification Settings Check:');
console.log(`   Telegram Token: ${notifCfg.tgTok ? '✅ SET' : '❌ NOT SET'}`);
// ... etc
```

### **How Settings Are Saved:**

```javascript
// When you click "Save Settings":
function saveSettings(){
  ['tgTok','tgCid','waNr','waKey'].forEach(k=>{
    const el=document.getElementById(k);
    if(el) localStorage.setItem(k,el.value.trim());
  });
  closeSettings();
  console.log('✅ Settings saved to localStorage (will persist across code updates)');
}
```

### **How Settings Are Used:**

```javascript
// When firing notifications:
function fireNotifs(a){
  const c=getCfg(); // Reads from localStorage
  
  if(c.tgTok&&c.tgCid) sendTG(a,c);  // Send Telegram
  if(c.waNr&&c.waKey) sendWA(waMsg,c); // Send WhatsApp
}
```

---

## Summary

### **✅ Settings ARE Persistent:**
- Stored in browser localStorage
- Survive code updates
- Survive page refreshes
- Survive browser restarts
- Survive computer reboots

### **⚠️ Settings Can Be Lost If:**
- You clear browser cookies/site data
- You switch browsers
- You use incognito mode
- You change domains

### **🛡️ Protection Strategy:**
1. Backup settings regularly
2. Use same browser consistently
3. Avoid clearing site data
4. Keep secure copy of credentials
5. Verify settings after updates

### **📊 Quick Check:**
```javascript
// Paste in console anytime:
console.table({
  'Telegram Token': localStorage.getItem('tgTok') ? '✅' : '❌',
  'Telegram Chat ID': localStorage.getItem('tgCid') ? '✅' : '❌',
  'WhatsApp Phone': localStorage.getItem('waNr') ? '✅' : '❌',
  'WhatsApp API Key': localStorage.getItem('waKey') ? '✅' : '❌'
});
```

---

**Bottom Line:** Your settings are **safe** and will **persist** through all code updates. Just don't clear your browser's site data, and you'll never lose them! 🎉

**Last Updated:** April 14, 2026  
**Version:** V4.2.0+
