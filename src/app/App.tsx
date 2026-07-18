import React, { useState } from 'react';
import { LanguageProvider } from '@/app/contexts/LanguageContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { PrayerTimesPage } from '@/app/pages/PrayerTimesPage';
import { AboutPage } from '@/app/pages/AboutPage';
import { ArabicSchoolPage } from '@/app/pages/ArabicSchoolPage';
import { EventsPage } from '@/app/pages/EventsPage';
import { ContactPage } from '@/app/pages/ContactPage';
import { GalleryPage } from '@/app/pages/GalleryPage';
import { AdminPage } from '@/app/pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'prayer-times':
        return <PrayerTimesPage />;
      case 'about':
        return <AboutPage />;
      case 'arabic-school':
        return <ArabicSchoolPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'events':
        return <EventsPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const isAdminPage = currentPage === 'admin';

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {!isAdminPage && <Header currentPage={currentPage} onNavigate={setCurrentPage} />}
        <main className="flex-1">
          {renderPage()}
        </main>
        {!isAdminPage && <Footer onNavigate={setCurrentPage} />}
      </div>
    </LanguageProvider>
  );
}
