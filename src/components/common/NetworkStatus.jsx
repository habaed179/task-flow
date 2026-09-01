import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showBackOnline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 py-1.5 px-4 text-center text-xs font-bold transition-all duration-300 ${
        !isOnline
          ? 'bg-rose-600 text-white shadow-md'
          : 'bg-emerald-600 text-white shadow-md'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>You are currently offline. Changes will sync when reconnected.</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>Back online! Reconnected to TaskFlow Cloud.</span>
          </>
        )}
      </div>
    </div>
  );
}
