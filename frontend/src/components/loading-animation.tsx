'use client';

import React, { useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  useEffect(() => {
    import('ldrs').then((mod) => {
      mod.orbit.register();
    });
  }, []);

  return (
    <div className="flex justify-center items-center bg-gray-800/70 text-white p-4 rounded-3xl">
      <l-orbit size="35" speed="1.5" color="white"></l-orbit>
    </div>
  );
};

export default LoadingAnimation;
