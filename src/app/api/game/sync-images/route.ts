import { NextResponse } from 'next/server';

// This endpoint syncs images to the game
// Called when starting the game to load the configured images
export async function POST() {
  try {
    // Get images from the images API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/images`);
    const data = await res.json();

    // Images are synced via Socket.io when the game starts
    // This endpoint is available for manual sync if needed

    return NextResponse.json({
      success: true,
      imageCount: data.images?.length || 0,
      message: 'Images will be synced when game starts',
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
