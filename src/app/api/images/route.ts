import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GameImage, RoundType } from '@/types/game';
import { imageStore } from '@/server/imageStore';

// Configure Cloudinary
function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  return true;
}

// Fetch images from Cloudinary
async function fetchFromCloudinary(): Promise<GameImage[]> {
  if (!configureCloudinary()) {
    console.error('Cloudinary not configured');
    return [];
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'eran-50-game/',
      max_results: 50,
    });

    return result.resources.map((resource: { public_id: string; secure_url: string }) => ({
      id: resource.public_id,
      url: resource.secure_url,
      caption: '',
      roundType: 'normal' as RoundType,
    }));
  } catch (error) {
    console.error('Failed to fetch from Cloudinary:', error);
    return [];
  }
}

export async function GET() {
  // Check in-memory store first
  let images = imageStore.getImages();

  // If empty, try to fetch from Cloudinary
  if (images.length === 0) {
    console.log('No images in memory, fetching from Cloudinary...');
    images = await fetchFromCloudinary();
    if (images.length > 0) {
      imageStore.setImages(images);
      console.log(`Loaded ${images.length} images from Cloudinary`);
    }
  }

  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image || !image.url) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    const newImage: GameImage = {
      id: image.id || crypto.randomUUID(),
      url: image.url,
      caption: image.caption || '',
      roundType: (image.roundType as RoundType) || 'normal',
    };

    imageStore.addImage(newImage);

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Add image error:', error);
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'No image ID provided' }, { status: 400 });
    }

    imageStore.removeImage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Invalid images data' }, { status: 400 });
    }

    imageStore.setImages(images);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update images error:', error);
    return NextResponse.json({ error: 'Failed to update images' }, { status: 500 });
  }
}
