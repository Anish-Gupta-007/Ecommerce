const fs = require('fs');
const path = require('path');
const os = require('os');

const sourceDir = 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589';
const publicImagesDir = path.join(__dirname, 'Client', 'public', 'images');
const desktopImagesDir = path.join(os.homedir(), 'Desktop', 'Aura_Images_For_Upload');

// Create directories if they don't exist
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}
if (!fs.existsSync(desktopImagesDir)) {
  fs.mkdirSync(desktopImagesDir, { recursive: true });
}

// 1. Categories Images -> Put directly into Client/public/images
const categoryImages = {
  'luxury_watch_category_1781542420674.png': 'watch.png',
  'luxury_handbag_category_1781542433783.png': 'handbag.png',
  'luxury_fragrance_category_1781542449147.png': 'fragrance.png'
};

console.log("Copying Category Images to Client...");
for (const [src, dest] of Object.entries(categoryImages)) {
  try {
    fs.copyFileSync(path.join(sourceDir, src), path.join(publicImagesDir, dest));
    console.log(`✅ Copied ${dest}`);
  } catch (err) {
    console.error(`❌ Failed to copy ${src}:`, err.message);
  }
}

// 2. Product Images -> Put on Desktop so you can easily upload them via Admin Panel!
const productImages = {
  'product_watch_1781542481468.png': 'Chronograph_Eclipse.png',
  'product_perfume_1781542494823.png': 'Lumiere_Perfume.png',
  'product_sunglasses_1781542508193.png': 'Sunglasses.png',
  'product_leather_wallet_1781542521397.png': 'Leather_Wallet.png',
  'product_bag_black_1781542717945.png': 'Noir_Tote.png',
  'product_necklace_1781542730604.png': 'Diamond_Pendant.png',
  'product_cologne_1781542749058.png': 'Oud_Bergamot.png',
  'product_ring_1781542762026.png': 'Platinum_Ring.png'
};

console.log("\nCopying Product Images to your Desktop...");
for (const [src, dest] of Object.entries(productImages)) {
  try {
    fs.copyFileSync(path.join(sourceDir, src), path.join(desktopImagesDir, dest));
    console.log(`✅ Copied ${dest}`);
  } catch (err) {
    console.error(`❌ Failed to copy ${src}:`, err.message);
  }
}

console.log("\n🎉 ALL DONE! Go to your Desktop and look for 'Aura_Images_For_Upload'!");
