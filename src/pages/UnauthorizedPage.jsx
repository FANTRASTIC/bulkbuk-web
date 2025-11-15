import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Home } from 'lucide-react';

export function UnauthorizedPage({ reason = 'insufficient_permissions', onNavigateHome = null }) {
  const messages = {
    not_authenticated: {
      title: 'Please Sign In',
      description: 'You need to sign in to access this page.',
    },
    insufficient_permissions: {
      title: 'Access Denied',
      description: 'You do not have permission to access this page. Admin access required.',
    },
  };

  const msg = messages[reason] || messages.insufficient_permissions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{msg.title}</h1>
            <p className="text-sm text-muted-foreground">{msg.description}</p>
          </div>

          <Button
            onClick={onNavigateHome}
            className="w-full"
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    </div>
  );
}
