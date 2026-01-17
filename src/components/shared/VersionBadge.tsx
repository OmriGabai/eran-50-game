'use client';

import { useState, useEffect } from 'react';

const VERSION = 'v1.7.0';

export function VersionBadge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed top-2 right-2 z-50
        text-xs font-mono text-purple/60 bg-white/80 px-2 py-1 rounded
        transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {VERSION}
    </div>
  );
}
