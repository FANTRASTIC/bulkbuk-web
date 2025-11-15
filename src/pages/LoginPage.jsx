import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage({ onLoginSuccess = null }) {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter username and password');
      return;
    }

    try {
      await login(username.trim(), password.trim());
      onLoginSuccess?.();
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">BulkBuk</h1>
          <p className="text-sm text-muted-foreground mt-2">Books • Summaries • Insights</p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Login to access your account and manage your library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin or user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {(localError || error) && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">{localError || error}</p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-2">Demo Accounts:</p>
                <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                  <p>👤 <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">admin</code> / <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">bulkbuk_admin_demo_key</code></p>
                  <p>👤 <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">user</code> / <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">user_demo_password</code></p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Browse books without logging in, or sign in to manage content.</p>
        </div>
      </div>
    </div>
  );
}
