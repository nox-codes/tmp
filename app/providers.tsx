'use client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './lib/auth-context';
import { SidebarProvider } from './lib/sidebar-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
