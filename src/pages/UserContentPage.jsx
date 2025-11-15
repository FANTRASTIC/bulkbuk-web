import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Pencil, Trash2, Plus, Save, X, Search } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';
import { searchBooks, imageUrlToDataUrl } from '@/services/googleBooksService';

function uid(prefix = 'id') {
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
  const [text, setText] = useState('');
  const addChip = () => {
    const t = text.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setText('');
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
            if (e.key === 'Enter') {
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

  const PLACEHOLDER_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="100%" height="100%" fill="#f2f2f2"/><g fill="#b0b0b0" font-family="sans-serif" font-size="14" text-anchor="middle"><text x="100" y="120">No Cover</text><text x="100" y="145">Available</text></g></svg>'
  )}`;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className="flex items-center justify-between gap-4 rounded-2xl border p-4"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5" />
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
            {accept?.includes('image') ? (
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

function BookEditor({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [categories, setCategories] = useState(initial?.categories || []);
  const [tags, setTags] = useState(initial?.tags || []);
  const [notes, setNotes] = useState(initial?.notes || []);
  const [published, setPublished] = useState(Boolean(initial?.published));
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl || null);
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl || null);

  // Google Books search
  const [gbQuery, setGbQuery] = useState('');
  const [gbLoading, setGbLoading] = useState(false);
  const [gbResults, setGbResults] = useState([]);
  const [gbError, setGbError] = useState(null);
  const debounceRef = useRef(null);

  const noteTitleRef = useRef(null);
  const noteContentRef = useRef(null);

  const addNote = () => {
    const t = noteTitleRef.current?.value.trim();
    const c = noteContentRef.current?.value.trim();
    if (!t || !c) return;
    setNotes((prev) => [...prev, { id: uid('note'), title: t, content: c }]);
    noteTitleRef.current.value = '';
    noteContentRef.current.value = '';
  };

  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const handleGbQueryChange = (value) => {
    setGbQuery(value);
    setGbError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setGbResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setGbLoading(true);
      try {
        const results = await searchBooks(value.trim(), 6);
        setGbResults(results || []);
        if (!results || results.length === 0) setGbError('No results found');
      } catch (err) {
        setGbError(err?.message || String(err));
        setGbResults([]);
      } finally {
        setGbLoading(false);
      }
    }, 500);
  };

  const handleUseGb = (g) => {
    if (!g) return;
    setTitle(g.title || title);
    setAuthor((g.authors && g.authors.join(', ')) || author);
    setSummary(g.description || summary);
    setCategories(g.categories || categories);
    if (g.image) {
      imageUrlToDataUrl(g.image).then((data) => {
        setCoverUrl(data || g.image);
      }).catch(() => setCoverUrl(g.image));
    }
    const isbn = (g.industryIdentifiers && g.industryIdentifiers.find(i => i.type && i.identifier))?.identifier;
    if (isbn) setTags((t) => Array.from(new Set([...(t||[]), isbn])));
    setGbResults([]);
    setGbQuery('');
  };

  const handleSave = () => {
    const payload = {
      ...(initial || {}),
      id: initial?.id || uid('book'),
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
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Book Title" />
        </Field>
        <Field id="author" label="Author">
          <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., Your Name" />
        </Field>
        <Field id="summary" label="Summary" hint="A concise description of your book.">
          <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={8} placeholder="Write a polished overview..." />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Categories">
            <ChipInput value={categories} onChange={setCategories} placeholder="Add a category" />
          </Field>
          <Field label="Tags">
            <ChipInput value={tags} onChange={setTags} placeholder="Add a tag" />
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
            <p className="text-sm text-muted-foreground">No notes yet.</p>
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search Google Books</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Type book title..." 
              value={gbQuery} 
              onChange={(e) => handleGbQueryChange(e.target.value)}
            />
          </div>
          {gbError ? <p className="text-xs text-destructive mt-1">{gbError}</p> : null}
          {gbResults.length ? (
            <div className="grid grid-cols-1 gap-2 mt-2">
              {gbResults.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border p-2">
                  <img src={r.image || ''} alt={r.title} className="w-12 h-16 object-cover rounded" onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,<svg></svg>')} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2">{r.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{(r.authors || []).join(', ')}</div>
                  </div>
                  <Button size="sm" onClick={() => handleUseGb(r)}>Use</Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <FileDrop label="Cover Image" accept="image/*" onFile={({ dataUrl }) => setCoverUrl(dataUrl)} previewUrl={coverUrl} />
        <FileDrop label="Audio Overview" accept="audio/*" onFile={({ url }) => setAudioUrl(url)} previewUrl={audioUrl} />
        <div className="flex items-center justify-between rounded-2xl border p-4">
          <div>
            <div className="text-sm font-medium">Published</div>
            <div className="text-xs text-muted-foreground">Show to public</div>
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

export function UserContentPage() {
  const auth = useAuth();
  const { getUserBooks, addBook, updateBook, deleteBook, PLACEHOLDER_COVER } = useBooks();
  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [query, setQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const userBooks = getUserBooks(auth.user.id);
  const filtered = userBooks.filter((b) => {
    const q = query.toLowerCase().trim();
    return !q || [b.title, b.author, b.summary].join(' ').toLowerCase().includes(q);
  });

  const handleSave = (payload) => {
    if (editing) {
      updateBook(editing.id, payload);
    } else {
      addBook(payload, auth.user.id);
    }
    setShowEditor(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteBook(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Content</h1>
          <p className="text-muted-foreground mt-1">Create and manage your books ({userBooks.length})</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowEditor(true); }} size="lg">
          <Plus className="w-5 h-5 mr-2"/>
          New Book
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border px-3 h-10 bg-muted/30">
        <Search className="w-4 h-4 text-muted-foreground"/>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-transparent outline-none text-sm"
          placeholder="Search your books…"
        />
      </div>

      {/* Books Grid */}
      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <Card key={book.id} className="rounded-2xl overflow-hidden flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <img src={book.coverUrl || PLACEHOLDER_COVER} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-3" onError={(e) => (e.currentTarget.src = PLACEHOLDER_COVER)} />
                <p className="text-sm text-muted-foreground line-clamp-3">{book.summary}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-4 border-t">
                <div className="w-full flex gap-2">
                  <Badge variant={book.published ? 'default' : 'secondary'}>
                    {book.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="w-full flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(book); setShowEditor(true); }} className="flex-1">
                    <Pencil className="w-4 h-4 mr-2"/>Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(book)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2"/>Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground">No books yet. Create your first book!</p>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Book' : 'Create New Book'}</DialogTitle>
          </DialogHeader>
          <BookEditor initial={editing} onSave={handleSave} onCancel={() => setShowEditor(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteConfirm)} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Book?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm.id)} className="flex-1">
                Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
