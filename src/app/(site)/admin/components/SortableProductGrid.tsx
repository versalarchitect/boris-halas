'use client';

import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import SortableProductCard from './SortableProductCard';
import AddProductCard from './AddProductCard';

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

interface SortableProductGridProps {
  products: AdminProduct[];
  onReorder: (products: AdminProduct[]) => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
  unsavedChanges: Set<string>;
}

export default function SortableProductGrid({
  products,
  onReorder,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  unsavedChanges,
}: SortableProductGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(products, oldIndex, newIndex).map(
      (product, index) => ({
        ...product,
        sortOrder: index,
      })
    );

    onReorder(reordered);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeProduct = activeId ? products.find((p) => p.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6 items-start h-full">
          {products.map((product) => (
            <SortableProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              hasUnsavedChanges={unsavedChanges.has(product.id)}
            />
          ))}
          <AddProductCard onAdd={onAddProduct} />
        </div>
      </SortableContext>

      {/* Drag overlay - floating card that follows the cursor */}
      <DragOverlay
        dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {activeProduct ? (
          <div
            className="bg-white flex-shrink-0"
            style={{
              width: 320,
              boxShadow: '0 25px 80px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.15)',
              transform: 'scale(1.03) rotate(1.5deg)',
              cursor: 'grabbing',
              opacity: 0.95,
            }}
          >
            <div
              className="relative overflow-hidden bg-gray-50"
              style={{ aspectRatio: '3/4' }}
            >
              {activeProduct.images[0]?.url ? (
                <img
                  src={activeProduct.images[0].url}
                  alt={activeProduct.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <p className="text-xs text-gray-300 tracking-wider">NO IMAGE</p>
                </div>
              )}
              {activeProduct.status === 'sold-out' && (
                <span
                  className="absolute top-3 left-3 px-3 py-1.5 text-[10px] font-semibold tracking-wider bg-black text-white uppercase"
                >
                  SOLD OUT
                </span>
              )}
            </div>
            <div className="pt-3 pb-1 px-1">
              <p className="text-sm font-normal text-black tracking-wide">
                {activeProduct.title || 'Untitled Product'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeProduct.status === 'sold-out'
                  ? '—'
                  : `${activeProduct.currency === 'EUR' ? '€' : '$'}${activeProduct.price}.00`}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
