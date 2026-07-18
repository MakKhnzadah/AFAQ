import React from 'react';
import { BookOpen, Users, Heart, Calendar, GraduationCap, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useLanguage } from '@/app/contexts/LanguageContext';

export const ServicesPage: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: BookOpen,
      title: t('service1'),
      description: t('service1Desc'),
      color: 'emerald',
    },
    {
      icon: GraduationCap,
      title: t('service2'),
      description: t('service2Desc'),
      color: 'blue',
    },
    {
      icon: Users,
      title: t('service3'),
      description: t('service3Desc'),
      color: 'purple',
    },
    {
      icon: Heart,
      title: t('service4'),
      description: t('service4Desc'),
      color: 'pink',
    },
    {
      icon: MessageCircle,
      title: t('service5'),
      description: t('service5Desc'),
      color: 'orange',
    },
    {
      icon: Calendar,
      title: t('service6'),
      description: t('service6Desc'),
      color: 'teal',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('servicesTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('servicesIntro')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = getColorClasses(service.color);
            return (
              <Card 
                key={index} 
                className={`hover:shadow-xl transition-all duration-300 border-2 ${colors.border}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${colors.bg} rounded-lg flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <CardTitle className="mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1761939998934-f416e51f2686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtb3NxdWUlMjBJc2xhbWljJTIwYXJjaGl0ZWN0dXJlJTIwZ29sZGVuJTIwbGlnaHR8ZW58MXx8fHwxNzgyMTM1NDYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Man praying in mosque"
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('language') === 'ar' 
                  ? 'انضم إلى مجتمعنا' 
                  : 'Bli med i vårt samfunn'}
              </h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {t('language') === 'ar'
                  ? 'نحن نرحب بجميع أفراد المجتمع للاستفادة من خدماتنا والمشاركة في أنشطتنا. سواء كنت جديداً في المنطقة أو كنت مقيماً منذ فترة طويلة، نحن هنا لخدمتك ودعمك.'
                  : 'Vi ønsker alle i samfunnet velkommen til å dra nytte av våre tjenester og delta i våre aktiviteter. Enten du er ny i området eller har bodd her lenge, er vi her for å tjene og støtte deg.'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'برامج للجميع - من الأطفال إلى كبار السن'
                      : 'Programmer for alle - fra barn til eldre'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'معلمون ومرشدون مؤهلون ومتفانون'
                      : 'Kvalifiserte og dedikerte lærere og veiledere'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <p className="text-gray-700">
                    {t('language') === 'ar' 
                      ? 'بيئة آمنة ومرحبة لجميع أفراد العائلة'
                      : 'Trygt og velkomstende miljø for hele familien'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
