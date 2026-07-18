import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useLanguage } from '@/app/contexts/LanguageContext';

import img9926 from '@/imports/IMG_9926.jpg';
import img9933 from '@/imports/IMG_9933.jpg';
import img9936 from '@/imports/IMG_9936.jpg';
import img9960 from '@/imports/IMG_9960.jpg';
import img9967 from '@/imports/IMG_9967-2.jpg';
import img9974 from '@/imports/IMG_9974.jpg';
import img9984 from '@/imports/IMG_9984.jpg';
import img9985 from '@/imports/IMG_9985.jpg';
import img9988 from '@/imports/IMG_9988.jpg';
import imgStill from '@/imports/Sequence_01.00_01_52_22.Still003.png';
import img0055 from '@/imports/IMG_0055.jpg';
import img0065 from '@/imports/IMG_0065.jpg';

export const PRESET_IMAGES: GalleryItem[] = [
  { id: 'img9926', src: img9926, captionAr: 'فعالية مجتمعية', captionNo: 'Samfunnsarrangement' },
  { id: 'img9933', src: img9933, captionAr: 'أنشطة المركز', captionNo: 'Senteraktiviteter' },
  { id: 'img9936', src: img9936, captionAr: 'تجمع عائلي', captionNo: 'Familiesamling' },
  { id: 'img9960', src: img9960, captionAr: 'لحظة من المجتمع', captionNo: 'Et øyeblikk fra samfunnet' },
  { id: 'img9967', src: img9967, captionAr: 'برامج الشباب', captionNo: 'Ungdomsprogram' },
  { id: 'img9974', src: img9974, captionAr: 'فعالية ثقافية', captionNo: 'Kulturarrangement' },
  { id: 'img9984', src: img9984, captionAr: 'أنشطة تعليمية', captionNo: 'Pedagogiske aktiviteter' },
  { id: 'img9985', src: img9985, captionAr: 'مجتمعنا معاً', captionNo: 'Vårt samfunn sammen' },
  { id: 'img9988', src: img9988, captionAr: 'لحظات مميزة', captionNo: 'Spesielle øyeblikk' },
  { id: 'imgStill', src: imgStill, captionAr: 'من أنشطتنا', captionNo: 'Fra våre aktiviteter' },
  { id: 'img0055', src: img0055, captionAr: 'من المركز الإسلامي', captionNo: 'Fra det islamske senteret' },
  { id: 'img0065', src: img0065, captionAr: 'لحظات من مجتمعنا', captionNo: 'Øyeblikk fra vårt samfunn' },
];

export interface GalleryItem {
  id: string;
  src: string;
  captionAr: string;
  captionNo: string;
}

function useGalleryStore() {
  const getHidden = (): string[] => {
    try { return JSON.parse(localStorage.getItem('gallery_hidden') || '[]'); } catch { return []; }
  };
  const getUploaded = (): GalleryItem[] => {
    try { return JSON.parse(localStorage.getItem('gallery_uploaded') || '[]'); } catch { return []; }
  };
  const getCaptions = (): Record<string, { ar: string; no: string }> => {
    try { return JSON.parse(localStorage.getItem('gallery_captions') || '{}'); } catch { return {}; }
  };

  const [hidden, setHiddenState] = useState<string[]>(getHidden);
  const [uploaded, setUploadedState] = useState<GalleryItem[]>(getUploaded);
  const [captions, setCaptionsState] = useState(getCaptions);

  const setHidden = (ids: string[]) => {
    localStorage.setItem('gallery_hidden', JSON.stringify(ids));
    setHiddenState(ids);
  };
  const setUploaded = (items: GalleryItem[]) => {
    localStorage.setItem('gallery_uploaded', JSON.stringify(items));
    setUploadedState(items);
  };
  const setCaptions = (c: Record<string, { ar: string; no: string }>) => {
    localStorage.setItem('gallery_captions', JSON.stringify(c));
    setCaptionsState(c);
  };

  const allItems: GalleryItem[] = [
    ...PRESET_IMAGES
      .filter(img => !hidden.includes(img.id))
      .map(img => ({
        ...img,
        captionAr: captions[img.id]?.ar ?? img.captionAr,
        captionNo: captions[img.id]?.no ?? img.captionNo,
      })),
    ...uploaded,
  ];

  return { allItems, hidden, setHidden, uploaded, setUploaded, captions, setCaptions };
}

export { useGalleryStore };

export const GalleryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { allItems } = useGalleryStore();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + allItems.length) % allItems.length : null));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % allItems.length : null));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('galleryTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('galleryIntro')}</p>
          <div className="mt-4 w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        {allItems.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-lg">
            {language === 'ar' ? 'لا توجد صور في المعرض حالياً' : 'Ingen bilder i galleriet ennå'}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {allItems.map((item, index) => (
              <div
                key={item.id}
                className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <ImageWithFallback
                  src={item.src}
                  alt={language === 'ar' ? item.captionAr : item.captionNo}
                  className="w-full object-cover block"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10 drop-shadow-lg" />
                </div>
                {(item.captionAr || item.captionNo) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">
                      {language === 'ar' ? item.captionAr : item.captionNo}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] mx-16 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={allItems[lightboxIndex].src}
              alt={language === 'ar' ? allItems[lightboxIndex].captionAr : allItems[lightboxIndex].captionNo}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            {(allItems[lightboxIndex].captionAr || allItems[lightboxIndex].captionNo) && (
              <p className="text-white/80 text-base text-center">
                {language === 'ar' ? allItems[lightboxIndex].captionAr : allItems[lightboxIndex].captionNo}
              </p>
            )}
            <p className="text-white/40 text-sm">
              {lightboxIndex + 1} / {allItems.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
