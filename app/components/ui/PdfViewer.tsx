'use client';
/* eslint-disable @next/next/no-css-tags */

import { useState } from 'react';
import Image from 'next/image';

interface PdfViewerProps {
  src: string;
  alt: string;
  title: string;
  color: 'blue' | 'amber' | 'emerald';
}

export default function PdfViewer({ src, alt, title, color }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const colorClasses = {
    blue: 'from-blue-50 to-slate-50',
    amber: 'from-amber-50 to-slate-50',
    emerald: 'from-emerald-50 to-slate-50',
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 hover:shadow-lg transition-all">
      {/* PDF Embed */}
      <div className="relative w-full bg-white" style={{ aspectRatio: '3 / 4' }}>
        <embed
          src={src}
          type="application/pdf"
          className="absolute inset-0 w-full h-full"
          title={alt}
        />
      </div>
      {/* Footer */}
      <div className={`p-3 bg-gradient-to-r ${colorClasses[color]}`}>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
    </div>
  );
}
