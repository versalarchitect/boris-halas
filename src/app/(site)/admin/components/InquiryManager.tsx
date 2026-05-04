'use client';

import { useState, useEffect, useCallback } from 'react';

interface Inquiry {
  id: string;
  product_id: string;
  product_title: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface InquiryManagerProps {
  authToken: string;
}

export default function InquiryManager({ authToken }: InquiryManagerProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { 'x-admin-token': authToken },
      });
      if (res.ok) {
        const data: Inquiry[] = await res.json();
        setInquiries(data);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const grouped = inquiries.reduce<Record<string, { title: string; items: Inquiry[] }>>(
    (acc, inq) => {
      if (!acc[inq.product_id]) {
        acc[inq.product_id] = { title: inq.product_title, items: [] };
      }
      acc[inq.product_id].items.push(inq);
      return acc;
    },
    {}
  );

  const productIds = Object.keys(grouped);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs font-light text-gray-400 tracking-wider uppercase">
          Loading inquiries...
        </p>
      </div>
    );
  }

  if (productIds.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-light text-gray-400 mb-2">No inquiries yet</p>
          <p className="text-xs font-light text-gray-300">
            Inquiries submitted from product pages will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-light tracking-[0.15em] uppercase text-black">
            Inquiries
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">
            {inquiries.length} total across {productIds.length} product{productIds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadInquiries}
          className="text-[10px] font-medium tracking-[0.1em] uppercase text-gray-400 hover:text-black transition-colors duration-300"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-1">
        {productIds.map((productId) => {
          const { title, items } = grouped[productId];
          const isExpanded = expandedProduct === productId;

          return (
            <div key={productId} className="border border-gray-100">
              <button
                onClick={() => setExpandedProduct(isExpanded ? null : productId)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-black">{title}</span>
                  <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-gray-400">
                    {items.length} inquir{items.length !== 1 ? 'ies' : 'y'}
                  </span>
                </div>
                <span className="text-[12px] text-gray-400">{isExpanded ? '−' : '+'}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  {items.map((inq) => (
                    <div
                      key={inq.id}
                      className="px-5 py-4 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[12px] font-medium text-black">
                              {inq.name}
                            </span>
                            <a
                              href={`mailto:${inq.email}`}
                              className="text-[11px] text-gray-400 hover:text-black transition-colors truncate"
                            >
                              {inq.email}
                            </a>
                          </div>
                          {inq.message && (
                            <p className="text-[12px] leading-relaxed text-gray-600 mt-1">
                              {inq.message}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-300 flex-shrink-0 tabular-nums">
                          {formatDate(inq.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
