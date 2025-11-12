import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  Upload,
  Pencil,
  Trash2,
  LogOut,
  Plus,
  Save,
  X,
  Sun,
  Moon,
  Shield,
  LogIn,
} from "lucide-react";

const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
)}`;
const ADMIN_KEY = "bulkbuk_admin_demo_key";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
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

export function AdminPanel({ books, setBooks, onLogout, onReturn, theme, setTheme }) {
  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const handleLogin = () => {
    const ok = adminKey.trim() === ADMIN_KEY;
    if (!ok) alert("Invalid admin key (demo: bulkbuk_admin_demo_key)");
    else setShowAuth(false);
    setAdminKey("");
  };

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Shield className="w-6 h-6" />
          <h1 className="text-xl font-semibold tracking-tight">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-3">
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-2"/>New Book</Button>
            <Button variant="ghost" size="sm" onClick={onReturn}>Back to Gallery</Button>
            <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="w-4 h-4 mr-2"/>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h2 className="text-2xl font-semibold">Manage Books</h2>
        
        {/* Books table */}
        <div className="grid gap-4">
          {books.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-10 border rounded-2xl">
              No books yet. Click "New Book" to add your first entry.
            </div>
          ) : (
            books.map((book) => (
              <Card key={book.id} className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{book.published ? "Published" : "Draft"}</Badge>
                      <Button size="sm" variant="outline" onClick={() => openEdit(book)}><Pencil className="w-4 h-4 mr-2"/>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => deleteBook(book.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2"/>Delete</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{book.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {book.categories?.map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    {book.tags?.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Admin editor dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Book" : "Create Book"}</DialogTitle>
          </DialogHeader>
          <AdminEditor initial={editing || null} onSave={saveBook} onCancel={() => setShowEditor(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
