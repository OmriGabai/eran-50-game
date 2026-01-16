import { GameImage } from '../types/game';

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
}

// Export singleton instance
export const imageStore = new ImageStore();
