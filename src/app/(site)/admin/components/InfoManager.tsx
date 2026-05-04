'use client';

import { useState, useRef } from 'react';

interface InfoManagerProps {
  authToken: string;
}

export default function InfoManager({ authToken }: InfoManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cacheKey, setCacheKey] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/info/photo', {
        method: 'POST',
        headers: { 'x-admin-token': authToken },
        body: formData,
      });
      if (res.ok) {
        setUploadStatus('success');
        setCacheKey(Date.now());
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        setUploadStatus('error');
      }
    } catch {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col py-10 px-8 overflow-y-auto">
      <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-8">
        Info Page
      </h3>

      {/* Bio Photo */}
      <div className="mb-10">
        <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-4">
          Bio Photo
        </label>
        <div className="flex items-start gap-6">
          <div
            className="w-[160px] h-[160px] overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <img
              src={`/boris.jpg?v=${cacheKey}`}
              alt="Current bio photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 text-[10px] font-medium tracking-[0.15em] uppercase border border-black text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30"
            >
              {isUploading ? 'Uploading...' : 'Replace Photo'}
            </button>
            {uploadStatus === 'success' && (
              <p className="text-[10px] text-green-600 tracking-wider">Photo updated</p>
            )}
            {uploadStatus === 'error' && (
              <p className="text-[10px] text-red-500 tracking-wider">Upload failed</p>
            )}
            <p className="text-[9px] text-gray-300 tracking-wider max-w-[200px]">
              This replaces the photo shown on the /info page. JPG or PNG recommended.
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) { handleUpload(file); e.target.value = ''; }
          }}
        />
      </div>

      {/* Contact Info (read-only) */}
      <div className="space-y-6 border-t border-gray-100 pt-8">
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
            Contact Email
          </label>
          <p className="text-sm font-light text-black">borishalasphoto@gmail.com</p>
          <p className="text-[9px] text-gray-300 tracking-wider mt-1">Edit in source code</p>
        </div>
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-2">
            Instagram
          </label>
          <a
            href="https://www.instagram.com/borishalas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light text-black hover:underline"
          >
            instagram.com/borishalas
          </a>
          <p className="text-[9px] text-gray-300 tracking-wider mt-1">Edit in source code</p>
        </div>
      </div>
    </div>
  );
}
