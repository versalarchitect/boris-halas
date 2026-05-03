'use client';

import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

function ToastItem({ message, onDismiss }: { message: ToastMessage; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onDismiss, 400);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = message.type === 'error' ? 'bg-red-950' : message.type === 'success' ? 'bg-black' : 'bg-gray-800';
  const icon = message.type === 'error' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ) : message.type === 'success' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  return (
    <div
      className={`${bgColor} text-white px-5 py-3.5 flex items-center gap-3 shadow-lg transition-all duration-400 cursor-pointer select-none`}
      style={{
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        minWidth: '280px',
        maxWidth: '400px',
      }}
      onClick={onDismiss}
    >
      <span className="flex-shrink-0 opacity-80">{icon}</span>
      <span className="text-sm font-light tracking-wide leading-snug">{message.text}</span>
    </div>
  );
}

export default function Toast({ messages, onDismiss }: ToastProps) {
  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={() => onDismiss(msg.id)} />
      ))}
    </div>
  );
}
