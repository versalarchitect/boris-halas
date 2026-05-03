'use client';

import { useState } from 'react';

interface AddProductCardProps {
  onAdd: () => void;
}

export default function AddProductCard({ onAdd }: AddProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 cursor-pointer"
      style={{ width: 320 }}
      onClick={onAdd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area placeholder - matches 3:4 aspect ratio */}
      <div
        className="relative flex items-center justify-center"
        style={{
          aspectRatio: '3/4',
          border: '2px dashed rgba(0, 0, 0, 0.12)',
          background: isHovered ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div
          className="text-center"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div
            className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              border: '1.5px solid rgba(0, 0, 0, 0.15)',
              background: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
              style={{
                transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <p
            className="text-[10px] font-light tracking-[0.2em] uppercase"
            style={{ color: 'rgba(0, 0, 0, 0.3)' }}
          >
            Add Product
          </p>
        </div>
      </div>

      {/* Text area placeholder - matches product card structure */}
      <div className="pt-3 pb-1 px-1">
        <div
          className="h-3.5 mb-1.5 rounded"
          style={{ background: 'rgba(0, 0, 0, 0.04)', width: '60%' }}
        />
        <div
          className="h-2.5 rounded"
          style={{ background: 'rgba(0, 0, 0, 0.03)', width: '25%' }}
        />
      </div>
    </div>
  );
}
