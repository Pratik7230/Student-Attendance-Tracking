'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MobileAlert() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if window width is less than 768px (mobile breakpoint)
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // Show alert only once per session if on mobile
      if (isMobileView && !sessionStorage.getItem('mobileAlertShown')) {
        setOpen(true);
        sessionStorage.setItem('mobileAlertShown', 'true');
      }
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <AlertDialog open={open && isMobile} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mobile View Detected</AlertDialogTitle>
          <AlertDialogDescription>
            For best result open in desktop mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={() => setOpen(false)}>
          Continue
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
