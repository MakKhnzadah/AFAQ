import React, { useState, useRef } from 'react';
import {
  BookOpen, Clock, Image as ImageIcon, Bell, CheckCircle,
  AlertCircle, Loader2, Phone, Mail, Calendar, ChevronDown
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { useLanguage } from '@/app/contexts/LanguageContext';

// ─── Data types ─────────────────────────────────────────────────────────────

export interface SchoolHour {
  id: string;
  dayNo: string;
  dayAr: string;
  startTime: string;
  endTime: string;
  breakTime?: string;
  notes?: string;
}

export interface SchoolActivity {
  id: string;
  titleNo: string;
  titleAr: string;
  descriptionNo: string;
  descriptionAr: string;
  date?: string;
  time?: string;
  image?: string;
  contact?: string;
}

export interface SchoolAnnouncement {
  id: string;
  titleNo: string;
  titleAr: string;
  contentNo: string;
  contentAr: string;
  date: string;
  expiryDate?: string;
  isHighlighted: boolean;
}

// ─── Default data ────────────────────────────────────────────────────────────

const DEFAULT_HOURS: SchoolHour[] = [
  { id: 'h2', dayNo: 'Søndag', dayAr: 'الأحد', startTime: '12:00', endTime: '15:00', breakTime: '13:30 – 13:45' },
];

const DEFAULT_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'a1',
    titleNo: 'Velkommen til ny termin!',
    titleAr: 'مرحباً بكم في الفصل الدراسي الجديد!',
    contentNo: 'Vi ønsker alle elever og foresatte hjertelig velkommen til ny termin ved Afaq Arabisk skole. Ta kontakt om du har spørsmål.',
    contentAr: 'نرحب بجميع الطلاب وأولياء الأمور في الفصل الدراسي الجديد في المدرسة العربية آفاق. لا تترددوا في التواصل معنا.',
    date: new Date().toISOString().split('T')[0],
    isHighlighted: true,
  },
];

// ─── Storage hooks ────────────────────────────────────────────────────────────

function load<T>(key: string, def: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; } catch { return def; }
}
function save<T>(key: string, val: T) { localStorage.setItem(key, JSON.stringify(val)); }

export function useSchoolStore() {
  const [hours, setHoursState] = useState<SchoolHour[]>(() => load('school_hours', DEFAULT_HOURS));
  const [activities, setActivitiesState] = useState<SchoolActivity[]>(() => load('school_activities', []));
  const [announcements, setAnnouncementsState] = useState<SchoolAnnouncement[]>(() => load('school_announcements', DEFAULT_ANNOUNCEMENTS));

  const setHours = (v: SchoolHour[]) => { save('school_hours', v); setHoursState(v); };
  const setActivities = (v: SchoolActivity[]) => { save('school_activities', v); setActivitiesState(v); };
  const setAnnouncements = (v: SchoolAnnouncement[]) => { save('school_announcements', v); setAnnouncementsState(v); };

  return { hours, setHours, activities, setActivities, announcements, setAnnouncements };
}

// ─── Classrooms ───────────────────────────────────────────────────────────────

const CLASSROOMS = [
  'Klasserom 1 / الفصل 1',
  'Klasserom 2 / الفصل 2',
  'Klasserom 3 / الفصل 3',
  'Klasserom 4 / الفصل 4',
  'Klasserom 5 / الفصل 5',
  'Klasserom 6 / الفصل 6',
  'Klasserom 7 / الفصل 7',
  'Klasserom 8 / الفصل 8',
];

// ─── Section nav ─────────────────────────────────────────────────────────────

type Section = 'registration' | 'hours' | 'activities' | 'announcements';

const SECTIONS: { id: Section; icon: React.ElementType }[] = [
  { id: 'registration', icon: BookOpen },
  { id: 'hours', icon: Clock },
  { id: 'activities', icon: ImageIcon },
  { id: 'announcements', icon: Bell },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export const ArabicSchoolPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [activeSection, setActiveSection] = useState<Section>('registration');
  const { hours, activities, announcements } = useSchoolStore();

  const today = new Date().toISOString().split('T')[0];
  const visibleAnnouncements = announcements.filter(a => !a.expiryDate || a.expiryDate >= today);

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page Hero */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <BookOpen className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t('arabicSchoolTitle')}</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">{t('arabicSchoolIntro')}</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
          {SECTIONS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-600 hover:text-emerald-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t(id)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {activeSection === 'registration' && <RegistrationSection />}
        {activeSection === 'hours' && <HoursSection hours={hours} />}
        {activeSection === 'activities' && <ActivitiesSection activities={activities} />}
        {activeSection === 'announcements' && <AnnouncementsSection announcements={visibleAnnouncements} />}
      </div>
    </div>
  );
};

