'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

interface ProductEditorProps {
  product: AdminProduct;
  onSave: (product: AdminProduct) => void;
  onClose: () => void;
  onImageUpload: (productId: string, file: File) => Promise<AdminImage | null>;
  onImageDelete: (imageId: string) => Promise<boolean>;
  onImageReorder: (productId: string, images: AdminImage[]) => void;
  authToken: string;
}

/* ------------------------------------------------------------------ */
/*  Sortable Image Thumbnail                                           */
/* ------------------------------------------------------------------ */

function SortableImageThumb({
  image,
  onDelete,
  isUploading,
}: {
  image: AdminImage;
  onDelete: (id: string) => void;
  isUploading?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-[120px] h-[120px] overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          border: isDragging ? '2px solid rgba(0,0,0,0.3)' : '1px solid rgba(0,0,0,0.08)',
          transition: 'border 0.3s ease',
        }}
      >
        <img
          src={image.url}
          alt={image.filename}
          className="w-full h-full object-cover"
          draggable={false}
          style={{
            filter: isUploading ? 'brightness(0.5)' : 'none',
          }}
        />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image.id);
        }}
        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black text-white"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          cursor: 'pointer',
          fontSize: '10px',
        }}
        title="Remove image"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Sort order badge */}
      <div
        className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-medium tracking-wider"
        style={{
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          opacity: isHovered ? 0 : 0.7,
          transition: 'opacity 0.2s ease',
        }}
      >
        {image.sortOrder + 1}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Array Field Editor                                                 */
/* ------------------------------------------------------------------ */

function ArrayFieldEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const addItem = () => {
    onChange([...values, '']);
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400">
        {label}
      </label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors duration-300"
            />
            <button
              onClick={() => removeItem(index)}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              title="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.1em] uppercase text-gray-400 hover:text-black transition-colors duration-300"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add {label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ProductEditor                                                 */
/* ------------------------------------------------------------------ */

export default function ProductEditor({
  product: initialProduct,
  onSave,
  onClose,
  onImageUpload,
  onImageDelete,
  onImageReorder,
}: ProductEditorProps) {
  const [product, setProduct] = useState<AdminProduct>(initialProduct);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Sync when initialProduct changes (e.g. after image upload adds to product)
  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onSave(product);
      onClose();
    }, 400);
  }, [onClose, onSave, product]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const updateField = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  /* Image handling */

  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    let count = 0;
    const total = files.length;

    for (const file of Array.from(files)) {
      count++;
      setUploadProgress(`Uploading ${count}/${total}...`);
      const newImage = await onImageUpload(product.id, file);
      if (newImage) {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
  };

  const handleImageDelete = async (imageId: string) => {
    const success = await onImageDelete(imageId);
    if (success) {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    }
  };

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = product.images.findIndex((img) => img.id === active.id);
    const newIndex = product.images.findIndex((img) => img.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(product.images, oldIndex, newIndex).map(
      (img, i) => ({ ...img, sortOrder: i })
    );

    setProduct((prev) => ({ ...prev, images: reordered }));
    onImageReorder(product.id, reordered);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleBackdropClick}
      style={{
        background: isVisible && !isClosing ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isVisible && !isClosing ? 'blur(4px)' : 'blur(0px)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div
        ref={panelRef}
        className="bg-white h-full overflow-y-auto"
        style={{
          width: 'min(680px, 100vw)',
          transform: isVisible && !isClosing ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between"
          style={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <div>
            <h2 className="text-lg font-light tracking-tight text-black">
              {product.title || 'New Product'}
            </h2>
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mt-0.5">
              {product.productCode || 'No code'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ======================== Image Manager ======================== */}
        <div className="px-8 py-8 border-b border-gray-50">
          <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-6">
            Images
          </h3>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleImageDragEnd}
          >
            <SortableContext
              items={product.images.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-3">
                {product.images.map((image) => (
                  <SortableImageThumb
                    key={image.id}
                    image={image}
                    onDelete={handleImageDelete}
                  />
                ))}

                {/* Upload zone */}
                <div
                  className="w-[120px] h-[120px] flex items-center justify-center cursor-pointer"
                  style={{
                    border: '2px dashed rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onDrop={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.background = 'transparent';
                    handleFileDrop(e);
                  }}
                >
                  {isUploading ? (
                    <div className="text-center">
                      <div
                        className="w-5 h-5 border border-black border-t-transparent rounded-full mx-auto mb-2"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      />
                      <p className="text-[9px] text-gray-400 tracking-wider">
                        {uploadProgress || 'Uploading...'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-2 text-gray-300"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <p className="text-[9px] text-gray-300 tracking-wider uppercase">
                        Add
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SortableContext>
          </DndContext>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleImageUpload(e.target.files);
                e.target.value = ''; // reset so same file can be re-selected
              }
            }}
          />
        </div>

        {/* ======================== Product Details ======================== */}
        <div className="px-8 py-8 space-y-8">
          <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-2">
            Details
          </h3>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-3 text-2xl font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
              placeholder="Product title"
            />
          </div>

          {/* Category & Product Code - Row */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
                Category
              </label>
              <input
                type="text"
                value={product.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
                placeholder="e.g. Accessories"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
                Product Code
              </label>
              <input
                type="text"
                value={product.productCode}
                onChange={(e) => updateField('productCode', e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
                placeholder="e.g. RB-002"
              />
            </div>
          </div>

          {/* Status & Price - Row */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-4">
                Status
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateField(
                      'status',
                      product.status === 'available' ? 'sold-out' : 'available'
                    )
                  }
                  className="relative w-12 h-6 rounded-full transition-colors duration-300"
                  style={{
                    background: product.status === 'available' ? '#000' : '#e5e5e5',
                  }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                    style={{
                      left: product.status === 'available' ? '28px' : '4px',
                    }}
                  />
                </button>
                <span className="text-xs font-light tracking-wider text-gray-600 uppercase">
                  {product.status === 'available' ? 'Available' : 'Sold Out'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
                Price ({product.currency})
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-light">
                  {product.currency === 'EUR' ? '€' : '$'}
                </span>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    updateField('price', parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={product.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300 resize-none"
              placeholder="Short description..."
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
              Long Description
            </label>
            <textarea
              value={product.longDescription}
              onChange={(e) => updateField('longDescription', e.target.value)}
              rows={4}
              className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300 resize-none"
              placeholder="Detailed description..."
            />
          </div>

          {/* Divider */}
          <div className="pt-4">
            <div className="w-full h-px bg-gray-100" />
          </div>

          {/* Array Fields */}
          <ArrayFieldEditor
            label="Specifications"
            values={product.specifications}
            onChange={(v) => updateField('specifications', v)}
            placeholder="e.g. Handmade in Montréal"
          />

          <ArrayFieldEditor
            label="Features"
            values={product.features}
            onChange={(v) => updateField('features', v)}
            placeholder="e.g. Water-resistant"
          />

          <ArrayFieldEditor
            label="Tags"
            values={product.tags}
            onChange={(v) => updateField('tags', v)}
            placeholder="e.g. Accessories"
          />

          <ArrayFieldEditor
            label="Materials"
            values={product.materials}
            onChange={(v) => updateField('materials', v)}
            placeholder="e.g. 100% Cotton"
          />

          {/* Divider */}
          <div className="pt-4">
            <div className="w-full h-px bg-gray-100" />
          </div>

          {/* Weight & Dimensions */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
                Weight
              </label>
              <input
                type="text"
                value={product.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
                placeholder="e.g. 1.2 kg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={product.dimensions}
                onChange={(e) => updateField('dimensions', e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300"
                placeholder="e.g. 457 × 457 × 152 mm"
              />
            </div>
          </div>

          {/* Care Instructions */}
          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
              Care Instructions
            </label>
            <textarea
              value={product.careInstructions}
              onChange={(e) => updateField('careInstructions', e.target.value)}
              rows={2}
              className="w-full bg-transparent border-0 border-b border-gray-100 px-0 py-2 text-sm font-light text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-300 resize-none"
              placeholder="How to care for this product..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-5">
          <button
            onClick={handleClose}
            className="minimal-button w-full px-8 py-3.5 text-xs tracking-[0.15em] uppercase"
          >
            Done
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
