import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  
  const imageMap: Record<string, string> = {
    'watch': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\luxury_watch_category_1781542420674.png',
    'handbag': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\luxury_handbag_category_1781542433783.png',
    'fragrance': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\luxury_fragrance_category_1781542449147.png',
    'product-watch': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_watch_1781542481468.png',
    'product-perfume': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_perfume_1781542494823.png',
    'product-sunglasses': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_sunglasses_1781542508193.png',
    'product-wallet': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_leather_wallet_1781542521397.png',
    'brand-story': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\brand_story_1781542691045.png',
    'campaign-banner': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\campaign_banner_1781542704598.png',
    'product-bag-black': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_bag_black_1781542717945.png',
    'product-necklace': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_necklace_1781542730604.png',
    'product-cologne': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_cologne_1781542749058.png',
    'product-ring': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\product_ring_1781542762026.png',
    'watch-angle-side': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\watch_angle_side_1781545550908.png',
    'watch-angle-dial': 'C:\\Users\\anish\\.gemini\\antigravity\\brain\\f43e782d-78bb-4f74-983d-79225e7cc589\\watch_angle_dial_1781545564086.png',
  };

  const imagePath = imageMap[name];
  if (!imagePath || !fs.existsSync(imagePath)) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const imageBuffer = fs.readFileSync(imagePath);
  return new NextResponse(imageBuffer, {
    headers: { 
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
