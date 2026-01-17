'use client';

interface MemeImageProps {
  imageUrl: string;
  topText?: string;
  bottomText?: string;
  className?: string;
}

export function MemeImage({ imageUrl, topText, bottomText, className = '' }: MemeImageProps) {
  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Meme"
        className="w-full h-full object-contain"
      />

      {/* Top text */}
      {topText && (
        <div className="absolute top-0 left-0 right-0 p-4">
          <p className="meme-text text-center">
            {topText}
          </p>
        </div>
      )}

      {/* Bottom text */}
      {bottomText && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="meme-text text-center">
            {bottomText}
          </p>
        </div>
      )}
    </div>
  );
}
