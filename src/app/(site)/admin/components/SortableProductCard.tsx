'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminImage {
  id: string;
  filename: string;
  url: string;
  storagePath: string;
  sortOrder: number;
}

interface AdminProduct {
  id: string;
  title: string;
  category: string;
  productCode: string;
  status: 'available' | 'sold-out';
  price: number;
  currency: string;
  description: string;
  longDescription: string;
  specifications: string[];
  features: string[];
  tags: string[];
  weight: string;
  dimensions: string;
  materials: string[];
  careInstructions: string;
  sortOrder: number;
  images: AdminImage[];
}

interface SortableProductCardProps {
  product: AdminProduct;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  hasUnsavedChanges: boolean;
}

export default function SortableProductCard({
  product,
  onEdit,
  onDelete,
  hasUnsavedChanges,
}: SortableProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : ('auto' as const),
  };

  const firstImage = product.images[0];
  const imageUrl = firstImage?.url;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete(product.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-dismiss confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, width: 320, flexShrink: 0 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDeleteConfirm(false);
      }}
    >
      {/* Image area - 3:4 aspect ratio */}
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{ aspectRatio: '3/4' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2 text-gray-300"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-[10px] text-gray-300 tracking-wider uppercase">
                No image
              </p>
            </div>
          </div>
        )}

        {/* SOLD OUT badge - top left of image */}
        {product.status === 'sold-out' && (
          <span
            className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-semibold tracking-wider bg-black text-white uppercase"
            style={{ zIndex: 12 }}
          >
            SOLD OUT
          </span>
        )}

        {/* Overlay controls on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: isHovered ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0)',
            transition: 'background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: isHovered ? 'auto' : 'none',
            zIndex: 10,
          }}
        >
          {/* Drag Handle - Top Left */}
          <button
            {...attributes}
            {...listeners}
            className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            title="Drag to reorder"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <circle cx="5" cy="3" r="1.5" />
              <circle cx="11" cy="3" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
              <circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="13" r="1.5" />
              <circle cx="11" cy="13" r="1.5" />
            </svg>
          </button>

          {/* Edit Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s',
              cursor: 'pointer',
            }}
            title="Edit product"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Center Edit Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product.id);
            }}
            className="px-5 py-2"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#000',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
              cursor: 'pointer',
            }}
          >
            Edit Product
          </button>

          {/* Delete Button - Bottom Right */}
          <button
            onClick={handleDelete}
            className="absolute bottom-3 right-3 h-9 flex items-center justify-center rounded-full"
            style={{
              background: showDeleteConfirm ? 'rgba(220, 38, 38, 0.9)' : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
              cursor: 'pointer',
              padding: showDeleteConfirm ? '0 14px' : '0',
              width: showDeleteConfirm ? 'auto' : '36px',
              minWidth: '36px',
            }}
            title={showDeleteConfirm ? 'Click again to confirm' : 'Delete product'}
          >
            {showDeleteConfirm ? (
              <span className="text-white text-[9px] font-medium tracking-wider uppercase whitespace-nowrap">
                Confirm Delete
              </span>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 11,
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            <span className="text-white text-[8px] font-medium tracking-[0.15em] uppercase flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-white"
                style={{ animation: 'adminPulse 2s ease-in-out infinite' }}
              />
              Modified
            </span>
          </div>
        )}

        {/* Image count badge */}
        {product.images.length > 1 && (
          <div
            className="absolute bottom-3 left-3 px-2 py-0.5"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 11,
              opacity: isHovered ? 0 : 0.8,
              transition: 'opacity 0.3s ease',
            }}
          >
            <span className="text-white text-[9px] font-light tracking-wider">
              {product.images.length} images
            </span>
          </div>
        )}
      </div>

      {/* Product info - below image, matching live site style */}
      <div className="pt-3 pb-1 px-1">
        <p className="text-sm font-normal text-black tracking-wide leading-snug">
          {product.title || 'Untitled Product'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {product.status === 'sold-out'
            ? '—'
            : `${product.currency === 'EUR' ? '€' : '$'}${product.price}.00`}
        </p>
      </div>

      <style jsx>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
