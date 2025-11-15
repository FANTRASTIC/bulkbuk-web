import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, LayoutDashboard, BookMarked, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AdminLayout({ children, currentPage, onNavigate, theme, onThemeToggle }) {
  const { logout, user } = useAuth();
  const [sidebarOpen, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  const handleLogoClick = () => {
    onNavigate('/');
  };

  const navItems = [
    { label: 'Dashboard', page: '/admin', icon: LayoutDashboard },
    { label: 'Books Manager', page: '/admin/books', icon: BookMarked },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">BulkBuk Admin</h1>
              <p className="text-xs text-muted-foreground">Manage your book library</p>
            </div>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1 hidden sm:flex">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!sidebarOpen)}
              className="sm:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex gap-0 lg:gap-6 lg:px-4 lg:py-4 max-w-7xl mx-auto lg:max-w-full">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'fixed inset-0 top-16 z-30 w-64 bg-background border-r' : 'hidden'
          } sm:relative sm:top-0 sm:z-0 sm:w-64 sm:block sm:border-r sm:bg-transparent`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* User Info */}
            <div className="mt-8 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Logged in as</p>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-semibold">{user?.username || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role === 'admin' ? '👑 Administrator' : 'User'}
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full mt-4 sm:hidden"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 sm:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}
