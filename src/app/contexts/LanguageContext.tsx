import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'no';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    prayerTimes: 'أوقات الصلاة',
    about: 'عن المركز',
    arabicSchool: 'المدرسة العربية',
    events: 'الفعاليات',
    gallery: 'معرض الصور',
    contact: 'اتصل بنا',
    sponsors: 'الرعاة',

    // Home Page
    heroTitle: 'مركز آفاق الإسلامي في جريمستاد',
    heroSubtitle: 'مركز ثقافي وديني يخدم المجتمع المسلم في جريمستاد',
    viewPrayerTimes: 'عرض أوقات الصلاة',
    upcomingEvents: 'الفعاليات القادمة',
    donate: 'تبرع',
    welcomeTitle: 'مرحباً بكم في مركز آفاق الإسلامي',
    welcomeText: 'نحن مركز ثقافي وديني يخدم المجتمع المسلم في جريمستاد والمناطق المحيطة. نقدم مجموعة متنوعة من الخدمات والأنشطة لجميع أفراد العائلة.',
    location: 'الموقع',
    locationAddress: 'جريمستاد، النرويج',
    ourSponsors: 'رعاتنا',
    sponsorText: 'نشكر رعاتنا على دعمهم المستمر',

    // Arabic School home card
    arabicSchoolCard: 'المدرسة العربية',
    arabicSchoolCardDesc: 'سجّل أطفالك في مدرستنا العربية واستفد من برامجنا التعليمية المتميزة',
    readMore: 'اقرأ المزيد',
    registerChild: 'سجّل طفلك',

    // Donation
    donationTitle: 'ساهم في دعم آفاق',
    donationDesc: 'تبرعاتكم تساعدنا على الاستمرار في تقديم الخدمات التعليمية والدينية والثقافية لمجتمعنا في جريمستاد.',
    donateNow: 'تبرع الآن',
    oneTime: 'مرة واحدة',
    monthly: 'شهرياً',
    chooseAmount: 'اختر المبلغ',
    otherAmount: 'مبلغ آخر',

    // Prayer Times
    prayerTimesTitle: 'أوقات الصلاة',
    prayerTimesDesc: 'أوقات الصلاة الدقيقة لجريمستاد متوفرة من خلال خدمة IKSG',
    viewOnline: 'عرض أوقات الصلاة عبر الإنترنت',
    prayerTimesNote: 'يتم تحديث أوقات الصلاة يومياً وفقاً للموقع الجغرافي لجريمستاد',
    dailyPrayers: 'الصلوات اليومية',
    dailyPrayersDesc: 'نقيم الصلوات الخمس يومياً في المركز',
    jumahPrayer: 'صلاة الجمعة',
    jumahPrayerDesc: 'خطبة الجمعة باللغة العربية والنرويجية',
    taraweeh: 'صلاة التراويح',
    taraweehDesc: 'خلال شهر رمضان المبارك',

    // About
    aboutTitle: 'عن مركز آفاق',
    missionVision: 'مهمتنا ورؤيتنا',
    missionText: 'مهمتنا هي توفير مكان آمن ومرحب لجميع المسلمين في جريمستاد لممارسة شعائرهم الدينية، وتعلم الإسلام، والتواصل مع المجتمع.',
    visionText: 'رؤيتنا هي أن نكون مركزاً رائداً للتميز الإسلامي والتفاهم الثقافي في جنوب النرويج.',
    communityRole: 'دورنا في المجتمع',
    communityRoleText: 'نسعى لبناء جسور التفاهم بين المجتمع المسلم والمجتمع النرويجي الأوسع من خلال الفعاليات الثقافية والتعليمية.',

    // Arabic School Page
    arabicSchoolTitle: 'المدرسة العربية',
    arabicSchoolIntro: 'مرحباً بكم في المدرسة العربية لمركز آفاق — نُعلّم أطفالنا لغتهم وهويتهم',
    registration: 'التسجيل',
    schoolHours: 'أوقات الدراسة',
    activities: 'الأنشطة',
    announcements: 'الإعلانات',
    childFullName: 'الاسم الكامل للطفل',
    childAge: 'عمر الطفل',
    childDob: 'تاريخ الميلاد',
    parentName: 'اسم الوالدين / المسؤول',
    phone: 'رقم الهاتف',
    emailAddress: 'البريد الإلكتروني',
    addressField: 'العنوان',
    desiredClassroom: 'الفصل الدراسي المطلوب',
    comments: 'ملاحظات أو معلومات إضافية',
    consent: 'أوافق على معالجة البيانات الشخصية وفقاً لسياسة الخصوصية',
    submitRegistration: 'إرسال التسجيل',
    registrationSuccess: 'تم استلام طلب التسجيل بنجاح! سنتواصل معكم قريباً.',
    selectClassroom: 'اختر الفصل',

    // Events
    eventsTitle: 'الفعاليات والإعلانات',
    upcomingEventsTitle: 'الفعاليات القادمة',
    noEvents: 'لا توجد فعاليات مجدولة حالياً',
    recentAnnouncements: 'الإعلانات الأخيرة',
    allCategories: 'الكل',
    religious: 'ديني',
    cultural: 'ثقافي',
    completed: 'منتهية',
    upcoming: 'قادمة',

    // Contact
    contactTitle: 'اتصل بنا',
    contactIntro: 'نسعد بالتواصل معكم. يرجى ملء النموذج أدناه وسنرد عليكم في أقرب وقت ممكن.',
    yourName: 'اسمك',
    yourEmail: 'بريدك الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    sendMessage: 'إرسال الرسالة',
    contactInfo: 'معلومات الاتصال',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    addressValue: 'جريمستاد، النرويج',
    followUs: 'تابعونا',

    // Gallery
    galleryTitle: 'معرض صور آفاق',
    galleryIntro: 'لحظات من حياة مجتمعنا وأنشطتنا',

    // Footer
    quickLinks: 'روابط سريعة',
    allRightsReserved: 'جميع الحقوق محفوظة',
  },
  no: {
    // Navigation
    home: 'Hjem',
    prayerTimes: 'Bønnetider',
    about: 'Om Oss',
    arabicSchool: 'Arabisk skole',
    events: 'Arrangementer',
    gallery: 'Galleri',
    contact: 'Kontakt',
    sponsors: 'Sponsorer',

    // Home Page
    heroTitle: 'Afaq Islamsk Senter i Grimstad',
    heroSubtitle: 'Et kulturelt og religiøst senter som tjener det muslimske samfunnet i Grimstad',
    viewPrayerTimes: 'Se Bønnetider',
    upcomingEvents: 'Kommende Arrangementer',
    donate: 'Doner',
    welcomeTitle: 'Velkommen til Afaq Islamsk Senter',
    welcomeText: 'Vi er et kulturelt og religiøst senter som tjener det muslimske samfunnet i Grimstad og omliggende områder. Vi tilbyr et bredt spekter av tjenester og aktiviteter for hele familien.',
    location: 'Sted',
    locationAddress: 'Grimstad, Norge',
    ourSponsors: 'Våre Sponsorer',
    sponsorText: 'Vi takker våre sponsorer for deres fortsatte støtte',

    // Arabic School home card
    arabicSchoolCard: 'Arabisk skole',
    arabicSchoolCardDesc: 'Meld barna dine på vår arabiske skole og dra nytte av våre fremragende undervisningsprogrammer',
    readMore: 'Les mer',
    registerChild: 'Registrer barn',

    // Donation
    donationTitle: 'Støtt AFAQ',
    donationDesc: 'Dine donasjoner hjelper oss å fortsette å tilby pedagogiske, religiøse og kulturelle tjenester til vårt samfunn i Grimstad.',
    donateNow: 'Doner nå',
    oneTime: 'Engangsbetaling',
    monthly: 'Månedlig',
    chooseAmount: 'Velg beløp',
    otherAmount: 'Annet beløp',

    // Prayer Times
    prayerTimesTitle: 'Bønnetider',
    prayerTimesDesc: 'Nøyaktige bønnetider for Grimstad er tilgjengelige gjennom IKSG-tjenesten',
    viewOnline: 'Se bønnetider online',
    prayerTimesNote: 'Bønnetidene oppdateres daglig i henhold til Grimstads geografiske plassering',
    dailyPrayers: 'Daglige Bønner',
    dailyPrayersDesc: 'Vi holder fem daglige bønner i senteret',
    jumahPrayer: 'Fredagsbønn',
    jumahPrayerDesc: 'Fredagspreken på arabisk og norsk',
    taraweeh: 'Taraweeh-bønn',
    taraweehDesc: 'Under den hellige måneden Ramadan',

    // About
    aboutTitle: 'Om Afaq',
    missionVision: 'Vårt Oppdrag og Visjon',
    missionText: 'Vårt oppdrag er å tilby en trygg og velkomstende plass for alle muslimer i Grimstad til å praktisere sin tro, lære om islam og knytte bånd med samfunnet.',
    visionText: 'Vår visjon er å være et ledende senter for islamsk fortreffelighet og kulturell forståelse i Sør-Norge.',
    communityRole: 'Vår Rolle i Samfunnet',
    communityRoleText: 'Vi søker å bygge broer av forståelse mellom det muslimske samfunnet og det bredere norske samfunnet gjennom kulturelle og pedagogiske arrangementer.',

    // Arabic School Page
    arabicSchoolTitle: 'Arabisk skole',
    arabicSchoolIntro: 'Velkommen til Afaq Arabisk skole — vi lærer barna våre språk og identitet',
    registration: 'Registrering',
    schoolHours: 'Skoletid',
    activities: 'Aktiviteter',
    announcements: 'Annonser',
    childFullName: 'Barnets fulle navn',
    childAge: 'Barnets alder',
    childDob: 'Fødselsdato',
    parentName: 'Foresattes navn',
    phone: 'Telefonnummer',
    emailAddress: 'E-postadresse',
    addressField: 'Adresse',
    desiredClassroom: 'Ønsket klasserom',
    comments: 'Kommentar eller tilleggsinformasjon',
    consent: 'Jeg samtykker til behandling av personopplysninger i henhold til personvernreglene',
    submitRegistration: 'Send registrering',
    registrationSuccess: 'Registreringen er mottatt! Vi tar kontakt med deg snart.',
    selectClassroom: 'Velg klasserom',

    // Events
    eventsTitle: 'Arrangementer og Kunngjøringer',
    upcomingEventsTitle: 'Kommende Arrangementer',
    noEvents: 'Ingen arrangementer planlagt for øyeblikket',
    recentAnnouncements: 'Nylige Kunngjøringer',
    allCategories: 'Alle',
    religious: 'Religiøs',
    cultural: 'Kulturell',
    completed: 'Gjennomført',
    upcoming: 'Kommende',

    // Contact
    contactTitle: 'Kontakt Oss',
    contactIntro: 'Vi vil gjerne høre fra deg. Vennligst fyll ut skjemaet nedenfor, så svarer vi deg så snart som mulig.',
    yourName: 'Ditt Navn',
    yourEmail: 'Din E-post',
    subject: 'Emne',
    message: 'Melding',
    sendMessage: 'Send Melding',
    contactInfo: 'Kontaktinformasjon',
    email: 'E-post',
    address: 'Adresse',
    addressValue: 'Grimstad, Norge',
    followUs: 'Følg Oss',

    // Gallery
    galleryTitle: 'Afaq Bildegalleri',
    galleryIntro: 'Øyeblikk fra vårt samfunnsliv og aktiviteter',

    // Footer
    quickLinks: 'Hurtiglenker',
    allRightsReserved: 'Alle rettigheter reservert',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('no');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['no']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
