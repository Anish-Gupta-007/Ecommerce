require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("No MONGO_URI found in .env");
  process.exit(1);
}

// Define minimal Product schema just for this update
const productSchema = new mongoose.Schema({
  images: [{
    public_id: String,
    url: String
  }]
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to live MongoDB...');
    const products = await Product.find({});
    let updatedCount = 0;

    for (let p of products) {
      let changed = false;
      for (let img of p.images) {
        if (img.url && img.url.includes('http://localhost:3000')) {
          // Replace localhost with an empty string so it becomes a relative path (e.g., /api/images/...)
          // This allows Vercel to automatically use its own domain!
          img.url = img.url.replace('http://localhost:3000', '');
          changed = true;
        }
      }
      
      if (changed) {
        await p.save();
        updatedCount++;
      }
    }

    console.log(`Successfully fixed images for ${updatedCount} products!`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Database error:", err);
    process.exit(1);
  });
