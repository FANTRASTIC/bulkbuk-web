import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Headphones,
  Upload,
  Pencil,
  Trash2,
  Shield,
  MoreHorizontal,
  Search,
  Filter,
  LogIn,
  LogOut,
  Plus,
  Save,
  X,
  Sun,
  Moon,
} from "lucide-react";

// -----------------------------
// Helpers & Types
// -----------------------------
const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
)}`;
const LS_KEY = "bulkbuk.books.v1";
const ADMIN_FLAG = "bulkbuk.isAdmin";
const ADMIN_KEY = "bulkbuk_admin_demo_key"; // demo key; replace with real auth later

/** @typedef {Object} Book */
/** @typedef {Object} Note */

/**
 * Book shape for local storage demo
 * id: string
 * title: string
 * author: string
 * summary: string
 * categories: string[]
 * tags: string[]
 * coverUrl: string | null (object URL)
 * audioUrl: string | null (object URL)
 * notes: { id: string, title: string, content: string }[]
 * published: boolean
 * createdAt: string (ISO)
 * updatedAt: string (ISO)
 */

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function saveToStorage(books) {
  localStorage.setItem(LS_KEY, JSON.stringify(books));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function useLocalBooks() {
  const [books, setBooks] = useState(() => {
    const s = loadFromStorage();
    if (s && s.length) return s;
    // Seed demo data for first-time users so the UI looks populated
    const now = new Date().toISOString();
    const demo = [
      {
        id: uid('book'),
        title: 'Atomic Habits',
        author: 'James Clear',
        summary: 'Tiny changes, remarkable results — an easy & proven way to build good habits and break bad ones.',
        categories: ['Self-Improvement'],
        tags: ['habits', 'productivity'],
        coverUrl: PLACEHOLDER_COVER,
        audioUrl: null,
        notes: [ { id: uid('note'), title: 'Core Idea', content: 'Focus on systems, not goals.' } ],
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uid('book'),
        title: 'Deep Work',
        author: 'Cal Newport',
        summary: 'Rules for focused success in a distracted world. Practical strategies for producing at an elite level.',
        categories: ['Productivity'],
        tags: ['focus', 'work'],
        coverUrl: PLACEHOLDER_COVER,
        audioUrl: null,
        notes: [],
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uid('book'),
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        summary: 'A practical guide to modern software craftsmanship and pragmatic techniques.',
        categories: ['Software'],
        tags: ['engineering', 'best-practices'],
        coverUrl: PLACEHOLDER_COVER,
        audioUrl: null,
        notes: [],
        published: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    saveToStorage(demo);
    return demo;
  });

  useEffect(() => saveToStorage(books), [books]);
  return [books, setBooks];
}

function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_FLAG) === "1");
  const login = (key) => {
    if (key === ADMIN_KEY) {
      localStorage.setItem(ADMIN_FLAG, "1");
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    localStorage.removeItem(ADMIN_FLAG);
    setIsAdmin(false);
  };
  return { isAdmin, login, logout };
}

function Field({ label, children, hint, id }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ChipInput({ value, onChange, placeholder }) {
  const [text, setText] = useState("");
  const addChip = () => {
    const t = text.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setText("");
  };
  return (
    <div className="flex flex-wrap gap-2">
      {value.map((v) => (
        <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
      ))}
      <div className="flex gap-2 w-full sm:w-auto">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
        />
        <Button type="button" onClick={addChip} variant="outline">Add</Button>
      </div>
    </div>
  );
}

function FileDrop({ label, accept, onFile, previewUrl }) {
  const inputRef = useRef(null);
  const readAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  const onPick = async (f) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    let dataUrl = null;
    try {
      if (!accept || accept.includes('image')) {
        dataUrl = await readAsDataURL(f);
      }
    } catch (_) {}
    onFile({ file: f, url, dataUrl });
  };
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className="flex items-center justify-between gap-4 rounded-2xl border p-4"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex items-center gap-3">
          <Upload className="w-5 h-5" />
          <span className="text-sm">Click to upload</span>
        </div>
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        {previewUrl ? (
          <div className="ml-auto">
            {accept?.includes("image") ? (
              <img src={previewUrl} alt="preview" className="h-12 w-12 object-cover rounded-xl" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
            ) : (
              <audio src={previewUrl} controls className="h-10" />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BookCard({ book, onOpen, isAdmin, onEdit, onDelete }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="text-xs">{book.author}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3 flex-1">
        <div className="flex gap-3 h-full">
          <div className="flex-shrink-0">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-20 h-28 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
            ) : (
              <div className="w-20 h-28 rounded-lg bg-muted flex items-center justify-center">
                <BookOpen className="w-6 h-6 opacity-40"/>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{book.summary}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {book.categories?.slice(0, 2).map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
              {book.tags?.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-3 border-t bg-muted/30">
        <div className="w-full flex items-center gap-2 justify-between">
          <div className="text-xs text-muted-foreground">{new Date(book.createdAt).toLocaleDateString()}</div>
          <Button size="sm" onClick={() => onOpen(book)} className="text-xs h-8">View Details</Button>
        </div>
        {isAdmin && (
          <div className="w-full flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(book)} 
              className="flex-1 text-xs h-8 justify-center"
            >
              <Pencil className="w-3 h-3 mr-1"/> Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(book.id)} 
              className="flex-1 text-xs h-8 justify-center"
            >
              <Trash2 className="w-3 h-3 mr-1"/> Delete
            </Button>
          </div>
        )}
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

function AdminEditor({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [author, setAuthor] = useState(initial?.author || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [categories, setCategories] = useState(initial?.categories || []);
  const [tags, setTags] = useState(initial?.tags || []);
  const [notes, setNotes] = useState(initial?.notes || []);
  const [published, setPublished] = useState(Boolean(initial?.published));
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl || null);
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl || null);

  const noteTitleRef = useRef(null);
  const noteContentRef = useRef(null);

  const addNote = () => {
    const t = noteTitleRef.current?.value.trim();
    const c = noteContentRef.current?.value.trim();
    if (!t || !c) return;
    setNotes((prev) => [...prev, { id: uid("note"), title: t, content: c }]);
    noteTitleRef.current.value = "";
    noteContentRef.current.value = "";
  };

  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const handleSave = () => {
    const payload = {
      ...(initial || {}),
      id: initial?.id || uid("book"),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
      categories,
      tags,
      coverUrl,
      audioUrl,
      notes,
      published,
      updatedAt: new Date().toISOString(),
      createdAt: initial?.createdAt || new Date().toISOString(),
    };
    onSave(payload);
  };

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-3 space-y-4">
        <Field id="title" label="Title">
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Atomic Habits" />
        </Field>
        <Field id="author" label="Author">
          <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., James Clear" />
        </Field>
        <Field id="summary" label="Summary" hint="A concise, readable overview customers will see on the book page.">
          <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={8} placeholder="Write a polished overview..." />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Categories">
            <ChipInput value={categories} onChange={setCategories} placeholder="Add a category and press Enter" />
          </Field>
          <Field label="Tags">
            <ChipInput value={tags} onChange={setTags} placeholder="Add a tag and press Enter" />
          </Field>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          {notes.length ? (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-4 rounded-xl border p-3">
                  <div>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeNote(n.id)}>
                    <X className="w-4 h-4"/>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No notes yet. Add key takeaways, quotes, or frameworks.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <Input ref={noteTitleRef} placeholder="Note title" />
            <div className="flex gap-2">
              <Input ref={noteContentRef} placeholder="Note content" />
              <Button type="button" onClick={addNote}><Plus className="w-4 h-4 mr-2"/>Add</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 space-y-4">
        <FileDrop label="Cover Image" accept="image/*" onFile={({ url, dataUrl }) => setCoverUrl(dataUrl || url)} previewUrl={coverUrl} />
        <FileDrop label="Audio Overview (MP3/M4A)" accept="audio/*" onFile={({ url }) => setAudioUrl(url)} previewUrl={audioUrl} />
        <div className="flex items-center justify-between rounded-2xl border p-4">
          <div>
            <div className="text-sm font-medium">Published</div>
            <div className="text-xs text-muted-foreground">If off, the book is hidden from customers.</div>
          </div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1"><Save className="w-4 h-4 mr-2"/>Save</Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function BulkBukApp() {
  const { isAdmin, login, logout } = useAdminMode();
  // Theme handling (light/dark) persisted in localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('bulkbuk.theme');
      if (t) return t;
    } catch (e) {}
    // default to system if not set
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const cls = theme === 'dark' ? 'theme-dark' : 'theme-light';
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(cls);
    try { localStorage.setItem('bulkbuk.theme', theme); } catch (e) {}
  }, [theme]);
  const [books, setBooks] = useLocalBooks();
  const [query, setQuery] = useState("");
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

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

  const openCreate = () => {
    setEditing(null);
    setShowEditor(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setShowEditor(true);
  };

  const saveBook = (payload) => {
    setBooks((prev) => {
      const exists = prev.some((p) => p.id === payload.id);
      const next = exists ? prev.map((p) => (p.id === payload.id ? payload : p)) : [payload, ...prev];
      return next;
    });
    setShowEditor(false);
    setEditing(null);
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const [adminKey, setAdminKey] = useState("");
  const handleLogin = () => {
    const ok = login(adminKey.trim());
    if (!ok) alert("Invalid admin key (demo: bulkbuk_admin_demo_key)");
    setAdminKey("");
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BulkBuk</h1>
              <p className="text-xs text-muted-foreground">Books • Summaries • Insights</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" className="rounded-lg">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {isAdmin ? (
              <>
                <Button size="sm" onClick={openCreate} className="gap-1"><Plus className="w-4 h-4"/>New Book</Button>
                <Button variant="outline" size="sm" onClick={logout} className="gap-1"><LogOut className="w-4 h-4"/>Exit Admin</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuth(true)} className="gap-1"><Shield className="w-4 h-4"/>Admin</Button>
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
                    <span className="font-medium">Published Only</span>
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
                onEdit={openEdit}
                onDelete={deleteBook}
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
                  {isAdmin ? "Create your first book entry by clicking the 'New Book' button above." : "No books match your search criteria. Please check back soon!"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Book modal */}
      <BookModal open={Boolean(selected)} onOpenChange={(v) => !v && setSelected(null)} book={selected} />

      {/* Admin editor dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Book" : "Create Book"}</DialogTitle>
          </DialogHeader>
          <AdminEditor initial={editing || null} onSave={saveBook} onCancel={() => setShowEditor(false)} />
        </DialogContent>
      </Dialog>

      {/* Admin auth dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-2 pb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Admin Access</DialogTitle>
            <p className="text-sm text-muted-foreground font-normal">Enter your admin key to manage the book collection and access dashboard tools.</p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey" className="text-sm font-medium">Admin Key</Label>
              <Input
                id="adminKey"
                type="password"
                placeholder="Enter your admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                className="h-10"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Demo key:</span> <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">bulkbuk_admin_demo_key</code>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1 h-10" 
                onClick={handleLogin}
              >
                <LogIn className="w-4 h-4 mr-2"/>
                Sign In
              </Button>
              <Button 
                className="flex-1 h-10" 
                variant="outline" 
                onClick={() => setShowAuth(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
