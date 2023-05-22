import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Container from './Container';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
