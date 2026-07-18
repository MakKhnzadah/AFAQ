import React, { useState, useRef } from 'react';
import {
  Trash2, Edit3, Upload, Save, X, Lock, LogOut,
  Image as ImageIcon, Eye, EyeOff, Plus, BookOpen,
  Clock, Bell, Calendar, ChevronDown, ChevronUp,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { PRESET_IMAGES, useGalleryStore, GalleryItem } from '@/app/pages/GalleryPage';
import { useSchoolStore, SchoolHour, SchoolActivity, SchoolAnnouncement } from '@/app/pages/ArabicSchoolPage';
import { useEventsStore, Event, Announcement, EventCategory } from '@/app/pages/EventsPage';

type Tab = 'gallery' | 'school' | 'events';

// ─── Main Admin ───────────────────────────────────────────────────────────────

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('gallery');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="font-bold text-lg">لوحة التحكم / Admin Panel</h1>
          <p className="text-emerald-200 text-xs mt-0.5">Afaq Islamic Center</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {([
            { id: 'gallery', icon: ImageIcon, label: 'Galleri / معرض' },
            { id: 'school', icon: BookOpen, label: 'Arabisk skole / المدرسة' },
            { id: 'events', icon: Calendar, label: 'Arrangementer / فعاليات' },
          ] as { id: Tab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-600 hover:text-emerald-600'
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'gallery' && <GalleryTab />}
        {tab === 'school' && <SchoolTab />}
        {tab === 'events' && <EventsTab />}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY TAB
// ═══════════════════════════════════════════════════════════════════════════════

interface EditGalleryModalProps { item: GalleryItem; onSave: (ar: string, no: string) => void; onClose: () => void; }

function EditGalleryModal({ item, onSave, onClose }: EditGalleryModalProps) {
  const [ar, setAr] = useState(item.captionAr);
  const [no, setNo] = useState(item.captionNo);
  return (
    <Overlay onClose={onClose}>
      <ModalCard title="تعديل / Rediger" onClose={onClose}>
        <div className="rounded-lg overflow-hidden h-36 bg-gray-100 mb-4">
          <ImageWithFallback src={item.src} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-3">
          <div><Label>التسمية بالعربية</Label><Input value={ar} onChange={e => setAr(e.target.value)} /></div>
          <div><Label>Norsk tekst</Label><Input value={no} onChange={e => setNo(e.target.value)} /></div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { onSave(ar, no); onClose(); }}>
            <Save className="h-4 w-4 mr-1" />حفظ
          </Button>
        </div>
      </ModalCard>
    </Overlay>
  );
}

function GalleryTab() {
  const { allItems, hidden, setHidden, uploaded, setUploaded, captions, setCaptions } = useGalleryStore();
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [upAr, setUpAr] = useState(''); const [upNo, setUpNo] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDelete = (item: GalleryItem) => {
    if (PRESET_IMAGES.some(p => p.id === item.id)) setHidden([...hidden, item.id]);
    else setUploaded(uploaded.filter(u => u.id !== item.id));
  };
  const handleRestore = (id: string) => setHidden(hidden.filter(h => h !== id));
  const handleSaveCaption = (item: GalleryItem, ar: string, no: string) => {
    if (PRESET_IMAGES.some(p => p.id === item.id)) setCaptions({ ...captions, [item.id]: { ar, no } });
    else setUploaded(uploaded.map(u => u.id === item.id ? { ...u, captionAr: ar, captionNo: no } : u));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setUploadPreview(ev.target?.result as string); setUploading(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const handleUploadSave = () => {
    if (!uploadPreview) return;
    setUploaded([...uploaded, { id: `upload_${Date.now()}`, src: uploadPreview, captionAr: upAr, captionNo: upNo }]);
    setUploading(false); setUploadPreview(null); setUpAr(''); setUpNo('');
  };
  const hiddenPresets = PRESET_IMAGES.filter(p => hidden.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Upload */}
      <Card>
        <CardHeader><CardTitle className="text-emerald-700 flex items-center gap-2"><Upload className="h-5 w-5" />رفع صورة / Last opp</CardTitle></CardHeader>
        <CardContent>
          {!uploading ? (
            <div className="border-2 border-dashed border-emerald-300 rounded-xl p-10 text-center cursor-pointer hover:bg-emerald-50" onClick={() => fileRef.current?.click()}>
              <Upload className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-gray-600">Klikk for å velge / انقر للاختيار</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {uploadPreview && <img src={uploadPreview} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 space-y-2">
                  <div><Label>التسمية بالعربية</Label><Input value={upAr} onChange={e => setUpAr(e.target.value)} placeholder="وصف الصورة" /></div>
                  <div><Label>Norsk beskrivelse</Label><Input value={upNo} onChange={e => setUpNo(e.target.value)} placeholder="Bildebeskrivelse" /></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleUploadSave}><Save className="h-4 w-4 mr-1" />Lagre</Button>
                <Button variant="outline" onClick={() => { setUploading(false); setUploadPreview(null); }}>Avbryt</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid */}
      <Card>
        <CardHeader><CardTitle className="text-emerald-700">المعرض ({allItems.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {allItems.map(item => (
              <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <ImageWithFallback src={item.src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-white" onClick={() => setEditItem(item)}><Edit3 className="h-3.5 w-3.5" /></button>
                  <button className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-white" onClick={() => handleDelete(item)}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden */}
      {hiddenPresets.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader><CardTitle className="text-amber-700 flex items-center gap-2"><EyeOff className="h-5 w-5" />مخفية ({hiddenPresets.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {hiddenPresets.map(item => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 opacity-60">
                  <ImageWithFallback src={item.src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="p-1.5 bg-white/90 rounded-full text-emerald-600" onClick={() => handleRestore(item.id)}><Eye className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {editItem && <EditGalleryModal item={editItem} onSave={(ar, no) => handleSaveCaption(editItem, ar, no)} onClose={() => setEditItem(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHOOL TAB
// ═══════════════════════════════════════════════════════════════════════════════

type SchoolSubTab = 'hours' | 'activities' | 'announcements';

function SchoolTab() {
  const [sub, setSub] = useState<SchoolSubTab>('hours');
  const store = useSchoolStore();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {([
          { id: 'hours', icon: Clock, label: 'Skoletid' },
          { id: 'activities', icon: ImageIcon, label: 'Aktiviteter' },
          { id: 'announcements', icon: Bell, label: 'Annonser' },
        ] as { id: SchoolSubTab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setSub(id)}
            className={`flex items-center gap-1 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${sub === id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-600 hover:text-emerald-600'}`}
          >
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>
      {sub === 'hours' && <HoursAdmin {...store} />}
      {sub === 'activities' && <ActivitiesAdmin {...store} />}
      {sub === 'announcements' && <AnnouncementsAdmin {...store} />}
    </div>
  );
}

// ── Hours Admin ───────────────────────────────────────────────────────────────

function HoursAdmin({ hours, setHours }: ReturnType<typeof useSchoolStore>) {
  const [editing, setEditing] = useState<SchoolHour | null>(null);
  const [adding, setAdding] = useState(false);
  const empty: SchoolHour = { id: '', dayNo: '', dayAr: '', startTime: '', endTime: '', breakTime: '', notes: '' };
  const [form, setForm] = useState<SchoolHour>(empty);

  const save = () => {
    if (!form.dayNo || !form.startTime || !form.endTime) return;
    if (adding) setHours([...hours, { ...form, id: `h_${Date.now()}` }]);
    else setHours(hours.map(h => h.id === form.id ? form : h));
    setEditing(null); setAdding(false); setForm(empty);
  };
  const del = (id: string) => setHours(hours.filter(h => h.id !== id));

  const startEdit = (h: SchoolHour) => { setForm(h); setEditing(h); setAdding(false); };
  const startAdd = () => { setForm(empty); setAdding(true); setEditing(null); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Skoletider / أوقات الدراسة</h3>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={startAdd}><Plus className="h-4 w-4 mr-1" />Legg til</Button>
      </div>

      {(adding || editing) && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Dag (norsk)</Label><Input value={form.dayNo} onChange={e => setForm(f => ({ ...f, dayNo: e.target.value }))} placeholder="Fredag" /></div>
              <div><Label>اليوم (عربي)</Label><Input value={form.dayAr} onChange={e => setForm(f => ({ ...f, dayAr: e.target.value }))} placeholder="الجمعة" /></div>
              <div><Label>Start</Label><Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
              <div><Label>Slutt</Label><Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
              <div><Label>Pause</Label><Input value={form.breakTime} onChange={e => setForm(f => ({ ...f, breakTime: e.target.value }))} placeholder="16:30 – 16:45" /></div>
              <div><Label>Notater</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={save}><Save className="h-4 w-4 mr-1" />Lagre</Button>
              <Button size="sm" variant="outline" onClick={() => { setEditing(null); setAdding(false); }}>Avbryt</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {hours.map(h => (
          <Card key={h.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{h.dayNo} / {h.dayAr}</p>
                <p className="text-sm text-gray-600">{h.startTime} – {h.endTime}{h.breakTime ? ` · Pause: ${h.breakTime}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => startEdit(h)}><Edit3 className="h-4 w-4" /></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => del(h.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {hours.length === 0 && <p className="text-gray-400 text-center py-8">Ingen tider lagt til</p>}
      </div>
    </div>
  );
}

// ── Activities Admin ──────────────────────────────────────────────────────────

function ActivitiesAdmin({ activities, setActivities }: ReturnType<typeof useSchoolStore>) {
  const emptyAct: SchoolActivity = { id: '', titleNo: '', titleAr: '', descriptionNo: '', descriptionAr: '', date: '', time: '', image: '', contact: '' };
  const [form, setForm] = useState<SchoolActivity>(emptyAct);
  const [mode, setMode] = useState<'none' | 'add' | 'edit'>('none');
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    if (!form.titleNo) return;
    if (mode === 'add') setActivities([...activities, { ...form, id: `act_${Date.now()}` }]);
    else setActivities(activities.map(a => a.id === form.id ? form : a));
    setMode('none'); setForm(emptyAct);
  };
  const del = (id: string) => setActivities(activities.filter(a => a.id !== id));
  const startEdit = (act: SchoolActivity) => { setForm(act); setMode('edit'); };
  const startAdd = () => { setForm(emptyAct); setMode('add'); };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Aktiviteter</h3>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={startAdd}><Plus className="h-4 w-4 mr-1" />Legg til</Button>
      </div>

      {mode !== 'none' && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tittel (norsk)</Label><Input value={form.titleNo} onChange={e => setForm(f => ({ ...f, titleNo: e.target.value }))} /></div>
              <div><Label>العنوان (عربي)</Label><Input value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} /></div>
            </div>
            <div><Label>Beskrivelse (norsk)</Label><Textarea rows={2} value={form.descriptionNo} onChange={e => setForm(f => ({ ...f, descriptionNo: e.target.value }))} className="resize-none" /></div>
            <div><Label>الوصف (عربي)</Label><Textarea rows={2} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} className="resize-none" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Dato</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><Label>Tid</Label><Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              <div><Label>Kontakt</Label><Input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
            </div>
            {/* Image */}
            <div>
              <Label>Bilde</Label>
              <div className="flex gap-3 items-center mt-1">
                {form.image && <img src={form.image} alt="" className="w-16 h-16 rounded object-cover" />}
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" />{form.image ? 'Endre bilde' : 'Last opp'}
                </Button>
                {form.image && <button className="text-red-500 text-xs hover:underline" onClick={() => setForm(f => ({ ...f, image: '' }))}>Fjern</button>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={save}><Save className="h-4 w-4 mr-1" />Lagre</Button>
              <Button size="sm" variant="outline" onClick={() => { setMode('none'); setForm(emptyAct); }}>Avbryt</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {activities.map(act => (
          <Card key={act.id}>
            <CardContent className="p-4 flex items-center gap-4">
              {act.image && <img src={act.image} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{act.titleNo}</p>
                <p className="text-sm text-gray-500">{act.date} {act.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => startEdit(act)}><Edit3 className="h-4 w-4" /></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => del(act.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {activities.length === 0 && <p className="text-gray-400 text-center py-8">Ingen aktiviteter</p>}
      </div>
    </div>
  );
}

// ── Announcements Admin (School) ──────────────────────────────────────────────

function AnnouncementsAdmin({ announcements, setAnnouncements }: ReturnType<typeof useSchoolStore>) {
  const emptyAnn: SchoolAnnouncement = { id: '', titleNo: '', titleAr: '', contentNo: '', contentAr: '', date: new Date().toISOString().split('T')[0], expiryDate: '', isHighlighted: false };
  const [form, setForm] = useState<SchoolAnnouncement>(emptyAnn);
  const [mode, setMode] = useState<'none' | 'add' | 'edit'>('none');

  const save = () => {
    if (!form.titleNo) return;
    if (mode === 'add') setAnnouncements([...announcements, { ...form, id: `ann_${Date.now()}` }]);
    else setAnnouncements(announcements.map(a => a.id === form.id ? form : a));
    setMode('none'); setForm(emptyAnn);
  };
  const del = (id: string) => setAnnouncements(announcements.filter(a => a.id !== id));
  const startEdit = (a: SchoolAnnouncement) => { setForm(a); setMode('edit'); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Annonser</h3>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setForm(emptyAnn); setMode('add'); }}><Plus className="h-4 w-4 mr-1" />Legg til</Button>
      </div>
      {mode !== 'none' && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tittel (norsk)</Label><Input value={form.titleNo} onChange={e => setForm(f => ({ ...f, titleNo: e.target.value }))} /></div>
              <div><Label>العنوان (عربي)</Label><Input value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} /></div>
            </div>
            <div><Label>Innhold (norsk)</Label><Textarea rows={2} value={form.contentNo} onChange={e => setForm(f => ({ ...f, contentNo: e.target.value }))} className="resize-none" /></div>
            <div><Label>المحتوى (عربي)</Label><Textarea rows={2} value={form.contentAr} onChange={e => setForm(f => ({ ...f, contentAr: e.target.value }))} className="resize-none" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Publiseringsdato</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><Label>Utløpsdato</Label><Input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.isHighlighted} onChange={e => setForm(f => ({ ...f, isHighlighted: e.target.checked }))} className="h-4 w-4 rounded" />
              Fremhev som viktig / تمييز كمهم
            </label>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={save}><Save className="h-4 w-4 mr-1" />Lagre</Button>
              <Button size="sm" variant="outline" onClick={() => { setMode('none'); setForm(emptyAnn); }}>Avbryt</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {announcements.map(ann => (
          <Card key={ann.id} className={ann.isHighlighted ? 'border-emerald-300 bg-emerald-50/30' : ''}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{ann.titleNo}</p>
                  {ann.isHighlighted && <Badge className="bg-emerald-100 text-emerald-700 text-xs">Viktig</Badge>}
                </div>
                <p className="text-sm text-gray-500">{ann.date}{ann.expiryDate ? ` → ${ann.expiryDate}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => startEdit(ann)}><Edit3 className="h-4 w-4" /></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => del(ann.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-gray-400 text-center py-8">Ingen annonser</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS TAB
// ═══════════════════════════════════════════════════════════════════════════════

type EventsSubTab = 'events' | 'announcements';

function EventsTab() {
  const [sub, setSub] = useState<EventsSubTab>('events');
  const store = useEventsStore();
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {([
          { id: 'events', label: 'Arrangementer' },
          { id: 'announcements', label: 'Kunngjøringer' },
        ] as { id: EventsSubTab; label: string }[]).map(({ id, label }) => (
          <button key={id} onClick={() => setSub(id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${sub === id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-600 hover:text-emerald-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {sub === 'events' && <EventsAdmin {...store} />}
      {sub === 'announcements' && <EventAnnouncementsAdmin {...store} />}
    </div>
  );
}

function EventsAdmin({ events, setEvents }: ReturnType<typeof useEventsStore>) {
  const emptyEv: Event = {
    id: '', titleNo: '', titleAr: '', descriptionNo: '', descriptionAr: '',
    date: '', time: '', location: '', category: 'religious', image: '', isUpcoming: true,
  };
  const [form, setForm] = useState<Event>(emptyEv);
  const [mode, setMode] = useState<'none' | 'add' | 'edit'>('none');
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    if (!form.titleNo || !form.date) return;
    if (mode === 'add') setEvents([...events, { ...form, id: `ev_${Date.now()}` }]);
    else setEvents(events.map(e => e.id === form.id ? form : e));
    setMode('none'); setForm(emptyEv);
  };
  const del = (id: string) => setEvents(events.filter(e => e.id !== id));
  const startEdit = (e: Event) => { setForm(e); setMode('edit'); };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const CATEGORIES: { val: EventCategory; label: string }[] = [
    { val: 'religious', label: 'Religiøs / ديني' },
    { val: 'cultural', label: 'Kulturell / ثقافي' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Arrangementer ({events.length})</h3>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setForm(emptyEv); setMode('add'); }}><Plus className="h-4 w-4 mr-1" />Legg til</Button>
      </div>
      {mode !== 'none' && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tittel (norsk)</Label><Input value={form.titleNo} onChange={e => setForm(f => ({ ...f, titleNo: e.target.value }))} /></div>
              <div><Label>العنوان (عربي)</Label><Input value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} /></div>
            </div>
            <div><Label>Beskrivelse (norsk)</Label><Textarea rows={2} value={form.descriptionNo} onChange={e => setForm(f => ({ ...f, descriptionNo: e.target.value }))} className="resize-none" /></div>
            <div><Label>الوصف (عربي)</Label><Textarea rows={2} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} className="resize-none" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Dato</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><Label>Tid</Label><Input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="18:00 – 19:00" /></div>
              <div><Label>Sted</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Kategori</Label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as EventCategory }))}
                  className="w-full h-10 px-3 rounded-md border border-input text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1">
                  {CATEGORIES.map(c => <option key={c.val} value={c.val}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isUpcoming} onChange={e => setForm(f => ({ ...f, isUpcoming: e.target.checked }))} className="h-4 w-4 rounded" />
                  Kommende arrangement
                </label>
              </div>
            </div>
            <div>
              <Label>Bilde</Label>
              <div className="flex gap-3 items-center mt-1">
                {form.image && <img src={form.image} alt="" className="w-16 h-16 rounded object-cover" />}
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" />{form.image ? 'Endre' : 'Last opp'}
                </Button>
                {form.image && <button className="text-red-500 text-xs" onClick={() => setForm(f => ({ ...f, image: '' }))}>Fjern</button>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={save}><Save className="h-4 w-4 mr-1" />Lagre</Button>
              <Button size="sm" variant="outline" onClick={() => { setMode('none'); setForm(emptyEv); }}>Avbryt</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {events.map(ev => (
          <Card key={ev.id}>
            <CardContent className="p-4 flex items-center gap-3">
              {ev.image && <img src={ev.image} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold truncate">{ev.titleNo}</p>
                  <Badge className={ev.category === 'religious' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}>
                    {ev.category === 'religious' ? 'Religiøs' : 'Kulturell'}
                  </Badge>
                  {!ev.isUpcoming && <Badge className="bg-gray-100 text-gray-600">Gjennomført</Badge>}
                </div>
                <p className="text-sm text-gray-500">{ev.date} · {ev.time} · {ev.location}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => startEdit(ev)}><Edit3 className="h-4 w-4" /></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => del(ev.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && <p className="text-gray-400 text-center py-8">Ingen arrangementer</p>}
      </div>
    </div>
  );
}

function EventAnnouncementsAdmin({ announcements, setAnnouncements }: ReturnType<typeof useEventsStore>) {
  const emptyAnn: Announcement = { id: '', titleNo: '', titleAr: '', contentNo: '', contentAr: '', date: '' };
  const [form, setForm] = useState<Announcement>(emptyAnn);
  const [mode, setMode] = useState<'none' | 'add' | 'edit'>('none');

  const save = () => {
    if (!form.titleNo) return;
    if (mode === 'add') setAnnouncements([...announcements, { ...form, id: `ann_${Date.now()}` }]);
    else setAnnouncements(announcements.map(a => a.id === form.id ? form : a));
    setMode('none'); setForm(emptyAnn);
  };
  const del = (id: string) => setAnnouncements(announcements.filter(a => a.id !== id));
  const startEdit = (a: Announcement) => { setForm(a); setMode('edit'); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Kunngjøringer ({announcements.length})</h3>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setForm(emptyAnn); setMode('add'); }}><Plus className="h-4 w-4 mr-1" />Legg til</Button>
      </div>
      {mode !== 'none' && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tittel (norsk)</Label><Input value={form.titleNo} onChange={e => setForm(f => ({ ...f, titleNo: e.target.value }))} /></div>
              <div><Label>العنوان (عربي)</Label><Input value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} /></div>
            </div>
            <div><Label>Innhold (norsk)</Label><Textarea rows={2} value={form.contentNo} onChange={e => setForm(f => ({ ...f, contentNo: e.target.value }))} className="resize-none" /></div>
            <div><Label>المحتوى (عربي)</Label><Textarea rows={2} value={form.contentAr} onChange={e => setForm(f => ({ ...f, contentAr: e.target.value }))} className="resize-none" /></div>
            <div><Label>Dato</Label><Input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="25. januar 2026" /></div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={save}><Save className="h-4 w-4 mr-1" />Lagre</Button>
              <Button size="sm" variant="outline" onClick={() => { setMode('none'); setForm(emptyAnn); }}>Avbryt</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {announcements.map(ann => (
          <Card key={ann.id}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold">{ann.titleNo}</p>
                <p className="text-sm text-gray-500">{ann.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => startEdit(ann)}><Edit3 className="h-4 w-4" /></button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => del(ann.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-gray-400 text-center py-8">Ingen kunngjøringer</p>}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      {children}
    </div>
  );
}

function ModalCard({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
