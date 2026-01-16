import { NextRequest, NextResponse } from 'next/server';
import { GameImage, RoundType } from '@/types/game';
import { imageStore } from '@/server/imageStore';

export async function GET() {
  return NextResponse.json({ images: imageStore.getImages() });
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
