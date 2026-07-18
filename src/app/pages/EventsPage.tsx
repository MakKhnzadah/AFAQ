import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventCategory = 'religious' | 'cultural';

export interface Event {
  id: string;
  titleNo: string;
  titleAr: string;
  descriptionNo: string;
  descriptionAr: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  image?: string;
  isUpcoming: boolean;
}

export interface Announcement {
  id: string;
  titleNo: string;
  titleAr: string;
  contentNo: string;
  contentAr: string;
  date: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_EVENTS: Event[] = [
  {
    id: 'e1',
    titleNo: 'Ukentlig Tafsir-klasse',
    titleAr: 'درس التفسير الأسبوعي',
    descriptionNo: 'Bli med oss på ukentlig Tafsir-klasse hvor vi utforsker betydningene i Koranen',
    descriptionAr: 'انضم إلينا في درس التفسير الأسبوعي حيث نستكشف معاني القرآن الكريم',
    date: '2026-02-02',
    time: '18:00 – 19:30',
    location: 'Hovedsalen',
    category: 'religious',
    isUpcoming: true,
  },
  {
    id: 'e2',
    titleNo: 'Koran-sirkel for barn',
    titleAr: 'حلقة القرآن للأطفال',
    descriptionNo: 'Koranundervisning og Tajweed for barn i alderen 6–12 år',
    descriptionAr: 'تعليم القرآن والتجويد للأطفال من سن 6-12 سنة',
    date: '2026-02-07',
    time: '16:00 – 17:30',
    location: 'Barnerommet',
    category: 'religious',
    isUpcoming: true,
  },
  {
    id: 'e3',
    titleNo: 'Ungdomsprogram',
    titleAr: 'برنامج الشباب',
    descriptionNo: 'Aktiviteter og pedagogiske spill for muslimsk ungdom',
    descriptionAr: 'أنشطة وألعاب تعليمية للشباب المسلم',
    date: '2026-02-05',
    time: '17:00 – 19:00',
    location: 'Ungdomsrommet',
    category: 'cultural',
    isUpcoming: true,
  },
  {
    id: 'e4',
    titleNo: 'Familiesamling',
    titleAr: 'تجمع العائلات',
    descriptionNo: 'Familietreff med lett servering og aktiviteter for barn',
    descriptionAr: 'لقاء عائلي مع وجبة خفيفة وأنشطة للأطفال',
    date: '2026-02-09',
    time: '14:00 – 17:00',
    location: 'Hovedsalen',
    category: 'cultural',
    isUpcoming: true,
  },
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'an1',
    titleNo: 'Oppdaterte bønnetider',
    titleAr: 'تحديث أوقات الصلاة',
    contentNo: 'Bønnetidene for februar er oppdatert. Vennligst besøk bønnetider-siden for oppdateringer.',
    contentAr: 'تم تحديث أوقات الصلاة لشهر فبراير. يرجى زيارة صفحة أوقات الصلاة للاطلاع على التحديثات.',
    date: '25. januar 2026',
  },
  {
    id: 'an2',
    titleNo: 'Påmelding til Koran-leksjoner',
    titleAr: 'التسجيل في دروس القرآن',
    contentNo: 'Påmelding er nå åpen for Koran-leksjoner for det nye semesteret. Kontakt oss for å melde deg på.',
    contentAr: 'التسجيل مفتوح الآن لدروس القرآن للفصل الدراسي الجديد. اتصل بنا للتسجيل.',
    date: '20. januar 2026',
  },
  {
    id: 'an3',
    titleNo: 'Ønske om frivillige',
    titleAr: 'طلب متطوعين',
    contentNo: 'Vi søker frivillige til å hjelpe med organisering av kommende arrangementer og aktiviteter.',
    contentAr: 'نبحث عن متطوعين للمساعدة في تنظيم الفعاليات والأنشطة القادمة.',
    date: '15. januar 2026',
  },
];

// ─── Storage ──────────────────────────────────────────────────────────────────

function load<T>(key: string, def: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; } catch { return def; }
}
function save<T>(key: string, val: T) { localStorage.setItem(key, JSON.stringify(val)); }

export function useEventsStore() {
  const [events, setEventsState] = useState<Event[]>(() => load('events_data', DEFAULT_EVENTS));
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(() => load('events_announcements', DEFAULT_ANNOUNCEMENTS));

  const setEvents = (v: Event[]) => { save('events_data', v); setEventsState(v); };
  const setAnnouncements = (v: Announcement[]) => { save('events_announcements', v); setAnnouncementsState(v); };

  return { events, setEvents, announcements, setAnnouncements };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Filter = 'all' | EventCategory;

const CATEGORY_COLORS: Record<EventCategory, string> = {
  religious: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cultural: 'bg-blue-100 text-blue-700 border-blue-200',
};

function formatDate(d: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));
  } catch { return d; }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const EventsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { events, announcements } = useEventsStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  const filteredEvents = events.filter(ev => {
    if (filter !== 'all' && ev.category !== filter) return false;
    if (statusFilter === 'upcoming' && !ev.isUpcoming) return false;
    if (statusFilter === 'completed' && ev.isUpcoming) return false;
    return true;
  });

  const categoryLabel = (cat: EventCategory) =>
    cat === 'religious' ? t('religious') : t('cultural');

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('eventsTitle')}</h1>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Filter className="h-4 w-4" />
            {language === 'ar' ? 'التصفية:' : 'Filtrer:'}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'religious', 'cultural'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? f === 'religious' ? 'bg-emerald-600 text-white'
                      : f === 'cultural' ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? t('allCategories') : f === 'religious' ? t('religious') : t('cultural')}
              </button>
            ))}
          </div>

          <div className="h-4 border-r border-gray-300 hidden sm:block" />

          {/* Status filters */}
          <div className="flex gap-2">
            {(['upcoming', 'completed', 'all'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'upcoming' ? t('upcoming') : s === 'completed' ? t('completed') : t('allCategories')}
              </button>
            ))}
          </div>
        </div>

        {/* Events grid */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('upcomingEventsTitle')}</h2>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Calendar className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('noEvents')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(ev => (
                <EventCard key={ev.id} event={ev} language={language} categoryLabel={categoryLabel(ev.category)} />
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('recentAnnouncements')}</h2>
          <div className="space-y-4">
            {announcements.map(ann => (
              <Card key={ann.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                      <Bell className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {language === 'ar' ? ann.titleAr : ann.titleNo}
                        </h3>
                        <span className="text-sm text-gray-500 flex-shrink-0">{ann.date}</span>
                      </div>
                      <p className="text-gray-700">
                        {language === 'ar' ? ann.contentAr : ann.contentNo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, language, categoryLabel }: {
  event: Event; language: string; categoryLabel: string;
}) {
  const colorClass = CATEGORY_COLORS[event.category];
  const title = language === 'ar' ? event.titleAr : event.titleNo;
  const description = language === 'ar' ? event.descriptionAr : event.descriptionNo;

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      {event.image && (
        <div className="h-40 overflow-hidden">
          <img src={event.image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-snug">{title}</CardTitle>
          <Badge className={`${colorClass} flex-shrink-0 text-xs`}>{categoryLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span>{formatDate(event.date, language)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
