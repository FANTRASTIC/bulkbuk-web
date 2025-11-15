import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Search, Filter, LogIn, Sun, Moon } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';

const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
)}`;

function BookCard({ book, onOpen, isAdmin, onEdit, onDelete }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card className="rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col h-full bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="space-y-2">
          <CardTitle className="text-xl leading-tight line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="text-sm">{book.author}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-6 flex-1">
        <div className="flex gap-5 h-full">
          <div className="flex-shrink-0">
            {book.coverUrl && !imageError ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-24 h-32 object-cover rounded-xl shadow-md" 
                crossOrigin="anonymous"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  setImageError(true);
                  e.currentTarget.src = PLACEHOLDER_COVER;
                }} 
              />
            ) : (
              <div className="w-24 h-32 rounded-xl bg-muted flex items-center justify-center shadow-md">
                <BookOpen className="w-8 h-8 opacity-40"/>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">{book.summary}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {book.categories?.slice(0, 2).map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
              {book.tags?.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 pb-6 px-6 border-t bg-muted/20">
        <div className="w-full flex items-center gap-2 justify-between">
          <div className="text-xs text-muted-foreground">{new Date(book.createdAt).toLocaleDateString()}</div>
          <Button size="sm" onClick={() => onOpen(book)} className="text-sm h-9 px-4">View Details</Button>
        </div>
        {isAdmin && (
          <div className="w-full flex gap-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(book)} 
              className="flex-1 text-sm h-9 justify-center"
            >
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(book.id)} 
              className="flex-1 text-sm h-9 justify-center"
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function BookModal({ open, onOpenChange, book }) {
  const audioRef = React.useRef(null);
  React.useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-3xl font-bold tracking-tight">{book?.title}</DialogTitle>
        </DialogHeader>
        {book ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
              ) : (
                <div className="w-full aspect-[3/4] rounded-2xl bg-muted flex items-center justify-center shadow-lg">
                  <BookOpen className="w-12 h-12 opacity-30"/>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">by {book.author}</p>
                <div className="flex flex-wrap gap-2">
                  {book.categories?.map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                  {book.tags?.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              </div>
              {book.audioUrl ? (
                <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                  <div className="text-sm font-semibold">Audio Overview</div>
                  <audio ref={audioRef} controls src={book.audioUrl} className="w-full h-8 rounded" />
                </div>
              ) : null}
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="text-sm font-semibold">Summary</div>
                <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">{book.summary}</p>
              </div>
              {book.notes?.length ? (
                <div className="space-y-3">
                  <div className="text-sm font-semibold">Key Takeaways</div>
                  <ul className="space-y-2">
                    {book.notes.map((n) => (
                      <li key={n.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                        <span className="font-semibold text-primary">{n.title}:</span>
                        <p className="text-muted-foreground mt-1">{n.content}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function PublicGallery({ theme, onThemeToggle, onLoginClick, isAdmin, isAuthenticated, onMyContentClick, onEditBook, onDeleteBook }) {
  const { books } = useBooks();
  const [query, setQuery] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return books
      .filter((b) => !b.archived) // Always exclude archived
      .filter((b) => (onlyPublished ? b.published : true))
      .filter((b) =>
        q
          ? [b.title, b.author, b.summary, ...(b.categories||[]), ...(b.tags||[])]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [books, query, onlyPublished]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BulkBuk</h1>
              <p className="text-xs text-muted-foreground">Books • Summaries • Insights</p>
            </div>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeToggle} aria-label="Toggle theme" className="rounded-lg">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={onMyContentClick} className="gap-1">
                  <BookOpen className="w-4 h-4"/>
                  My Content
                </Button>
                {isAdmin && (
                  <Button size="sm" onClick={onLoginClick} className="gap-1">
                    <BookOpen className="w-4 h-4"/>
                    Admin Panel
                  </Button>
                )}
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={onLoginClick} className="gap-1">
                <LogIn className="w-4 h-4"/>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Book Library</h2>
            <p className="text-sm text-muted-foreground">Discover and explore our curated collection of books with detailed summaries and insights.</p>
          </div>
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 flex items-center gap-2 rounded-lg border px-3 h-10 bg-muted/30 focus-within:ring-1 focus-within:ring-primary">
                  <Search className="w-4 h-4 text-muted-foreground"/>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-full bg-transparent outline-none text-sm"
                    placeholder="Search by title, author, category…"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 h-10 bg-muted/30">
                  <div className="flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-muted-foreground"/>
                    <span className="font-medium">Published</span>
                  </div>
                  <Switch checked={onlyPublished} onCheckedChange={setOnlyPublished} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {filtered.map((b) => (
            <motion.div key={b.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <BookCard
                book={b}
                onOpen={(bk) => setSelected(bk)}
                isAdmin={isAdmin}
                onEdit={onEditBook}
                onDelete={onDeleteBook}
              />
            </motion.div>
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No books found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No books match your search criteria. Please try again or check back later.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Book Modal */}
      <BookModal open={Boolean(selected)} onOpenChange={(v) => !v && setSelected(null)} book={selected} />

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">About BulkBuk</h3>
              <p className="text-sm text-muted-foreground">Discover curated book summaries and audio overviews for modern readers.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Book summaries & insights</li>
                <li>Audio overviews</li>
                <li>Smart categorization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">Have questions? Reach out to us.</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <span>© {new Date().getFullYear()} BulkBuk. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition">Privacy</a>
              <a href="#" className="hover:text-foreground transition">Terms</a>
              <a href="#" className="hover:text-foreground transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
