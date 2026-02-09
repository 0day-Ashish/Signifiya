'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Infobar from './Infobar';

export default function ConditionalInfobar() {
  const pathname = usePathname();
  const [showInfobar, setShowInfobar] = useState(false);

  useEffect(() => {
    // On homepage, wait for preloader to be shown before displaying infobar
    if (pathname === '/') {
      const hasSeenPreloader = sessionStorage.getItem('preloaderShown') === 'true';
      if (hasSeenPreloader) {
        setShowInfobar(true);
      } else {
        // Listen for preloader completion
        const checkPreloader = () => {
          if (sessionStorage.getItem('preloaderShown') === 'true') {
            setShowInfobar(true);
          }
        };

        // Check periodically until preloader is done
        const interval = setInterval(checkPreloader, 100);
        return () => clearInterval(interval);
      }
    } else {
      // On other pages, show immediately
      setShowInfobar(true);
    }
  }, [pathname]);

  // Hide Infobar on admin routes, sign-in page, and terms page
  if (pathname?.startsWith('/admin') || pathname === '/sign-in' || pathname === '/terms') {
    return null;
  }

  // Don't render until we know whether to show it
  if (!showInfobar) {
    return null;
  }

  return <Infobar />;
}
