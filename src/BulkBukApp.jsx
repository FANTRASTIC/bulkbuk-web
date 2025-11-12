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

            {isAdmin ? (
              <>
                <Button variant="outline" size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-2"/>New Book</Button>
                <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4 mr-2"/>Exit Admin</Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowAuth(true)}><Shield className="w-4 h-4 mr-2"/>Admin</Button>
            )}
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
                isAdmin={isAdmin}
                onEdit={openEdit}
                onDelete={deleteBook}
              />
            </motion.div>
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-sm text-muted-foreground p-10 border rounded-2xl">
              No books yet. {isAdmin ? "Use New Book to add your first entry." : "Please check back soon!"}
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
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleLogin}><LogIn className="w-4 h-4 mr-2"/>Sign in</Button>
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
