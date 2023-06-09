import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  isDev: boolean;
  children: React.ReactNode;
}

export default function Layout({ isDev, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      {isDev && (
        <div className="absolute top-3 left-1/3 text-xl font-bold text-white z-10">
          DEV-ENV
        </div>
      )}
      <Header />
      <main className="mt-16">{children}</main>
      <Footer />
    </div>
  );
}
