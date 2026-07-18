import React from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'home', label: t('home') },
    { id: 'prayer-times', label: t('prayerTimes') },
    { id: 'about', label: t('about') },
    { id: 'arabic-school', label: t('arabicSchool') },
    { id: 'gallery', label: t('gallery') },
    { id: 'events', label: t('events') },
    { id: 'contact', label: t('contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'no' : 'ar');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="text-2xl font-bold text-emerald-600">
              {language === 'ar' ? 'آفاق' : 'Afaq'}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm transition-colors ${
                  currentPage === item.id
                    ? 'text-emerald-600 font-semibold'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'NO' : 'AR'}
              </span>
            </Button>

            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm ${
                  currentPage === item.id
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
