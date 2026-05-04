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

export interface GalleryImage {
  id: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sort_order: number;
}

interface GalleryManagerProps {
  category: string;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  authToken: string;
}

function SortableThumb({
  image,
  onDelete,
}: {
  image: GalleryImage;
  onDelete: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? 'transform 200ms ease',
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 'auto' as const,
      }}
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
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black text-white"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          cursor: 'pointer',
          fontSize: '10px',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div
        className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-medium tracking-wider"
        style={{ background: 'rgba(0,0,0,0.6)', color: 'white', opacity: isHovered ? 0 : 0.7 }}
      >
        {image.sort_order + 1}
      </div>
    </div>
  );
}

export default function GalleryManager({
  category,
  images: parentImages,
  onImagesChange,
  authToken,
}: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(parentImages);
  const [orderDirty, setOrderDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    setImages(parentImages);
    setOrderDirty(false);
    setSaveStatus('idle');
  }, [parentImages]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex((img) => img.id === active.id);
    const newIdx = images.findIndex((img) => img.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove(images, oldIdx, newIdx).map((img, i) => ({
      ...img,
      sort_order: i,
    }));
    setImages(reordered);
    setOrderDirty(true);
    setSaveStatus('idle');
  }, [images]);

  const handleSaveOrder = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': authToken },
        body: JSON.stringify(images.map((img) => ({ id: img.id, sort_order: img.sort_order }))),
      });
      if (res.ok) {
        setSaveStatus('saved');
        setOrderDirty(false);
        onImagesChange(images);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, [images, authToken, onImagesChange]);

  const handleUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    let count = 0;
    const total = files.length;
    const newImages = [...images];

    for (const file of Array.from(files)) {
      count++;
      setUploadProgress(`${count}/${total}`);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('alt', `${category} photo`);
        const res = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          headers: { 'x-admin-token': authToken },
          body: formData,
        });
        if (res.ok) {
          const record = await res.json();
          newImages.push(record as GalleryImage);
        }
      } catch { /* toast handled by parent */ }
    }

    setImages(newImages);
    onImagesChange(newImages);
    setIsUploading(false);
    setUploadProgress(null);
  }, [images, category, authToken, onImagesChange]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': authToken },
      });
      if (res.ok) {
        const updated = images.filter((img) => img.id !== id).map((img, i) => ({ ...img, sort_order: i }));
        setImages(updated);
        onImagesChange(updated);
      }
    } catch { /* silent */ }
  }, [images, authToken, onImagesChange]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  };

  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="flex-1 flex flex-col py-10 px-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400">
          {label} Gallery — {images.length} images
        </h3>
        {orderDirty && (
          <button
            onClick={handleSaveOrder}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase transition-all duration-300"
            style={{
              background: saveStatus === 'saved' ? '#000' : saveStatus === 'error' ? '#dc2626' : 'transparent',
              color: saveStatus === 'saved' || saveStatus === 'error' ? '#fff' : '#000',
              border: '1px solid',
              borderColor: saveStatus === 'saved' ? '#000' : saveStatus === 'error' ? '#dc2626' : '#000',
              opacity: saveStatus === 'saving' ? 0.6 : 1,
            }}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save Order'}
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-3">
            {images.map((image) => (
              <SortableThumb key={image.id} image={image} onDelete={handleDelete} />
            ))}
            <div
              className="w-[120px] h-[120px] flex items-center justify-center cursor-pointer"
              style={{ border: '2px dashed rgba(0,0,0,0.1)' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
              onDrop={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; handleFileDrop(e); }}
            >
              {isUploading ? (
                <div className="text-center">
                  <div className="w-5 h-5 border border-black border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
                  <p className="text-[9px] text-gray-400 tracking-wider">{uploadProgress}</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-300">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <p className="text-[9px] text-gray-300 tracking-wider uppercase">Add</p>
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
          if (e.target.files?.length) { handleUpload(e.target.files); e.target.value = ''; }
        }}
      />
    </div>
  );
}
