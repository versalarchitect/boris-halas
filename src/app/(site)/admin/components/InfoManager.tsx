'use client';

interface InfoManagerProps {
  authToken: string;
}

export default function InfoManager({ authToken }: InfoManagerProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-light text-gray-400 mb-2">
          Info Manager
        </p>
        <p className="text-xs font-light text-gray-300">
          Coming soon
        </p>
      </div>
    </div>
  );
}
