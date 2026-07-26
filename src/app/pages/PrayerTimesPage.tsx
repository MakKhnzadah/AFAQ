import React from 'react';
import { ExternalLink, Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import mosqueSunset from '@/imports/This_stunning_mosque__captured_at_sunset_.jpeg';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useLanguage } from '@/app/contexts/LanguageContext';

export const PrayerTimesPage: React.FC = () => {
  const { language, t } = useLanguage();

  const prayerInfo = [
    {
      icon: Sunrise,
      name: language === 'ar' ? 'الفجر' : 'Fajr',
      description: language === 'ar' ? 'صلاة الفجر' : 'Morgenbønn',
    },
    {
      icon: Sun,
      name: language === 'ar' ? 'الظهر' : 'Dhuhr',
      description: language === 'ar' ? 'صلاة الظهر' : 'Middagsbønn',
    },
    {
      icon: Sun,
      name: language === 'ar' ? 'العصر' : 'Asr',
      description: language === 'ar' ? 'صلاة العصر' : 'Ettermiddagsbønn',
    },
    {
      icon: Sunset,
      name: language === 'ar' ? 'المغرب' : 'Maghrib',
      description: language === 'ar' ? 'صلاة المغرب' : 'Solnedgangsbønn',
    },
    {
      icon: Moon,
      name: language === 'ar' ? 'العشاء' : 'Isha',
      description: language === 'ar' ? 'صلاة العشاء' : 'Kveldsbønn',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('prayerTimesTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('prayerTimesDesc')}
          </p>
        </div>

        {/* Main CTA Card */}
        <Card className="mb-12 shadow-lg border-2 border-emerald-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-8 w-8 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === 'ar' ? 'أوقات الصلاة الدقيقة' : 'Nøyaktige Bønnetider'}
                  </h2>
                </div>
                <p className="text-gray-700 mb-4">
                  {t('prayerTimesNote')}
                </p>
                <a 
                  href="https://bonnetid.no/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    {t('viewOnline')}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
              <div className="w-full md:w-auto">
                <ImageWithFallback
                  src={mosqueSunset}
                  alt="Mosque at sunset"
                  className="w-full md:w-64 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Times Grid — each card links directly to bt.iksg.no */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {prayerInfo.map((prayer, index) => {
            const Icon = prayer.icon;
            return (
              <a
                key={index}
                href="https://bonnetid.no/"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="hover:shadow-xl hover:border-emerald-400 border-2 border-transparent transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-emerald-50 group-hover:bg-emerald-100 rounded-full transition-colors">
                        <Icon className="h-8 w-8 text-emerald-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">{prayer.name}</CardTitle>
                    <CardDescription>{prayer.description}</CardDescription>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ExternalLink className="h-3 w-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === 'ar' ? 'عرض الوقت' : 'Se tid'}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                {t('dailyPrayers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {t('dailyPrayersDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                {t('jumahPrayer')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {t('jumahPrayerDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-emerald-600" />
                {t('taraweeh')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {t('taraweehDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
