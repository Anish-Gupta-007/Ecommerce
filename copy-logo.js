const fs = require('fs');
const path = require('path');

const sourceImage = 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\aura_luxury_logo_1782328312114.png';

const clientIconPath = path.join(__dirname, 'Client', 'src', 'app', 'icon.png');
const adminIconPath = path.join(__dirname, 'Admin', 'src', 'app', 'icon.png');

try {
  // Copy to Client as icon.png (Next.js automatically uses this as the Favicon!)
  fs.copyFileSync(sourceImage, clientIconPath);
  console.log('✅ Added Favicon to Client app!');

  // Copy to Admin as icon.png
  fs.copyFileSync(sourceImage, adminIconPath);
  console.log('✅ Added Favicon to Admin app!');

  console.log('\n🎉 ALL DONE! Your brand new AURA logo is now the Favicon for both apps!');
} catch (err) {
  console.error('❌ Error copying files:', err.message);
}
