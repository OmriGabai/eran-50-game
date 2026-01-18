'use client';

import { useState, useEffect } from 'react';

const VERSION = 'v2.0.1';

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
        fixed top-2 left-2 z-50
        text-xs font-mono text-orange/80 bg-dark-lighter/90 px-2 py-1 rounded border border-orange/20
        transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {VERSION}
    </div>
  );
}
