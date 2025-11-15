import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function UserLayout({ children, theme, onThemeToggle, onLogoClick }) {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    window.location.hash = '/';
  };

  const handleLogoClick = () => {
    setSidebarOpen(false);
    if (onLogoClick) onLogoClick();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-card border-r transition-all z-50 lg:relative lg:z-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 space-y-8 h-full flex flex-col">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-left"
          >
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold">BulkBuk</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </button>

          {/* User Info */}
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-semibold">{auth.user.username}</p>
            <p className="text-xs text-muted-foreground mt-1">User Account</p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings */}
          <div className="space-y-2 border-t pt-4">
            <button 
              onClick={onThemeToggle}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted/30 transition text-left"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark Mode</span>
                </>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 transition text-left text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onThemeToggle}
              className="hidden lg:flex"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
