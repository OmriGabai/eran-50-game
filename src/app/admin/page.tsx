'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameImage, RoundType, ROUND_CONFIG } from '@/types/game';
import { BirthdayBanner } from '@/components/shared/BirthdayBanner';
import Link from 'next/link';

export default function AdminPage() {
  const [images, setImages] = useState<GameImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRoundType, setSelectedRoundType] = useState<RoundType>('normal');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('url');

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roundType', selectedRoundType);
      formData.append('caption', caption);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.image) {
        await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: data.image }),
        });

        await fetchImages();
        setCaption('');
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed. Make sure Cloudinary is configured.' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Upload failed. Make sure Cloudinary is configured in .env.local' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlAdd = async () => {
    if (!imageUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter an image URL' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: {
            url: imageUrl.trim(),
            caption,
            roundType: selectedRoundType,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchImages();
        setCaption('');
        setImageUrl('');
        setMessage({ type: 'success', text: 'Image added successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add image' });
      }
    } catch (error) {
      console.error('Add image error:', error);
      setMessage({ type: 'error', text: 'Failed to add image' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
      await fetchImages();
      setMessage({ type: 'success', text: 'Image deleted' });
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: 'Failed to delete image' });
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);

    setImages(newImages);

    try {
      await fetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: newImages }),
      });
    } catch (error) {
      console.error('Reorder error:', error);
    }
  };

  const loadSampleImages = async () => {
    const sampleImages = [
      'https://picsum.photos/seed/eran1/800/600',
      'https://picsum.photos/seed/eran2/800/600',
      'https://picsum.photos/seed/eran3/800/600',
      'https://picsum.photos/seed/eran4/800/600',
      'https://picsum.photos/seed/eran5/800/600',
      'https://picsum.photos/seed/eran6/800/600',
      'https://picsum.photos/seed/eran7/800/600',
    ];

    setIsUploading(true);
    for (let i = 0; i < sampleImages.length; i++) {
      await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: {
            url: sampleImages[i],
            caption: `Sample image ${i + 1}`,
            roundType: ROUND_CONFIG[i].type,
          },
        }),
      });
    }
    await fetchImages();
    setIsUploading(false);
    setMessage({ type: 'success', text: 'Sample images loaded!' });
  };

  const roundTypeColors: Record<RoundType, string> = {
    normal: 'bg-blue-100 text-blue-800',
    roast: 'bg-red-100 text-red-800',
    tribute: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <BirthdayBanner />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple">Image Management</h2>
          <Link href="/" className="text-purple hover:text-purple-dark underline">
            Back to Home
          </Link>
        </div>

        {/* Upload Form */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-purple mb-4">Add New Image</h3>

          {/* Upload Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadMode('url')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMode === 'url'
                  ? 'bg-purple text-cream'
                  : 'bg-purple/10 text-purple hover:bg-purple/20'
              }`}
            >
              Add by URL
            </button>
            <button
              onClick={() => setUploadMode('file')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMode === 'file'
                  ? 'bg-purple text-cream'
                  : 'bg-purple/10 text-purple hover:bg-purple/20'
              }`}
            >
              Upload File
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-purple mb-1">
                Round Type
              </label>
              <select
                value={selectedRoundType}
                onChange={(e) => setSelectedRoundType(e.target.value as RoundType)}
                className="input-field"
              >
                <option value="normal">Normal (100 pts)</option>
                <option value="roast">Roast (150 pts)</option>
                <option value="tribute">Tribute (200 pts)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-purple mb-1">
                Image Caption (optional context)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., 'Eran at the beach, 2019'"
                className="input-field"
              />
            </div>
          </div>

          {uploadMode === 'url' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>
              <button
                onClick={handleUrlAdd}
                disabled={isUploading || !imageUrl.trim()}
                className="btn-primary"
              >
                {isUploading ? 'Adding...' : 'Add Image'}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-purple mb-1">
                Upload Image (requires Cloudinary)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-purple
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gold file:text-purple-dark
                  hover:file:bg-gold-dark
                  disabled:opacity-50"
              />
              <p className="text-xs text-purple/50 mt-1">
                File upload requires Cloudinary configuration in .env.local
              </p>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 text-purple/60">
              Processing...
            </div>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {images.length === 0 && (
          <div className="card mb-8 text-center">
            <h3 className="text-lg font-bold text-purple mb-2">Quick Start</h3>
            <p className="text-purple/60 mb-4">
              Load sample images to test the game quickly
            </p>
            <button
              onClick={loadSampleImages}
              disabled={isUploading}
              className="btn-secondary"
            >
              {isUploading ? 'Loading...' : 'Load Sample Images'}
            </button>
          </div>
        )}

        {/* Round Configuration */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-purple mb-4">Round Configuration</h3>
          <div className="grid grid-cols-7 gap-2">
            {ROUND_CONFIG.map((config, index) => (
              <div key={index} className={`p-2 rounded text-center ${roundTypeColors[config.type]}`}>
                <div className="font-bold">R{index + 1}</div>
                <div className="text-xs">{config.type}</div>
                <div className="text-xs">{config.points}pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Images List */}
        <div className="card">
          <h3 className="text-xl font-bold text-purple mb-4">
            Uploaded Images ({images.length}/{ROUND_CONFIG.length} needed)
          </h3>

          {images.length === 0 ? (
            <p className="text-purple/60 italic">No images added yet</p>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-3 bg-white/50 rounded-lg"
                >
                  <div className="text-purple/60 font-bold w-8">
                    #{index + 1}
                  </div>

                  <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${roundTypeColors[image.roundType]}`}>
                      {image.roundType}
                    </span>
                    {image.caption && (
                      <p className="text-sm text-purple/70 mt-1 truncate">{image.caption}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleReorder(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-2 text-purple hover:bg-purple/10 rounded disabled:opacity-30"
                      title="Move up"
                    >
                      &#8593;
                    </button>
                    <button
                      onClick={() => handleReorder(index, Math.min(images.length - 1, index + 1))}
                      disabled={index === images.length - 1}
                      className="p-2 text-purple hover:bg-purple/10 rounded disabled:opacity-30"
                      title="Move down"
                    >
                      &#8595;
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length < ROUND_CONFIG.length && images.length > 0 && (
            <p className="mt-4 text-amber-600 text-sm">
              You need {ROUND_CONFIG.length - images.length} more images for all rounds!
            </p>
          )}

          {images.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gold/20">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all images?')) {
                    images.forEach(img => handleDelete(img.id));
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear all images
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
