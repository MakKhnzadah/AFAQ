import React from 'react';
import { Target, Eye, Users } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import mosqueSunset from '@/imports/This_stunning_mosque__captured_at_sunset_.jpeg';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useLanguage } from '@/app/contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('aboutTitle')}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-lg overflow-hidden shadow-xl">
          <ImageWithFallback
            src={mosqueSunset}
            alt="Afaq Islamic Center"
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Mission & Vision */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('missionVision')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span>
                    {t('language') === 'ar' ? 'مهمتنا' : 'Vårt Oppdrag'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {t('missionText')}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <span>
                    {t('language') === 'ar' ? 'رؤيتنا' : 'Vår Visjon'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {t('visionText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Role */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              {t('communityRole')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              {t('communityRoleText')}
            </p>
          </CardContent>
        </Card>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRdXJhbiUyMG9wZW4lMjBib29rJTIwSXNsYW1pYyUyMGNhbGxpZ3JhcGh5fGVufDF8fHx8MTc4MjEzNTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Quran"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('language') === 'ar' ? 'قيمنا الأساسية' : 'Våre Kjerneverdier'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {t('language') === 'ar' ? 'الشمولية' : 'Inkludering'}
                  </p>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'نرحب بجميع أفراد المجتمع بغض النظر عن خلفياتهم'
                      : 'Vi ønsker alle i samfunnet velkommen, uavhengig av bakgrunn'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {t('language') === 'ar' ? 'التعليم' : 'Utdanning'}
                  </p>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'نؤمن بأهمية التعليم المستمر والنمو الروحي'
                      : 'Vi tror på viktigheten av kontinuerlig læring og åndelig vekst'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {t('language') === 'ar' ? 'التواصل' : 'Fellesskap'}
                  </p>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'نعمل على بناء علاقات قوية بين أفراد المجتمع'
                      : 'Vi jobber for å bygge sterke relasjoner i samfunnet'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
