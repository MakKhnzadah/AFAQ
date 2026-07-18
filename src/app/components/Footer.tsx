import React from 'react';
import { MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const quickLinks = [
    { id: 'home', label: t('home') },
    { id: 'prayer-times', label: t('prayerTimes') },
    { id: 'events', label: t('events') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t('aboutTitle')}
            </h3>
            <p className="text-sm">
              {t('welcomeText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t('contactInfo')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-white">{t('address')}</p>
                  <p>{t('addressValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-white">{t('email')}</p>
                  <a 
                    href="mailto:qosaya@gmail.com"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    qosaya@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Afaq Islamic Center. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};
