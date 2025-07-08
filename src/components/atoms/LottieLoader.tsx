import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/loading.json';

// Example minimal spinner animation (replace with your own or a better one if desired)
const defaultAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 60,
  w: 64,
  h: 64,
  nm: "dots",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Dot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [32, 32, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [16, 16] },
          nm: "Ellipse Path 1",
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.15, 0.4, 0.95, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          nm: "Fill 1",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

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