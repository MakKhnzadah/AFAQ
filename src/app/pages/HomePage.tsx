import React, { useState } from 'react';
import { Calendar, BookOpen, ArrowRight, Heart, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useLanguage } from '@/app/contexts/LanguageContext';
import mosqueSunset from '@/imports/This_stunning_mosque__captured_at_sunset_.jpeg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// ─── Donation Modal ───────────────────────────────────────────────────────────

const AMOUNTS = [100, 200, 500, 1000];

function DonationModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [type, setType] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number | null>(200);
  const [custom, setCustom] = useState('');
  const [step, setStep] = useState<'choose' | 'info'>('choose');

  const finalAmount = amount ?? parseInt(custom || '0', 10);

  const handleContinue = () => {
    if (!finalAmount || finalAmount < 10) return;
    setStep('info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {language === 'ar' ? 'تبرع لدعم آفاق' : 'Støtt AFAQ'}
            </h2>
            <p className="text-emerald-100 text-sm mt-0.5">
              {language === 'ar' ? 'كل تبرع يصنع فرقاً' : 'Hver donasjon gjør en forskjell'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'choose' ? (
            <div className="space-y-5">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(['one-time', 'monthly'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      type === t ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'one-time'
                      ? (language === 'ar' ? 'مرة واحدة' : 'Engangsbetaling')
                      : (language === 'ar' ? 'شهرياً' : 'Månedlig')}
                  </button>
                ))}
              </div>

              {/* Amount grid */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {language === 'ar' ? 'اختر المبلغ (NOK)' : 'Velg beløp (NOK)'}
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustom(''); }}
                      className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                        amount === a && !custom
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={10}
                  placeholder={language === 'ar' ? 'مبلغ آخر...' : 'Annet beløp...'}
                  value={custom}
                  onChange={e => { setCustom(e.target.value); setAmount(null); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-base py-6"
                onClick={handleContinue}
                disabled={!finalAmount || finalAmount < 10}
              >
                {language === 'ar' ? `تبرع بـ ${finalAmount} kr` : `Doner ${finalAmount} kr`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <p className="text-xs text-gray-400 text-center">
                {language === 'ar'
                  ? 'آمن ومشفر · يمكن الإلغاء في أي وقت'
                  : 'Trygt og kryptert · Kan avbrytes når som helst'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-emerald-800 font-semibold text-lg">
                  {language === 'ar' ? `مبلغ التبرع: ${finalAmount} kr` : `Donasjonsbeløp: ${finalAmount} kr`}
                </p>
                <p className="text-emerald-600 text-sm">
                  {type === 'monthly'
                    ? (language === 'ar' ? 'شهرياً' : 'Månedlig')
                    : (language === 'ar' ? 'مرة واحدة' : 'Engangsbetaling')}
                </p>
              </div>

              {/* Payment options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'طرق الدفع:' : 'Betalingsmetoder:'}
                </p>

                <div className="border border-gray-200 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">📱</span> Vipps
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'أرسل إلى رقم: ' : 'Send til: '}
                    <span className="font-bold text-emerald-700">qosaya@gmail.com</span>
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🏦</span>
                    {language === 'ar' ? 'تحويل بنكي' : 'Bankoverføring'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الرقم البنكي: ' : 'Kontonummer: '}
                    <span className="font-mono font-bold text-gray-800">
                      {language === 'ar' ? 'يرجى التواصل معنا' : 'Kontakt oss for kontonr.'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('choose')}>
                  {language === 'ar' ? 'رجوع' : 'Tilbake'}
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={onClose}>
                  {language === 'ar' ? 'إغلاق' : 'Lukk'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [donationOpen, setDonationOpen] = useState(false);

  const upcomingEvents = [
    {
      id: 1,
      title: language === 'ar' ? 'درس التفسير الأسبوعي' : 'Ukentlig Tafsir-klasse',
      date: language === 'ar' ? '2 فبراير 2026' : '2. februar 2026',
      time: '18:00',
    },
    {
      id: 2,
      title: language === 'ar' ? 'برنامج الشباب' : 'Ungdomsprogram',
      date: language === 'ar' ? '5 فبراير 2026' : '5. februar 2026',
      time: '17:00',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
        <img src={mosqueSunset} alt="Afaq Islamic Center" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">{t('heroSubtitle')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('prayer-times')} className="bg-emerald-600 hover:bg-emerald-700">
              {t('viewPrayerTimes')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('events')}
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
              {t('upcomingEvents')}
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Prayer Times */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                {t('prayerTimes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{t('prayerTimesDesc')}</CardDescription>
              <Button variant="outline" className="w-full" onClick={() => onNavigate('prayer-times')}>
                {t('viewPrayerTimes')}
              </Button>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                {t('upcomingEvents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {upcomingEvents.slice(0, 2).map(event => (
                  <div key={event.id} className="text-sm">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-gray-600">{event.date} • {event.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => onNavigate('events')}>
                {t('readMore')}
              </Button>
            </CardContent>
          </Card>

          {/* Arabic School card (replaces Location) */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                {t('arabicSchoolCard')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{t('arabicSchoolCardDesc')}</CardDescription>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => onNavigate('arabic-school')}>
                  {t('readMore')}
                </Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => onNavigate('arabic-school')}>
                  {t('registerChild')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('welcomeTitle')}</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{t('welcomeText')}</p>
            <Button size="lg" onClick={() => onNavigate('about')} className="bg-emerald-600 hover:bg-emerald-700">
              {t('about')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1761939997990-7e1635db43c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb3NxdWUlMjBJc2xhbWljJTIwYXJjaGl0ZWN0dXJlJTIwZ29sZGVuJTIwbGlnaHR8ZW58MXx8fHwxNzgyMTM1NDYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Islamic Center interior"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 py-14 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Heart className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3">{t('donationTitle')}</h2>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-lg">{t('donationDesc')}</p>
          </div>
          <div className="flex-shrink-0">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-8 py-6 shadow-lg"
              onClick={() => setDonationOpen(true)}
            >
              <Heart className="h-5 w-5 mr-2 text-emerald-600" />
              {t('donateNow')}
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('ourSponsors')}</h2>
            <p className="text-gray-600">{t('sponsorText')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-600' },
              { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-600' },
              { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-600' },
            ].map((style, i) => (
              <Card key={i} className={`bg-gradient-to-br ${style.bg} border-2 ${style.border} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-8 text-center">
                  <div className={`h-16 flex items-center justify-center mb-4 text-3xl font-bold ${style.text}`}>
                    {language === 'ar' ? 'مساحة إعلانية' : 'Annonseplass'}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'ar'
                      ? 'متاح للشركات والمؤسسات الراغبة في دعم المركز'
                      : 'Tilgjengelig for bedrifter som ønsker å støtte senteret'}
                  </p>
                  <Button variant="outline" onClick={() => onNavigate('contact')}>
                    {t('contact')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {donationOpen && <DonationModal onClose={() => setDonationOpen(false)} />}
    </div>
  );
};
