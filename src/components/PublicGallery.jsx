import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Headphones,
  MoreHorizontal,
  Search,
  Filter,
  Pencil,
  Trash2,
  Shield,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";

const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
)}`;
const LS_KEY = "bulkbuk.books.v1";
const ADMIN_FLAG = "bulkbuk.isAdmin";
const ADMIN_KEY = "bulkbuk_admin_demo_key";

function BookCard({ book, onOpen, isAdmin, onEdit, onDelete }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
            <CardDescription className="mt-1">by {book.author}</CardDescription>
          </div>
          {isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="shrink-0"><MoreHorizontal className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(book)}>
                  <Pencil className="w-4 h-4 mr-2"/> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(book.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2"/> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-24 h-32 object-cover rounded-xl" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
          ) : (
            <div className="w-24 h-32 rounded-xl bg-muted flex items-center justify-center">
              <BookOpen className="w-8 h-8 opacity-50"/>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground line-clamp-4">{book.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.categories?.slice(0, 3).map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
              {book.tags?.slice(0, 3).map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{new Date(book.createdAt).toLocaleDateString()}</div>
        <div className="flex items-center gap-2">
          {book.audioUrl ? <Button variant="outline" size="sm" onClick={() => onOpen(book)}><Headphones className="w-4 h-4 mr-2"/>Play Overview</Button> : null}
          <Button size="sm" onClick={() => onOpen(book)}>View</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function BookModal({ open, onOpenChange, book }) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{book?.title}</DialogTitle>
        </DialogHeader>
        {book ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full aspect-[3/4] object-cover rounded-2xl" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
              ) : (
                <div className="w-full aspect-[3/4] rounded-2xl bg-muted flex items-center justify-center">
                  <BookOpen className="w-10 h-10 opacity-50"/>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">by {book.author}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.categories?.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
                  {book.tags?.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </div>
              {book.audioUrl ? (
                <div className="space-y-2">
                  <Label>Audio Overview</Label>
                  <audio ref={audioRef} controls src={book.audioUrl} className="w-full rounded-xl" />
                </div>
              ) : null}
              <Separator />
              <div className="space-y-2">
                <Label>Summary</Label>
                <p className="text-sm leading-6 whitespace-pre-wrap">{book.summary}</p>
              </div>
              {book.notes?.length ? (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    {book.notes.map((n) => (
                      <li key={n.id}>
                        <span className="font-medium">{n.title}:</span> {n.content}
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

export function PublicGallery({ books, theme, setTheme, onAdmin }) {
  const [query, setQuery] = useState("");
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const handleAdminClick = () => {
    setShowAuth(true);
  };

  const handleLogin = (attemptedKey) => {
    const ADMIN_KEY = "bulkbuk_admin_demo_key";
    if (attemptedKey.trim() === ADMIN_KEY) {
      localStorage.setItem("bulkbuk.isAdmin", "1");
      setShowAuth(false);
      setAdminKey("");
      onAdmin();
    } else {
      alert("Invalid admin key (demo: bulkbuk_admin_demo_key)");
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return books
      .filter((b) => (onlyPublished ? b.published : true))
      .filter((b) =>
        q
          ? [b.title, b.author, b.summary, ...(b.categories||[]), ...(b.tags||[])]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [books, query, onlyPublished]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-xl font-semibold tracking-tight">BulkBuk</h1>
          <Badge className="ml-2" variant="secondary">Books • Summaries • Audio Overviews</Badge>
          <div className="ml-auto flex items-center gap-3">
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleAdminClick}><Shield className="w-4 h-4 mr-2"/>Admin</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filters */}
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border px-3">
                <Search className="w-4 h-4"/>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-10 bg-transparent outline-none text-sm"
                  placeholder="Search by title, author, tag…"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border px-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4"/>
                  <span className="text-sm">Only Published</span>
                </div>
                <Switch checked={onlyPublished} onCheckedChange={setOnlyPublished} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <motion.div key={b.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <BookCard
                book={b}
                onOpen={(bk) => setSelected(bk)}
                isAdmin={false}
              />
            </motion.div>
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-sm text-muted-foreground p-10 border rounded-2xl">
              No books yet. Please check back soon!
            </div>
          ) : null}
        </div>
      </main>

      {/* Book modal */}
      <BookModal open={Boolean(selected)} onOpenChange={(v) => !v && setSelected(null)} book={selected} />

      {/* Admin auth dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> Admin Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter your admin key to access the dashboard tools.</p>
            <Input
              type="password"
              placeholder="Admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(adminKey); }}
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleLogin(adminKey)}><LogIn className="w-4 h-4 mr-2"/>Sign in</Button>
              <Button className="flex-1" variant="outline" onClick={() => setShowAuth(false)}>Cancel</Button>
            </div>
            <p className="text-xs text-muted-foreground">Demo key: <code>bulkbuk_admin_demo_key</code></p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <span>© {new Date().getFullYear()} BulkBuk</span>
          <span className="mx-2">•</span>
          <span>Find concise summaries and audio overviews of great books.</span>
        </div>
      </footer>
    </div>
  );
}
