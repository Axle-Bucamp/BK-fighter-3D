import React, { useState, useEffect } from 'react';

export const useAdaptiveResolution = (CanvasComponent) => {
  return function AdaptiveResolutionCanvas(props) {
    const [resolution, setResolution] = useState({ width: 1920, height: 1080 });

    useEffect(() => {
      const handleResize = () => {
        const { innerWidth, innerHeight } = window;
        const aspectRatio = innerWidth / innerHeight;

        let newWidth, newHeight;

        if (aspectRatio > 16 / 9) {
          newHeight = innerHeight;
          newWidth = newHeight * (16 / 9);
        } else {
          newWidth = innerWidth;
          newHeight = newWidth / (16 / 9);
        }

        setResolution({ width: newWidth, height: newHeight });
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <CanvasComponent
        {...props}
        style={{ width: '100%', height: '100%' }}
        camera={{ fov: 75, aspect: resolution.width / resolution.height, near: 0.1, far: 1000 }}
      />
    );
  };
};