import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

export function AdminDashboard({ books = [], onNavigateToBooks = null }) {
  const stats = [
    {
      label: 'Total Books',
      value: books.length,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Published',
      value: books.filter((b) => b.published).length,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Drafts',
      value: books.filter((b) => !b.published).length,
      icon: BookOpen,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your BulkBuk administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-2xl shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your book library efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onNavigateToBooks}
            className="w-full h-12 text-base"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Manage Books
          </Button>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="rounded-lg border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">📊 Book Statistics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>View comprehensive analytics about your book collection.</p>
              </CardContent>
            </Card>

            <Card className="rounded-lg border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🔍 Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Quickly find and filter books by title, author, or category.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="rounded-2xl border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="text-base text-blue-900 dark:text-blue-100">ℹ️ System Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>• Books are stored locally in your browser (localStorage)</p>
          <p>• All changes are saved automatically</p>
          <p>• You can create, edit, and delete books from the Books Manager</p>
          <p>• Data persists across page refreshes and sessions</p>
        </CardContent>
      </Card>
    </div>
  );
}
