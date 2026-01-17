import { v2 as cloudinary } from 'cloudinary';
import { GameImage, RoundType } from '../types/game';

// Configure Cloudinary
function configureCloudinary(): boolean {
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

// Shared in-memory storage for images (singleton)
class ImageStore {
  private images: GameImage[] = [];

  getImages(): GameImage[] {
    return [...this.images];
  }

  setImages(images: GameImage[]) {
    this.images = [...images];
  }

  addImage(image: GameImage) {
    this.images.push(image);
  }

  removeImage(id: string) {
    this.images = this.images.filter(img => img.id !== id);
  }

  clear() {
    this.images = [];
  }

  // Sync images from Cloudinary if memory is empty
  async syncFromCloudinary(): Promise<GameImage[]> {
    // If we already have images, return them
    if (this.images.length > 0) {
      console.log(`ImageStore: Using ${this.images.length} cached images`);
      return this.images;
    }

    // Try to fetch from Cloudinary
    if (!configureCloudinary()) {
      console.error('ImageStore: Cloudinary not configured');
      return [];
    }

    try {
      console.log('ImageStore: Fetching images from Cloudinary...');
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'eran-50-game/',
        max_results: 50,
      });

      const images: GameImage[] = result.resources.map((resource: { public_id: string; secure_url: string }) => ({
        id: resource.public_id,
        url: resource.secure_url,
        caption: '',
        roundType: 'normal' as RoundType,
      }));

      if (images.length > 0) {
        this.images = images;
        console.log(`ImageStore: Loaded ${images.length} images from Cloudinary`);
      }

      return images;
    } catch (error) {
      console.error('ImageStore: Failed to fetch from Cloudinary:', error);
      return [];
    }
  }
}

// Export singleton instance
export const imageStore = new ImageStore();
