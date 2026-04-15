// ═══════════════════════════════════════════
// SETTINGS VERIFICATION SCRIPT
// Run this in browser console (F12) to check
// if your Telegram/WhatsApp settings are saved
// ═══════════════════════════════════════════

console.log('\n🔍 ORDERFLOW SETTINGS VERIFICATION');
console.log('═══════════════════════════════════\n');

// Check all notification settings
const settings = {
  'Telegram Bot Token': localStorage.getItem('tgTok'),
  'Telegram Chat ID': localStorage.getItem('tgCid'),
  'WhatsApp Phone Number': localStorage.getItem('waNr'),
  'WhatsApp API Key': localStorage.getItem('waKey')
};

// Display status
let allSet = true;
Object.entries(settings).forEach(([name, value]) => {
  const isSet = value && value.length > 0;
  const status = isSet ? '✅ SET' : '❌ NOT SET';
  const preview = isSet ? 
    (name.includes('Token') || name.includes('Key') ? 
      value.substring(0, 8) + '...' : 
      value) : 
    '(empty)';
  
  console.log(`${status.padEnd(10)} ${name.padEnd(25)} → ${preview}`);
  
  if (!isSet) allSet = false;
});

console.log('\n───────────────────────────────────');

if (allSet) {
  console.log('✅ ALL SETTINGS CONFIGURED');
  console.log('ℹ️  Settings will persist across code updates!\n');
} else {
  console.log('⚠️  SOME SETTINGS MISSING');
  console.log('👉 Click ⚙ ALERTS button to configure\n');
}

// Additional checks
console.log('📊 STORAGE INFO:');
console.log(`   Total localStorage items: ${localStorage.length}`);
console.log(`   Storage used: ~${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB`);

// Check for other orderflow data
const orderflowKeys = Object.keys(localStorage).filter(k => k.startsWith('orderflow_'));
console.log(`   OrderFlow keys: ${orderflowKeys.length}`);
orderflowKeys.forEach(key => {
  const size = (localStorage.getItem(key)?.length || 0) / 1024;
  console.log(`     - ${key}: ${size.toFixed(2)} KB`);
});

console.log('\n💡 TIP: Settings survive code updates but NOT browser data clearing!');
console.log('   To backup: Copy the values above and save securely.\n');
