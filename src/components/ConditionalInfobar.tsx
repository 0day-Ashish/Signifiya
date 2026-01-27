'use client';

import { usePathname } from 'next/navigation';
import Infobar from './Infobar';

export default function ConditionalInfobar() {
  const pathname = usePathname();
  
  // Hide Infobar on admin routes and sign-in page
  if (pathname?.startsWith('/admin') || pathname === '/sign-in') {
    return null;
  }
  
  return <Infobar />;
}
