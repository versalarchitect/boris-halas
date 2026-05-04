'use client';

import { useState, useCallback, useRef } from 'react';
import PasswordGate from './components/PasswordGate';
import SortableProductGrid from './components/SortableProductGrid';
import ProductEditor from './components/ProductEditor';
import Toast, { type ToastMessage } from './components/Toast';

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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function newProductTemplate(sortOrder: number): AdminProduct {
  return {
    id: `product_${Date.now()}`,
    title: '',
    category: '',
    productCode: '',
    status: 'available',
    price: 0,
    currency: 'EUR',
    description: '',
    longDescription: '',
    specifications: [],
    features: [],
    tags: [],
    weight: '',
    dimensions: '',
    materials: [],
    careInstructions: '',
    sortOrder,
    images: [],
  };
}

/* ------------------------------------------------------------------ */
/*  Main Admin Page                                                    */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  /* Auth state */
  const [authToken, setAuthToken] = useState<string | null>(null);

  /* Data state */
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  /* UI state */
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const initialLoadDone = useRef(false);

  /* ---------------------------------------------------------------- */
  /*  Toast helpers                                                    */
  /* ---------------------------------------------------------------- */

  const addToast = useCallback(
    (type: ToastMessage['type'], text: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, text }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---------------------------------------------------------------- */
  /*  API helpers                                                      */
  /* ---------------------------------------------------------------- */

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          'x-admin-token': authToken ?? '',
          ...options.headers,
        },
      });
    },
    [authToken]
  );

  /* ---------------------------------------------------------------- */
  /*  Load products                                                    */
  /* ---------------------------------------------------------------- */

  const loadProducts = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/admin/products');
      if (res.ok) {
        const data: AdminProduct[] = await res.json();
        setProducts(data);
        setUnsavedChanges(new Set());
      } else {
        addToast('error', 'Failed to load products');
      }
    } catch {
      addToast('error', 'Connection error loading products');
    } finally {
      setIsLoading(false);
    }
  }, [authToken, apiFetch, addToast]);

  /* ---------------------------------------------------------------- */
  /*  Auth callback                                                    */
  /* ---------------------------------------------------------------- */

  const handleAuthenticated = useCallback(
    async (token: string) => {
      setAuthToken(token);
      setIsMounted(true);

      // Load products immediately
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/products', {
          headers: { 'x-admin-token': token },
        });
        if (res.ok) {
          const data: AdminProduct[] = await res.json();
          setProducts(data);
          initialLoadDone.current = true;
        } else {
          addToast('error', 'Failed to load products');
        }
      } catch {
        addToast('error', 'Connection error');
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  /* ---------------------------------------------------------------- */
  /*  Product operations                                               */
  /* ---------------------------------------------------------------- */

  const handleReorder = useCallback(
    (reordered: AdminProduct[]) => {
      setProducts(reordered);
      // Mark all reordered products as having unsaved changes
      const ids = new Set(reordered.map((p) => p.id));
      setUnsavedChanges((prev) => new Set([...prev, ...ids]));
    },
    []
  );

  const handleEditProduct = useCallback((id: string) => {
    setEditingProductId(id);
  }, []);

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        const res = await apiFetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          setUnsavedChanges((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          addToast('success', 'Product deleted');
        } else {
          addToast('error', 'Failed to delete product');
        }
      } catch {
        addToast('error', 'Connection error');
      }
    },
    [apiFetch, addToast]
  );

  const handleAddProduct = useCallback(() => {
    const newProduct = newProductTemplate(products.length);
    setProducts((prev) => [...prev, newProduct]);
    setUnsavedChanges((prev) => new Set([...prev, newProduct.id]));
    setEditingProductId(newProduct.id);
    addToast('info', 'New product created — edit details and save');
  }, [products.length, addToast]);

  const handleProductSave = useCallback(
    (updated: AdminProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setUnsavedChanges((prev) => new Set([...prev, updated.id]));
    },
    []
  );

  const handleCloseEditor = useCallback(() => {
    setEditingProductId(null);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Image operations                                                 */
  /* ---------------------------------------------------------------- */

  const handleImageUpload = useCallback(
    async (productId: string, file: File): Promise<AdminImage | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId);

        const res = await apiFetch('/api/admin/images/upload', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type — browser sets multipart boundary
          headers: { 'x-admin-token': authToken ?? '' },
        });

        if (res.ok) {
          const data: AdminImage = await res.json();
          // Also update the main products array
          setProducts((prev) =>
            prev.map((p) =>
              p.id === productId
                ? { ...p, images: [...p.images, data] }
                : p
            )
          );
          addToast('success', `Uploaded ${file.name}`);
          return data;
        } else {
          addToast('error', `Failed to upload ${file.name}`);
          return null;
        }
      } catch {
        addToast('error', `Upload error: ${file.name}`);
        return null;
      }
    },
    [apiFetch, authToken, addToast]
  );

  const handleImageDelete = useCallback(
    async (imageId: string): Promise<boolean> => {
      try {
        const res = await apiFetch(`/api/admin/images/${imageId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          // Also remove from main products array
          setProducts((prev) =>
            prev.map((p) => ({
              ...p,
              images: p.images.filter((img) => img.id !== imageId),
            }))
          );
          addToast('success', 'Image deleted');
          return true;
        } else {
          addToast('error', 'Failed to delete image');
          return false;
        }
      } catch {
        addToast('error', 'Connection error deleting image');
        return false;
      }
    },
    [apiFetch, addToast]
  );

  const handleImageReorder = useCallback(
    (productId: string, images: AdminImage[]) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, images } : p))
      );
      setUnsavedChanges((prev) => new Set([...prev, productId]));
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  Save all                                                         */
  /* ---------------------------------------------------------------- */

  const handleSaveAll = useCallback(async () => {
    if (unsavedChanges.size === 0) {
      addToast('info', 'No changes to save');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiFetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken ?? '',
        },
        body: JSON.stringify(products),
      });

      if (res.ok) {
        setUnsavedChanges(new Set());
        addToast('success', `Saved ${products.length} products`);
      } else {
        const data = await res.json().catch(() => ({}));
        addToast('error', data.error || 'Failed to save');
      }
    } catch {
      addToast('error', 'Connection error saving');
    } finally {
      setIsSaving(false);
    }
  }, [unsavedChanges, products, apiFetch, authToken, addToast]);

  /* ---------------------------------------------------------------- */
  /*  Seed from config                                                 */
  /* ---------------------------------------------------------------- */

  const handleSeed = useCallback(async () => {
    if (!confirm('This will seed products and upload images to Supabase. Continue?')) return;

    setIsSeeding(true);
    try {
      const res = await apiFetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        addToast('success', `Seeded ${data.count} products with images`);
        await loadProducts();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast('error', data.error || 'Seed failed');
      }
    } catch {
      addToast('error', 'Connection error during seed');
    } finally {
      setIsSeeding(false);
    }
  }, [apiFetch, addToast, loadProducts]);

  /* ---------------------------------------------------------------- */
  /*  Render: Password Gate                                            */
  /* ---------------------------------------------------------------- */

  if (!authToken) {
    return <PasswordGate onAuthenticated={handleAuthenticated} />;
  }

  /* ---------------------------------------------------------------- */
  /*  Render: Main CMS                                                 */
  /* ---------------------------------------------------------------- */

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId) ?? null
    : null;

  const changeCount = unsavedChanges.size;

  const navLinks: { label: string; href: string }[] = [
    { label: 'Around', href: 'https://www.borishalas.com' },
    { label: 'Fashion', href: 'https://www.borishalas.com/fashion' },
    { label: 'Editorial', href: 'https://www.borishalas.com/editorial' },
    { label: 'Music', href: 'https://www.borishalas.com/music' },
    { label: 'Somewhere', href: 'https://www.borishalas.com/somewhere' },
    { label: 'Store', href: '' },
    { label: 'Info', href: 'https://www.borishalas.com/info' },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{
        background: isMounted ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isMounted ? 'blur(24px)' : 'blur(0px)',
        WebkitBackdropFilter: isMounted ? 'blur(24px)' : 'blur(0px)',
        transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
    {/* Close button */}
    <a
      href="/"
      className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 z-[91]"
      title="Close CMS"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </a>
    <div
      className="relative bg-white text-black flex overflow-hidden"
      style={{
        width: 'calc(100vw - 48px)',
        height: 'calc(100vh - 48px)',
        maxWidth: '1600px',
        maxHeight: '1000px',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        opacity: isMounted ? 1 : 0,
        transform: isMounted ? 'scale(1)' : 'scale(0.97)',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
      }}
    >
      {/* ======================== Left Sidebar ======================== */}
      <aside
        className="flex-shrink-0 flex flex-col justify-between border-r border-gray-100 py-10 px-8"
        style={{ width: 180 }}
      >
        {/* Top: logo + nav */}
        <div>
          <h1
            className="text-sm font-light tracking-[0.25em] text-black mb-1"
            style={{ letterSpacing: '0.25em' }}
          >
            BORIS HALAS
          </h1>
          <span className="inline-block text-[9px] font-medium tracking-[0.15em] text-gray-400 uppercase px-1.5 py-0.5 border border-gray-200 mb-10">
            CMS
          </span>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] py-1 hover:text-black transition-colors duration-200"
                  style={{
                    fontWeight: 300,
                    color: '#999',
                    letterSpacing: '0.02em',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <span
                  key={link.label}
                  className="text-[13px] py-1 cursor-default select-none"
                  style={{
                    fontWeight: 600,
                    color: '#000',
                    letterSpacing: '0.02em',
                  }}
                >
                  {link.label}
                </span>
              )
            )}
          </nav>
        </div>

        {/* Bottom: actions + copyright */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full text-left px-0 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase text-gray-400 hover:text-black transition-colors duration-300 disabled:opacity-30"
            title="Load products from local config"
          >
            {isSeeding ? 'Loading...' : 'Seed'}
          </button>
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="w-full text-left px-0 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase text-gray-400 hover:text-black transition-colors duration-300 disabled:opacity-30"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || changeCount === 0}
            className="w-full text-left px-0 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-70 transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save All'}
          </button>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-300 tracking-wide leading-relaxed">
              &copy; {new Date().getFullYear()} Boris Halas
            </p>
          </div>
        </div>
      </aside>

      {/* ======================== Main Content ======================== */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Horizontal scrolling product area */}
        <section className="flex-1 flex items-stretch py-10 px-8 overflow-x-auto scrollbar-hide">
          {isLoading && products.length === 0 ? (
            /* Loading skeleton */
            <div className="flex gap-6 items-stretch">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-white"
                  style={{ width: 320 }}
                >
                  <div
                    className="skeleton"
                    style={{ width: 320, aspectRatio: '3/4' }}
                  />
                  <div className="pt-4 space-y-2">
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-3 w-1/4 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SortableProductGrid
              products={products}
              onReorder={handleReorder}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={handleAddProduct}
              unsavedChanges={unsavedChanges}
            />
          )}

          {/* Empty state */}
          {!isLoading && products.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-light text-gray-400 mb-2">
                  No products yet
                </p>
                <p className="text-xs font-light text-gray-300 mb-8">
                  Add a product or seed from the local config
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-2.5 text-[10px] tracking-[0.15em] uppercase border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={handleSeed}
                    className="px-6 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 hover:text-black border border-gray-200 hover:border-gray-400 transition-all duration-300"
                  >
                    Seed from Config
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ======================== Save Bar ======================== */}
        {changeCount > 0 && (
          <div
            className="flex-shrink-0 bg-black text-white z-40"
            style={{
              animation: 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            }}
          >
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full bg-white"
                  style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                />
                <span className="text-xs font-light tracking-wider">
                  {changeCount} unsaved change{changeCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setUnsavedChanges(new Set());
                    loadProducts();
                  }}
                  className="px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/60 transition-all duration-300"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-6 py-2 text-[10px] font-medium tracking-[0.1em] uppercase bg-white text-black hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================== Product Editor ======================== */}
      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onSave={handleProductSave}
          onClose={handleCloseEditor}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageReorder={handleImageReorder}
          authToken={authToken}
        />
      )}

      {/* ======================== Toasts ======================== */}
      <Toast messages={toasts} onDismiss={dismissToast} />

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
    </div>
  );
}
