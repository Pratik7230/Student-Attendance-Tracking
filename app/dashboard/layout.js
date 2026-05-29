'use client';
import React, { useState } from 'react';
import SideNav from './_components/SideNav';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

function layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SideNav isMobile={true} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 fixed h-screen z-30">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen pt-16 md:pt-0">{children}</div>
    </div>
  );
}

export default layout;
