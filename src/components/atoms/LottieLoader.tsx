import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/loading.json';

interface LottieLoaderProps {
  size?: number;
  animationData?: object;
  className?: string;
}

export default function LottieLoader({ size = 48, animationData, className }: LottieLoaderProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie
        autoplay
        loop
        animationData={animationData || loadingAnimation}
        style={{ width: size, height: size }}
      />
    </div>
  );
} 