// ─── Registration ─────────────────────────────────────────────────────────────

function RegistrationSection() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    childName: '', childAge: '', childDob: '', parentName: '',
    phone: '', email: '', address: '', classroom: '', comments: '', consent: false,
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.childName.trim()) e.childName = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.childAge.trim()) e.childAge = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.childDob) e.childDob = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.parentName.trim()) e.parentName = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.phone.trim()) e.phone = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.email.trim()) e.email = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.address.trim()) e.address = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.classroom) e.classroom = isRtl ? 'مطلوب' : 'Påkrevd';
    if (!form.consent) e.consent = isRtl ? 'يجب الموافقة' : 'Påkrevd';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const body = [
      `${t('childFullName')}: ${form.childName}`,
      `${t('childAge')}: ${form.childAge}`,
      `${t('childDob')}: ${form.childDob}`,
      `${t('parentName')}: ${form.parentName}`,
      `${t('phone')}: ${form.phone}`,
      `${t('emailAddress')}: ${form.email}`,
      `${t('addressField')}: ${form.address}`,
      `${t('desiredClassroom')}: ${form.classroom}`,
      `${t('comments')}: ${form.comments}`,
    ].join('\n');
    setTimeout(() => {
      window.location.href = `mailto:qosaya@gmail.com?subject=${encodeURIComponent('Registrering – Arabisk skole / تسجيل في المدرسة العربية')}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(err => { const copy = { ...err }; delete copy[k]; return copy; });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-5 bg-emerald-100 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('registrationSuccess')}</h2>
        <p className="text-gray-600 max-w-md">
          {language === 'ar'
            ? 'سنتواصل معكم قريباً على البريد الإلكتروني أو الهاتف المقدم.'
            : 'Vi vil kontakte deg snart på e-post eller telefon som oppgitt.'}
        </p>
        <Button className="mt-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => setSubmitted(false)}>
          {language === 'ar' ? 'تسجيل آخر' : 'Ny registrering'}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('registration')}</h2>
        <p className="text-gray-600">
          {language === 'ar'
            ? 'يرجى ملء جميع الحقول المطلوبة بعناية'
            : 'Fyll ut alle obligatoriske felt nøye'}
        </p>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child info */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide text-emerald-700">
                {language === 'ar' ? 'بيانات الطفل' : 'Barnets informasjon'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t('childFullName')} error={errors.childName} required>
                  <Input value={form.childName} onChange={e => set('childName', e.target.value)} placeholder={language === 'ar' ? 'الاسم الكامل' : 'Fullt navn'} className={errors.childName ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('childAge')} error={errors.childAge} required>
                  <Input type="number" min={4} max={18} value={form.childAge} onChange={e => set('childAge', e.target.value)} placeholder="6" className={errors.childAge ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('childDob')} error={errors.childDob} required>
                  <Input type="date" value={form.childDob} onChange={e => set('childDob', e.target.value)} className={errors.childDob ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('desiredClassroom')} error={errors.classroom} required>
                  <select
                    value={form.classroom}
                    onChange={e => set('classroom', e.target.value)}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.classroom ? 'border-red-400' : 'border-input'}`}
                  >
                    <option value="">{t('selectClassroom')}</option>
                    {CLASSROOMS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Parent info */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide text-emerald-700">
                {language === 'ar' ? 'بيانات الوالدين / المسؤول' : 'Foresattes informasjon'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t('parentName')} error={errors.parentName} required>
                  <Input value={form.parentName} onChange={e => set('parentName', e.target.value)} placeholder={language === 'ar' ? 'الاسم الكامل' : 'Fullt navn'} className={errors.parentName ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('phone')} error={errors.phone} required>
                  <Input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+47 000 00 000" className={errors.phone ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('emailAddress')} error={errors.email} required>
                  <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="navn@epost.no" className={errors.email ? 'border-red-400' : ''} />
                </Field>
                <Field label={t('addressField')} error={errors.address} required>
                  <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder={language === 'ar' ? 'العنوان الكامل' : 'Full adresse'} className={errors.address ? 'border-red-400' : ''} />
                </Field>
              </div>
            </div>

            {/* Comments */}
            <Field label={t('comments')}>
              <Textarea rows={3} value={form.comments} onChange={e => set('comments', e.target.value)} placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Eventuelle tilleggsopplysninger...'} className="resize-none" />
            </Field>

            {/* Consent */}
            <div>
              <label className={`flex items-start gap-3 cursor-pointer ${errors.consent ? 'text-red-600' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={e => set('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                <span className="text-sm">{t('consent')} *</span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {language === 'ar' ? 'يرجى تصحيح الأخطاء أعلاه' : 'Vennligst rett feilene ovenfor'}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {t('submitRegistration')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

// ─── School Hours ─────────────────────────────────────────────────────────────

function HoursSection({ hours }: { hours: SchoolHour[] }) {
  const { language } = useLanguage();

  if (hours.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        titleNo="Ingen skoletider lagt til ennå"
        titleAr="لم تتم إضافة أوقات الدراسة بعد"
        language={language}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'ar' ? 'أوقات الدراسة' : 'Skoletid'}
        </h2>
        <p className="text-gray-600">
          {language === 'ar' ? 'جدول مواعيد الدراسة الأسبوعية' : 'Ukentlig undervisningsplan'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hours.map(h => (
          <Card key={h.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                {language === 'ar' ? h.dayAr : h.dayNo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">{h.startTime} – {h.endTime}</span>
              </div>
              {h.breakTime && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                  <span className="font-medium">{language === 'ar' ? 'استراحة: ' : 'Pause: '}</span>
                  {h.breakTime}
                </div>
              )}
              {h.notes && (
                <p className="text-sm text-gray-600">{h.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Activities ───────────────────────────────────────────────────────────────

function ActivitiesSection({ activities }: { activities: SchoolActivity[] }) {
  const { language } = useLanguage();

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        titleNo="Ingen aktiviteter lagt til ennå"
        titleAr="لم تتم إضافة أنشطة بعد"
        language={language}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{language === 'ar' ? 'الأنشطة' : 'Aktiviteter'}</h2>
        <p className="text-gray-600">{language === 'ar' ? 'أنشطة المدرسة العربية' : 'Aktiviteter ved arabisk skole'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map(act => (
          <Card key={act.id} className="shadow-md hover:shadow-xl transition-all overflow-hidden">
            {act.image && (
              <div className="h-48 overflow-hidden">
                <img src={act.image} alt={language === 'ar' ? act.titleAr : act.titleNo} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader>
              <CardTitle>{language === 'ar' ? act.titleAr : act.titleNo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                {language === 'ar' ? act.descriptionAr : act.descriptionNo}
              </p>
              {(act.date || act.time) && (
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  {act.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-emerald-500" />{act.date}
                    </span>
                  )}
                  {act.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-emerald-500" />{act.time}
                    </span>
                  )}
                </div>
              )}
              {act.contact && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-4 w-4 text-emerald-500" />{act.contact}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Announcements ────────────────────────────────────────────────────────────

function AnnouncementsSection({ announcements }: { announcements: SchoolAnnouncement[] }) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        titleNo="Ingen annonser for øyeblikket"
        titleAr="لا توجد إعلانات حالياً"
        language={language}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{language === 'ar' ? 'الإعلانات' : 'Annonser'}</h2>
      </div>
      <div className="space-y-4">
        {announcements.sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0)).map(ann => (
          <Card
            key={ann.id}
            className={`shadow-md transition-all ${ann.isHighlighted ? 'border-2 border-emerald-400 bg-emerald-50/30' : ''}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${ann.isHighlighted ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Bell className={`h-5 w-5 ${ann.isHighlighted ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar' ? ann.titleAr : ann.titleNo}
                      </h3>
                      {ann.isHighlighted && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          {language === 'ar' ? 'مهم' : 'Viktig'}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0">{ann.date}</span>
                  </div>
                  <p className={`text-gray-700 text-sm leading-relaxed ${expanded === ann.id ? '' : 'line-clamp-2'}`}>
                    {language === 'ar' ? ann.contentAr : ann.contentNo}
                  </p>
                  <button
                    className="text-emerald-600 text-sm mt-1 hover:underline flex items-center gap-1"
                    onClick={() => setExpanded(expanded === ann.id ? null : ann.id)}
                  >
                    {expanded === ann.id
                      ? (language === 'ar' ? 'إخفاء' : 'Vis mindre')
                      : (language === 'ar' ? 'اقرأ المزيد' : 'Les mer')}
                    <ChevronDown className={`h-3 w-3 transition-transform ${expanded === ann.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, titleNo, titleAr, language }: {
  icon: React.ElementType; titleNo: string; titleAr: string; language: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
      <Icon className="h-16 w-16 mb-4 opacity-40" />
      <p className="text-lg">{language === 'ar' ? titleAr : titleNo}</p>
    </div>
  );
}
