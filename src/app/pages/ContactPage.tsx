import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useLanguage } from '@/app/contexts/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const mailtoLink = `mailto:qosaya@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `${t('yourName')}: ${formData.name}\n${t('yourEmail')}: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('contactTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contactIntro')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t('sendMessage')}</CardTitle>
                <CardDescription>
                  {t('language') === 'ar' 
                    ? 'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن'
                    : 'Fyll ut skjemaet nedenfor så svarer vi deg så snart som mulig'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('yourName')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('yourName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('yourEmail')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('yourEmail')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('subject')} *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('subject')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('message')}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {t('sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{t('contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {t('email')}
                    </p>
                    <a 
                      href="mailto:qosaya@gmail.com"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      qosaya@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {t('address')}
                    </p>
                    <p className="text-gray-700">
                      {t('addressValue')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d8.5963661!3d58.3392192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4647ef9d1691dc11%3A0x25ac503aaee1c823!2sAFAQ%20ISLAMSK%20KULTURSENTERET%20I%20GRIMSTAD!5e0!3m2!1sen!2s!4v1719000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="AFAQ Islamic Cultural Center Grimstad"
                ></iframe>
              </div>
            </Card>

            {/* Follow Us */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{t('followUs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  {t('language') === 'ar'
                    ? 'تابعونا على وسائل التواصل الاجتماعي للحصول على آخر الأخبار والتحديثات'
                    : 'Følg oss på sosiale medier for siste nyheter og oppdateringer'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
