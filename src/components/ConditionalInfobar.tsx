'use client';

import { usePathname } from 'next/navigation';
import Infobar from './Infobar';

export default function ConditionalInfobar() {
  const pathname = usePathname();
  
  // Hide Infobar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Infobar />;
}
