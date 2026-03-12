import fs from 'node:fs/promises';
import path from 'node:path';

const base = {
  ui: {
    language: 'Language',
    close: 'Close',
    bookNow: 'Book Now',
  },
  brand: {
    name: 'AstroVeda',
    tagline: 'Premium Cosmic Guidance'
  },
  hero: {
    headlineA: "Connect with India's",
    headlineB: 'Best Astrologers',
    subtitle: 'Get instant guidance on love, career, health & more from verified Vedic experts.',
    cta: 'First Chat is FREE'
  },
  nav: {
    chat: 'Chat',
    talk: 'Talk',
    kundli: 'Free Kundli',
    matching: 'Matching',
    horoscope: 'Daily Horoscope',
    tarot: 'Tarot',
    services: 'Services'
  },
  profile: {
    guestName: 'Guest User',
    greeting: 'Premium Experience'
  },
  services: {
    dailyHoroscope_title: 'Daily Horoscope',
    dailyHoroscope_desc: 'Know what stars say today',
    kundli_title: 'Free Kundli',
    kundli_desc: 'Get your birth chart',
    matching_title: 'Compatibility Match',
    matching_desc: 'Find your perfect match',
    tarot_title: 'Tarot Reading',
    tarot_desc: 'Unlock hidden answers'
  },
  pages: {
    priestServices_title: 'Priest Services',
    priestServices_subtitle: 'Book priests, choose geo-smart kits, and manage bookings.'
  }
};

// Hand-crafted UI translations (small surface area) for all scheduled locales.
const t = {
  hi: {
    ui: { language: 'भाषा', close: 'बंद करें', bookNow: 'बुक करें' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारत के',
      headlineB: 'सर्वश्रेष्ठ ज्योतिषियों से जुड़ें',
      subtitle: 'प्रेम, करियर, स्वास्थ्य आदि पर तुरंत मार्गदर्शन पाएँ — सत्यापित वैदिक विशेषज्ञों से।',
      cta: 'पहली चैट मुफ़्त है'
    },
    nav: {
      chat: 'चैट',
      talk: 'कॉल',
      kundli: 'मुफ़्त कुंडली',
      matching: 'मिलान',
      horoscope: 'दैनिक राशिफल',
      tarot: 'टैरो',
      services: 'सेवाएँ'
    },
    profile: { guestName: 'अतिथि', greeting: 'नमस्ते' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'आज के सितारों का संदेश',
      kundli_title: 'मुफ़्त कुंडली',
      kundli_desc: 'अपना जन्म कुंडली चार्ट पाएँ',
      matching_title: 'कुंडली मिलान',
      matching_desc: 'अपना परफेक्ट मैच जानें',
      tarot_title: 'टैरो रीडिंग',
      tarot_desc: 'छिपे जवाब जानें'
    },
    pages: { priestServices_title: 'पुजारी सेवाएँ', priestServices_subtitle: 'पुजारी बुक करें, किट चुनें और बुकिंग मैनेज करें।' }
  },
  te: {
    ui: { language: 'భాష', close: 'మూసివేయి', bookNow: 'బుక్ చేయండి' },
    brand: { tagline: 'ప్రీమియం ఆకాశ మార్గదర్శనం' },
    hero: {
      headlineA: 'భారతదేశంలోని',
      headlineB: 'అత్యుత్తమ జ్యోతిష్యులను కలవండి',
      subtitle: 'ప్రేమ, కెరీర్, ఆరోగ్యం తదితర విషయాల్లో వెంటనే మార్గదర్శనం పొందండి — ధృవీకరించిన వైదిక నిపుణుల నుంచి.',
      cta: 'మొదటి చాట్ ఉచితం'
    },
    nav: {
      chat: 'చాట్',
      talk: 'కాల్',
      kundli: 'ఉచిత కుండ్లీ',
      matching: 'మ్యాచింగ్',
      horoscope: 'దిన రాశిఫలం',
      tarot: 'టారోట్',
      services: 'సేవలు'
    },
    profile: { guestName: 'అతిథి', greeting: 'నమస్తే' },
    services: {
      dailyHoroscope_title: 'దిన రాశిఫలం',
      dailyHoroscope_desc: 'ఈరోజు నక్షత్రాలు ఏమంటున్నాయో తెలుసుకోండి',
      kundli_title: 'ఉచిత కుండ్లీ',
      kundli_desc: 'మీ జన్మ చార్ట్ పొందండి',
      matching_title: 'సామరస్య మ్యాచ్',
      matching_desc: 'మీకు సరైన జోడిని కనుగొనండి',
      tarot_title: 'టారోట్ రీడింగ్',
      tarot_desc: 'దాచిన సమాధానాలను తెలుసుకోండి'
    },
    pages: { priestServices_title: 'పూజారి సేవలు', priestServices_subtitle: 'పూజారులను బుక్ చేయండి, జియో-స్మార్ట్ కిట్లు ఎంచుకోండి, బుకింగ్స్ నిర్వహించండి.' }
  },
  bn: {
    ui: { language: 'ভাষা', close: 'বন্ধ', bookNow: 'বুক করুন' },
    brand: { tagline: 'প্রিমিয়াম মহাজাগতিক নির্দেশনা' },
    hero: {
      headlineA: 'ভারতের',
      headlineB: 'সেরা জ্যোতিষিদের সাথে যুক্ত হন',
      subtitle: 'প্রেম, ক্যারিয়ার, স্বাস্থ্য ইত্যাদিতে তাৎক্ষণিক পরামর্শ নিন—যাচাইকৃত বৈদিক বিশেষজ্ঞদের কাছ থেকে।',
      cta: 'প্রথম চ্যাট ফ্রি'
    },
    nav: { chat: 'চ্যাট', talk: 'কল', kundli: 'ফ্রি কুণ্ডলী', matching: 'ম্যাচিং', horoscope: 'দৈনিক রাশিফল', tarot: 'টারোট', services: 'সেবা' },
    profile: { guestName: 'অতিথি', greeting: 'নমস্কার' },
    services: {
      dailyHoroscope_title: 'দৈনিক রাশিফল',
      dailyHoroscope_desc: 'আজ তারারা কী বলছে জানুন',
      kundli_title: 'ফ্রি কুণ্ডলী',
      kundli_desc: 'আপনার জন্মছক পান',
      matching_title: 'সামঞ্জস্য ম্যাচ',
      matching_desc: 'আপনার পারফেক্ট ম্যাচ খুঁজুন',
      tarot_title: 'টারোট রিডিং',
      tarot_desc: 'লুকানো উত্তর খুঁজে নিন'
    },
    pages: { priestServices_title: 'পুরোহিত সেবা', priestServices_subtitle: 'পুরোহিত বুক করুন, কিট বাছুন এবং বুকিং ম্যানেজ করুন।' }
  },
  mr: {
    ui: { language: 'भाषा', close: 'बंद', bookNow: 'बुक करा' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारताच्या',
      headlineB: 'सर्वोत्तम ज्योतिषांशी जोडा',
      subtitle: 'प्रेम, करिअर, आरोग्य इ. बाबतीत त्वरित मार्गदर्शन मिळवा — सत्यापित वैदिक तज्ज्ञांकडून.',
      cta: 'पहिली चॅट मोफत'
    },
    nav: { chat: 'चॅट', talk: 'कॉल', kundli: 'मोफत कुंडली', matching: 'जुळणी', horoscope: 'दैनिक राशीभविष्य', tarot: 'टॅरो', services: 'सेवा' },
    profile: { guestName: 'अतिथी', greeting: 'नमस्कार' },
    services: {
      dailyHoroscope_title: 'दैनिक राशीभविष्य',
      dailyHoroscope_desc: 'आज तारे काय सांगतात',
      kundli_title: 'मोफत कुंडली',
      kundli_desc: 'आपला जन्मकुंडली चार्ट मिळवा',
      matching_title: 'सुसंगतता जुळणी',
      matching_desc: 'तुमचा परफेक्ट मॅच शोधा',
      tarot_title: 'टॅरो रीडिंग',
      tarot_desc: 'लपलेली उत्तरे उघडा'
    },
    pages: { priestServices_title: 'पुरोहित सेवा', priestServices_subtitle: 'पुरोहित बुक करा, किट निवडा आणि बुकिंग व्यवस्थापित करा.' }
  },
  ta: {
    ui: { language: 'மொழி', close: 'மூடு', bookNow: 'பதிவு செய்யவும்' },
    brand: { tagline: 'பிரீமியம் பிரபஞ்ச வழிகாட்டல்' },
    hero: {
      headlineA: 'இந்தியாவின்',
      headlineB: 'சிறந்த ஜோதிடர்களுடன் இணைக',
      subtitle: 'காதல், தொழில், ஆரோக்கியம் போன்றவற்றில் உடனடி வழிகாட்டல் — சரிபார்க்கப்பட்ட வைதிக நிபுணர்களிடம் இருந்து.',
      cta: 'முதல் சாட் இலவசம்'
    },
    nav: { chat: 'சாட்', talk: 'கால்', kundli: 'இலவச குண்டலி', matching: 'மேட்சிங்', horoscope: 'தின ராசிபலன்', tarot: 'டாரோ', services: 'சேவைகள்' },
    profile: { guestName: 'விருந்தினர்', greeting: 'வணக்கம்' },
    services: {
      dailyHoroscope_title: 'தின ராசிபலன்',
      dailyHoroscope_desc: 'இன்றைய நட்சத்திர செய்தி',
      kundli_title: 'இலவச குண்டலி',
      kundli_desc: 'உங்கள் பிறப்பு கட்டத்தைப் பெறுங்கள்',
      matching_title: 'இணக்கப் பொருத்தம்',
      matching_desc: 'உங்கள் சரியான ஜோடியை கண்டறியவும்',
      tarot_title: 'டாரோ ரீடிங்',
      tarot_desc: 'மறைந்த பதில்களைத் திறக்கவும்'
    },
    pages: { priestServices_title: 'பூஜாரி சேவைகள்', priestServices_subtitle: 'பூஜாரிகளை பதிவு செய்து, கிட்டுகளைத் தேர்வு செய்து, முன்பதிவுகளை நிர்வகிக்கவும்.' }
  },
  gu: {
    ui: { language: 'ભાષા', close: 'બંધ', bookNow: 'બુક કરો' },
    brand: { tagline: 'પ્રીમિયમ બ્રહ્માંડ માર્ગદર્શન' },
    hero: {
      headlineA: 'ભારતના',
      headlineB: 'શ્રેષ્ઠ જ્યોતિષીઓ સાથે જોડાઓ',
      subtitle: 'પ્રેમ, કારકિર્દી, આરોગ્ય વગેરે અંગે તાત્કાલિક માર્ગદર્શન મેળવો — ચકાસાયેલા વૈદિક નિષ્ણાતોથી.',
      cta: 'પહેલી ચેટ મફત'
    },
    nav: { chat: 'ચેટ', talk: 'કૉલ', kundli: 'મફત કુંડળી', matching: 'મેચિંગ', horoscope: 'દૈનિક રાશિફળ', tarot: 'ટેરોટ', services: 'સેવાઓ' },
    profile: { guestName: 'મહેમાન', greeting: 'નમસ્તે' },
    services: {
      dailyHoroscope_title: 'દૈનિક રાશિફળ',
      dailyHoroscope_desc: 'આજે તારાઓ શું કહે છે',
      kundli_title: 'મફત કુંડળી',
      kundli_desc: 'તમારો જન્મ ચાર્ટ મેળવો',
      matching_title: 'સંગતતા મેચ',
      matching_desc: 'તમારો પરફેક્ટ મેચ શોધો',
      tarot_title: 'ટેરોટ રીડિંગ',
      tarot_desc: 'છુપાયેલા જવાબો શોધો'
    },
    pages: { priestServices_title: 'પુજારી સેવાઓ', priestServices_subtitle: 'પુજારી બુક કરો, કિટ પસંદ કરો અને બુકિંગ મેનેજ કરો.' }
  },
  kn: {
    ui: { language: 'ಭಾಷೆ', close: 'ಮುಚ್ಚಿ', bookNow: 'ಬುಕ್ ಮಾಡಿ' },
    brand: { tagline: 'ಪ್ರೀಮಿಯಂ ಬ್ರಹ್ಮಾಂಡ ಮಾರ್ಗದರ್ಶನ' },
    hero: {
      headlineA: 'ಭಾರತದ',
      headlineB: 'ಅತ್ಯುತ್ತಮ ಜ್ಯೋತಿಷಿಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
      subtitle: 'ಪ್ರೇಮ, ವೃತ್ತಿ, ಆರೋಗ್ಯ ಇತ್ಯಾದಿಗಳ ಬಗ್ಗೆ ತ್ವರಿತ ಮಾರ್ಗದರ್ಶನ — ಪರಿಶೀಲಿತ ವೇದಿಕ ತಜ್ಞರಿಂದ.',
      cta: 'ಮೊದಲ ಚಾಟ್ ಉಚಿತ'
    },
    nav: { chat: 'ಚಾಟ್', talk: 'ಕಾಲ್', kundli: 'ಉಚಿತ ಕುಂಡಲಿ', matching: 'ಮ್ಯಾಚಿಂಗ್', horoscope: 'ದೈನಂದಿನ ರಾಶಿಫಲ', tarot: 'ಟ್ಯಾರೋ', services: 'ಸೇವೆಗಳು' },
    profile: { guestName: 'ಅತಿಥಿ', greeting: 'ನಮಸ್ಕಾರ' },
    services: {
      dailyHoroscope_title: 'ದೈನಂದಿನ ರಾಶಿಫಲ',
      dailyHoroscope_desc: 'ಇಂದಿನ ನಕ್ಷತ್ರ ಸಂದೇಶ',
      kundli_title: 'ಉಚಿತ ಕುಂಡಲಿ',
      kundli_desc: 'ನಿಮ್ಮ ಜನ್ಮ ಚಾರ್ಟ್ ಪಡೆಯಿರಿ',
      matching_title: 'ಸಂಗತತೆ ಮ್ಯಾಚ್',
      matching_desc: 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಮ್ಯಾಚ್ ಹುಡುಕಿ',
      tarot_title: 'ಟ್ಯಾರೋ ರೀಡಿಂಗ್',
      tarot_desc: 'ಮರೆಮಾಚಿದ ಉತ್ತರಗಳನ್ನು ತೆರೆದುಕೊಳ್ಳಿ'
    },
    pages: { priestServices_title: 'ಪೂಜಾರಿ ಸೇವೆಗಳು', priestServices_subtitle: 'ಪೂಜಾರಿಗಳನ್ನು ಬುಕ್ ಮಾಡಿ, ಕಿಟ್ ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಬುಕ್ಕಿಂಗ್ ನಿರ್ವಹಿಸಿ.' }
  },
  ml: {
    ui: { language: 'ഭാഷ', close: 'അടയ്‌ക്കുക', bookNow: 'ബുക്ക് ചെയ്യുക' },
    brand: { tagline: 'പ്രീമിയം കോസ്മിക് മാർഗ്ഗനിർദേശം' },
    hero: {
      headlineA: 'ഇന്ത്യയിലെ',
      headlineB: 'മികച്ച ജ്യോതിഷന്മാരുമായി ബന്ധപ്പെടുക',
      subtitle: 'പ്രേമം, കരിയർ, ആരോഗ്യം എന്നിവയിൽ ഉടൻ മാർഗ്ഗനിർദേശം — സ്ഥിരീകരിച്ച വൈദിക വിദഗ്ധരിൽ നിന്ന്.',
      cta: 'ആദ്യ ചാറ്റ് സൗജന്യം'
    },
    nav: { chat: 'ചാറ്റ്', talk: 'കോൾ', kundli: 'സൗജന്യ കുണ്ടലി', matching: 'മാച്ചിംഗ്', horoscope: 'ദൈനിക രാശിഫലം', tarot: 'ടാരോട്ട്', services: 'സേവനങ്ങൾ' },
    profile: { guestName: 'അതിഥി', greeting: 'നമസ്കാരം' },
    services: {
      dailyHoroscope_title: 'ദൈനിക രാശിഫലം',
      dailyHoroscope_desc: 'ഇന്ന് നക്ഷത്രങ്ങൾ പറയുന്നത്',
      kundli_title: 'സൗജന്യ കുണ്ടലി',
      kundli_desc: 'നിങ്ങളുടെ ജന്മചാർട്ട് നേടുക',
      matching_title: 'സംഗതി മാച്ച്',
      matching_desc: 'നിങ്ങളുടെ പർഫെക്റ്റ് മാച്ച് കണ്ടെത്തുക',
      tarot_title: 'ടാരോട്ട് റീഡിംഗ്',
      tarot_desc: 'മറഞ്ഞ ഉത്തരങ്ങൾ കണ്ടെത്തുക'
    },
    pages: { priestServices_title: 'പൂജാരി സേവനങ്ങൾ', priestServices_subtitle: 'പൂജാരികളെ ബുക്ക് ചെയ്യുക, കിറ്റുകൾ തിരഞ്ഞെടുക്കുക, ബുക്കിംഗ് മാനേജുചെയ്യുക.' }
  },
  or: {
    ui: { language: 'ଭାଷା', close: 'ବନ୍ଦ', bookNow: 'ବୁକ୍ କରନ୍ତୁ' },
    brand: { tagline: 'ପ୍ରିମିୟମ କୋସ୍ମିକ୍ ଗାଇଡେନ୍ସ' },
    hero: {
      headlineA: 'ଭାରତର',
      headlineB: 'ଶ୍ରେଷ୍ଠ ଜ୍ୟୋତିଷମାନଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ',
      subtitle: 'ପ୍ରେମ, କ୍ୟାରିଅର, ସ୍ୱାସ୍ଥ୍ୟ ଇତ୍ୟାଦିରେ ତୁରନ୍ତ ମାର୍ଗଦର୍ଶନ — ସତ୍ୟାପିତ ବୈଦିକ ବିଶେଷଜ୍ଞମାନଙ୍କ ଠାରୁ।',
      cta: 'ପ୍ରଥମ ଚ୍ୟାଟ୍ ମାଗଣା'
    },
    nav: { chat: 'ଚ୍ୟାଟ୍', talk: 'କଲ୍', kundli: 'ନି:ଶୁଳ୍କ କୁଣ୍ଡଳୀ', matching: 'ମ୍ୟାଚିଂ', horoscope: 'ଦୈନିକ ରାଶିଫଳ', tarot: 'ଟାରୋଟ୍', services: 'ସେବା' },
    profile: { guestName: 'ଅତିଥି', greeting: 'ନମସ୍କାର' },
    services: {
      dailyHoroscope_title: 'ଦୈନିକ ରାଶିଫଳ',
      dailyHoroscope_desc: 'ଆଜି ତାରାମାନେ କ’ଣ କହୁଛନ୍ତି',
      kundli_title: 'ନି:ଶୁଳ୍କ କୁଣ୍ଡଳୀ',
      kundli_desc: 'ଆପଣଙ୍କ ଜନ୍ମ ଚାର୍ଟ ପାଆନ୍ତୁ',
      matching_title: 'ସଙ୍ଗତି ମ୍ୟାଚ୍',
      matching_desc: 'ଆପଣଙ୍କ ପରିପୂର୍ଣ୍ଣ ମ୍ୟାଚ୍ ଖୋଜନ୍ତୁ',
      tarot_title: 'ଟାରୋଟ୍ ରିଡିଂ',
      tarot_desc: 'ଲୁଚିଥିବା ଉତ୍ତର ଖୋଲନ୍ତୁ'
    },
    pages: { priestServices_title: 'ପୁଜାରୀ ସେବା', priestServices_subtitle: 'ପୁଜାରୀ ବୁକ୍ କରନ୍ତୁ, କିଟ୍ ଚୟନ କରନ୍ତୁ ଏବଂ ବୁକିଂ ମ୍ୟାନେଜ୍ କରନ୍ତୁ।' }
  },
  pa: {
    ui: { language: 'ਭਾਸ਼ਾ', close: 'ਬੰਦ ਕਰੋ', bookNow: 'ਬੁੱਕ ਕਰੋ' },
    brand: { tagline: 'ਪ੍ਰੀਮੀਅਮ ਕੋਸਮਿਕ ਗਾਈਡੈਂਸ' },
    hero: {
      headlineA: 'ਭਾਰਤ ਦੇ',
      headlineB: 'ਸਭ ਤੋਂ ਵਧੀਆ ਜੋਤਿਸ਼ੀਆਂ ਨਾਲ ਜੁੜੋ',
      subtitle: 'ਪਿਆਰ, ਕਰੀਅਰ, ਸਿਹਤ ਆਦਿ ਲਈ ਤੁਰੰਤ ਮਾਰਗਦਰਸ਼ਨ—ਤਸਦੀਕਸ਼ੁਦਾ ਵੇਦਿਕ ਮਾਹਿਰਾਂ ਤੋਂ।',
      cta: 'ਪਹਿਲੀ ਚੈਟ ਮੁਫ਼ਤ'
    },
    nav: { chat: 'ਚੈਟ', talk: 'ਕਾਲ', kundli: 'ਮੁਫ਼ਤ ਕੁੰਡਲੀ', matching: 'ਮੇਚਿੰਗ', horoscope: 'ਰੋਜ਼ਾਨਾ ਰਾਸ਼ਿਫਲ', tarot: 'ਟੈਰੋਟ', services: 'ਸੇਵਾਵਾਂ' },
    profile: { guestName: 'ਮਿਹਮਾਨ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
    services: {
      dailyHoroscope_title: 'ਰੋਜ਼ਾਨਾ ਰਾਸ਼ਿਫਲ',
      dailyHoroscope_desc: 'ਅੱਜ ਤਾਰੇ ਕੀ ਕਹਿੰਦੇ ਹਨ',
      kundli_title: 'ਮੁਫ਼ਤ ਕੁੰਡਲੀ',
      kundli_desc: 'ਆਪਣਾ ਜਨਮ ਚਾਰਟ ਲਵੋ',
      matching_title: 'ਅਨੁਕੂਲਤਾ ਮੇਚ',
      matching_desc: 'ਆਪਣਾ ਪਰਫੈਕਟ ਮੇਚ ਲੱਭੋ',
      tarot_title: 'ਟੈਰੋਟ ਰੀਡਿੰਗ',
      tarot_desc: 'ਛੁਪੇ ਜਵਾਬ ਖੋਲ੍ਹੋ'
    },
    pages: { priestServices_title: 'ਪੁਜਾਰੀ ਸੇਵਾਵਾਂ', priestServices_subtitle: 'ਪੁਜਾਰੀ ਬੁੱਕ ਕਰੋ, ਕਿਟ ਚੁਣੋ ਅਤੇ ਬੁਕਿੰਗ ਮੈਨੇਜ ਕਰੋ।' }
  },
  as: {
    ui: { language: 'ভাষা', close: 'বন্ধ', bookNow: 'বুক কৰক' },
    brand: { tagline: 'প্ৰিমিয়াম মহাজাগতিক দিশনিৰ্ণয়' },
    hero: {
      headlineA: 'ভাৰতৰ',
      headlineB: 'সৰ্বোৎকৃষ্ট জ্যোতিষীৰ সৈতে সংযোগ কৰক',
      subtitle: 'প্ৰেম, কেৰিয়াৰ, স্বাস্থ্য আদি বিষয়ে তৎক্ষণাত দিশনিৰ্ণয়—প্ৰমাণিত বৈদিক বিশেষজ্ঞৰ পৰা।',
      cta: 'প্ৰথম চাট ফ্ৰী'
    },
    nav: { chat: 'চাট', talk: 'কল', kundli: 'বিনামূলীয়া কুণ্ডলী', matching: 'মেচিং', horoscope: 'দৈনিক ৰাশিফল', tarot: 'টাৰট', services: 'সেৱা' },
    profile: { guestName: 'অতিথি', greeting: 'নমস্কাৰ' },
    services: {
      dailyHoroscope_title: 'দৈনিক ৰাশিফল',
      dailyHoroscope_desc: 'আজিৰ তৰাই কি কয়',
      kundli_title: 'বিনামূলীয়া কুণ্ডলী',
      kundli_desc: 'আপোনাৰ জন্ম চাৰ্ট লাভ কৰক',
      matching_title: 'সামঞ্জস্য মেচ',
      matching_desc: 'আপোনাৰ পৰিপূৰ্ণ মেচ বিচাৰক',
      tarot_title: 'টাৰট ৰিডিং',
      tarot_desc: 'লুকাই থকা উত্তৰ উলিয়াওক'
    },
    pages: { priestServices_title: 'পুৰোহিত সেৱা', priestServices_subtitle: 'পুৰোহিত বুক কৰক, কিট বাছক আৰু বুকিং মেনেজ কৰক।' }
  },
  mai: {
    ui: { language: 'भाषा', close: 'बंद', bookNow: 'बुक करू' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारत के',
      headlineB: 'सर्वश्रेष्ठ ज्योतिषी सँ जुड़ू',
      subtitle: 'प्रेम, करियर, स्वास्थ्य आदि पर त्वरित मार्गदर्शन पाउ — सत्यापित वैदिक विशेषज्ञ सँ।',
      cta: 'पहिल चैट फ्री'
    },
    nav: { chat: 'चैट', talk: 'कॉल', kundli: 'नि:शुल्क कुंडली', matching: 'मिलान', horoscope: 'दैनिक राशिफल', tarot: 'टैरो', services: 'सेवा' },
    profile: { guestName: 'अतिथि', greeting: 'नमस्कार' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'आजक तारा की कहैत अछि',
      kundli_title: 'नि:शुल्क कुंडली',
      kundli_desc: 'अपन जन्म चार्ट पाउ',
      matching_title: 'संगति मिलान',
      matching_desc: 'अपन परफेक्ट मैच खोजू',
      tarot_title: 'टैरो रीडिंग',
      tarot_desc: 'लुकल उत्तर खोलू'
    },
    pages: { priestServices_title: 'पुजारी सेवा', priestServices_subtitle: 'पुजारी बुक करू, किट चुनू आ बुकिंग मैनेज करू।' }
  },
  doi: {
    ui: { language: 'भाषा', close: 'बंद', bookNow: 'बुक करो' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारत दे',
      headlineB: 'सबतों वधिया ज्योतिशियें नै जुड़ो',
      subtitle: 'प्यार, करियर, सेहत आदे बारे फौरन मार्गदर्शन — सत्यापित वैदिक विशेषज्ञें कन्नै।',
      cta: 'पहिली चैट फ्री'
    },
    nav: { chat: 'चैट', talk: 'कॉल', kundli: 'मुफ्त कुंडली', matching: 'मैचिंग', horoscope: 'दैनिक राशिफल', tarot: 'टैरो', services: 'सेवा' },
    profile: { guestName: 'मेहमान', greeting: 'नमस्कार' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'अज्ज तारे की आखदे न',
      kundli_title: 'मुफ्त कुंडली',
      kundli_desc: 'अपना जनम चार्ट लाओ',
      matching_title: 'संगति मैच',
      matching_desc: 'अपना परफेक्ट मैच लब्भो',
      tarot_title: 'टैरो रीडिंग',
      tarot_desc: 'छुपे जवाब खोजो'
    },
    pages: { priestServices_title: 'पुजारी सेवा', priestServices_subtitle: 'पुजारी बुक करो, किट चुनो ते बुकिंग मैनेज करो।' }
  },
  ks: {
    ui: { language: 'زَبان', close: 'بند', bookNow: 'بُک کَرٕو' },
    brand: { tagline: 'پریمیَم کاسْمِک گایڈَنٛس' },
    hero: {
      headlineA: 'ہِندُس',
      headlineB: 'بہترین جوتِشیٖن سٕتھ جُڑٕو',
      subtitle: 'محبت، کیریئر، صحت وغیرہ بابت فوری رہنمائی — تصدیق شدہ ویدک ماہرن ہُنٛد۔',
      cta: 'پہلا چیٹ مفت'
    },
    nav: { chat: 'چیٹ', talk: 'کال', kundli: 'مفت کنڈلی', matching: 'میچنگ', horoscope: 'روزانہ رشِفل', tarot: 'ٹاروٹ', services: 'سروسز' },
    profile: { guestName: 'مہمان', greeting: 'نمستے' },
    services: {
      dailyHoroscope_title: 'روزانہ رشِفل',
      dailyHoroscope_desc: 'آج ستارے کیا کہنٛد',
      kundli_title: 'مفت کنڈلی',
      kundli_desc: 'پنُن جنم چارٹ حاصل کٔرٕو',
      matching_title: 'موافقت میچ',
      matching_desc: 'پنُن پرفیکٹ میچ پَتہ کرٕو',
      tarot_title: 'ٹاروٹ ریڈنگ',
      tarot_desc: 'لُکایہ جواب کھولٕو'
    },
    pages: { priestServices_title: 'پُجاری سروسز', priestServices_subtitle: 'پُجاری بُک کرٕو، کِٹ چُنٕو تٕہ بُکنگ مَنیج کرٕو۔' }
  },
  kok: {
    ui: { language: 'भास', close: 'बंद', bookNow: 'बुक करात' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारताचे',
      headlineB: 'सर्वोत्कृष्ट ज्योतिशां कडेन जोडीं',
      subtitle: 'प्रेम, करियर, आरोग्य आदी बाबतींत तातडीचें मार्गदर्शन — सत्यापित वैदिक तज्ञांकडेन.',
      cta: 'पयली चॅट फ्री'
    },
    nav: { chat: 'चॅट', talk: 'कॉल', kundli: 'फुकट कुंडली', matching: 'मॅचिंग', horoscope: 'दैनिक राशीभविष्य', tarot: 'टॅरो', services: 'सेवा' },
    profile: { guestName: 'अतिथी', greeting: 'नमस्कार' },
    services: {
      dailyHoroscope_title: 'दैनिक राशीभविष्य',
      dailyHoroscope_desc: 'आज तारे काय सांगतात',
      kundli_title: 'फुकट कुंडली',
      kundli_desc: 'तुमचो जन्म चार्ट मेळो',
      matching_title: 'सुसंगतता मॅच',
      matching_desc: 'तुमचो परफेक्ट मॅच सोदात',
      tarot_title: 'टॅरो रीडिंग',
      tarot_desc: 'लपिल्ले उत्तर उगडात'
    },
    pages: { priestServices_title: 'पुरोहित सेवा', priestServices_subtitle: 'पुरोहित बुक करात, किट निवडात आनी बुकिंग मॅनेज करात.' }
  },
  mni: {
    ui: { language: 'লোন', close: 'ক্লোজ', bookNow: 'বুক তৌ' },
    brand: { tagline: 'প্রিমিয়াম কোসমিক গাইডেন্স' },
    hero: {
      headlineA: 'ইন্ডিয়াগী',
      headlineB: 'বেষ্ট জ্যোতিষীশিংগা কান্না লৌ',
      subtitle: 'লভ, কেরিয়ার, হেলথ ইত্যাদি বিষয়ে ফ্রেশ পরামর্শ — ভেরিফাইড বৈদিক এক্সপার্টস-সিংগী।',
      cta: 'ফার্স্ট চ্যাট ফ্রী'
    },
    nav: { chat: 'চ্যাট', talk: 'কল', kundli: 'ফ্রি কুন্ডলী', matching: 'ম্যাচিং', horoscope: 'ডেইলি হোরোস্কোপ', tarot: 'টারোট', services: 'সার্ভিস' },
    profile: { guestName: 'গেস্ট', greeting: 'খুরুমজরি' },
    services: {
      dailyHoroscope_title: 'ডেইলি হোরোস্কোপ',
      dailyHoroscope_desc: 'নঙাই নক্ষত্রশিংনা করিবা',
      kundli_title: 'ফ্রি কুন্ডলী',
      kundli_desc: 'নঙাই বার্থ চার্ট ফংউ',
      matching_title: 'কম্প্যাটিবিলিটি ম্যাচ',
      matching_desc: 'নঙাই পারফেক্ট ম্যাচ ফংউ',
      tarot_title: 'টারোট রিডিং',
      tarot_desc: 'লুকানবা উত্তরশিং খঙউ'
    },
    pages: { priestServices_title: 'প্রিস্ট সার্ভিস', priestServices_subtitle: 'প্রিস্ট বুক তৌ, কিট খল্লু, বুকিং মেনেজ তৌ।' }
  },
  ne: {
    ui: { language: 'भाषा', close: 'बन्द', bookNow: 'बुक गर्नुहोस्' },
    brand: { tagline: 'प्रिमियम ब्रह्माण्डीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारतका',
      headlineB: 'सर्वश्रेष्ठ ज्योतिषीसँग जोडिनुहोस्',
      subtitle: 'प्रेम, करियर, स्वास्थ्य आदि विषयमा तुरुन्त मार्गदर्शन—प्रमाणित वैदिक विशेषज्ञबाट।',
      cta: 'पहिलो च्याट निःशुल्क'
    },
    nav: { chat: 'च्याट', talk: 'कल', kundli: 'निःशुल्क कुण्डली', matching: 'म्याचिङ', horoscope: 'दैनिक राशिफल', tarot: 'ट्यारोट', services: 'सेवाहरू' },
    profile: { guestName: 'अतिथि', greeting: 'नमस्ते' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'आज ताराहरू के भन्छन्',
      kundli_title: 'निःशुल्क कुण्डली',
      kundli_desc: 'आफ्नो जन्म चार्ट पाउनुहोस्',
      matching_title: 'अनुकूलता म्याच',
      matching_desc: 'आफ्नो परफेक्ट म्याच खोज्नुहोस्',
      tarot_title: 'ट्यारोट रिडिङ',
      tarot_desc: 'लुकेका उत्तर खोल्नुहोस्'
    },
    pages: { priestServices_title: 'पुजारी सेवाहरू', priestServices_subtitle: 'पुजारी बुक गर्नुहोस्, किट छान्नुहोस् र बुकिङ व्यवस्थापन गर्नुहोस्।' }
  },
  sa: {
    ui: { language: 'भाषा', close: 'बन्द', bookNow: 'आरक्ष्यताम्' },
    brand: { tagline: 'उत्तमं ब्रह्माण्डीयं मार्गदर्शनम्' },
    hero: {
      headlineA: 'भारतस्य',
      headlineB: 'श्रेष्ठैः ज्योतिषिभिः सह संयोज्यताम्',
      subtitle: 'प्रेम, कर्म, आरोग्यादिषु त्वरितं मार्गदर्शनं — प्रमाणितैः वैदिकविशेषज्ञैः।',
      cta: 'प्रथमः संवादः निःशुल्कः'
    },
    nav: { chat: 'चैट्', talk: 'कॉल', kundli: 'निःशुल्क कुण्डली', matching: 'मेलनम्', horoscope: 'दैनिकं राशिफलम्', tarot: 'टैरो', services: 'सेवाः' },
    profile: { guestName: 'अतिथिः', greeting: 'नमस्ते' },
    services: {
      dailyHoroscope_title: 'दैनिकं राशिफलम्',
      dailyHoroscope_desc: 'अद्य ताराः किं वदन्ति',
      kundli_title: 'निःशुल्क कुण्डली',
      kundli_desc: 'जन्म-चार्टं प्राप्नुयात्',
      matching_title: 'सामञ्जस्य-मेलनम्',
      matching_desc: 'परिपूर्णं मेलनं शोधयतु',
      tarot_title: 'टैरो पठनम्',
      tarot_desc: 'गूढोत्तराणि उन्मोचयतु'
    },
    pages: { priestServices_title: 'पूजारि-सेवाः', priestServices_subtitle: 'पूजारिणः आरक्ष्यताम्, किट् चयन्यताम्, आरक्षणानि व्यवस्थाप्यन्ताम्।' }
  },
  sat: {
    ui: { language: 'ᱯᱟᱹᱨᱥᱤ', close: 'ᱵᱚᱱᱫ', bookNow: 'ᱵᱩᱠ ᱠᱚ' },
    brand: { tagline: 'ᱯᱨᱤᱢᱤᱭᱟᱢ ᱠᱳᱥᱢᱤᱠ ᱜᱟᱭᱰᱮᱱᱥ' },
    hero: {
      headlineA: 'ᱵᱷᱟᱨᱚᱛ ᱨᱮ',
      headlineB: 'ᱟᱹᱫᱤ ᱵᱮᱥᱛ ᱡᱳᱛᱤᱥᱤ ᱥᱟᱶ ᱡᱩᱲᱟᱹᱣ',
      subtitle: 'ᱞᱟᱹᱵ, ᱠᱮᱨᱤᱭᱟᱨ, ᱥᱮᱦᱛ ᱟᱫᱤ ᱵᱤᱥᱚᱭ ᱨᱮ ᱛᱚᱨᱚᱛ ᱜᱟᱭᱰᱮᱱᱥ — ᱵᱷᱮᱨᱤᱯᱟᱭᱰ ᱵᱮᱫᱤᱠ ᱮᱠᱥᱯᱟᱨᱴ ᱠᱚ ᱴᱷᱮᱱᱛᱮᱭ.',
      cta: 'ᱯᱩᱦᱞᱟᱹ ᱪᱷᱮᱴ ᱢᱟᱜᱟᱱᱟ'
    },
    nav: { chat: 'ᱪᱷᱮᱴ', talk: 'ᱠᱚᱞ', kundli: 'ᱢᱚᱯᱷᱚᱛ ᱠᱩᱱᱰᱞᱤ', matching: 'ᱢᱮᱪᱤᱝ', horoscope: 'ᱫᱤᱱᱟᱹᱠ ᱨᱟᱥᱤᱯᱷᱚᱞ', tarot: 'ᱴᱟᱨᱳᱴ', services: 'ᱥᱮᱵᱟ' },
    profile: { guestName: 'ᱜᱮᱥᱴ', greeting: 'ᱡᱚᱦᱟᱨ' },
    services: {
      dailyHoroscope_title: 'ᱫᱤᱱᱟᱹᱠ ᱨᱟᱥᱤᱯᱷᱚᱞ',
      dailyHoroscope_desc: 'ᱛᱮᱦᱟᱸ ᱱᱟᱠᱥᱚᱛᱨᱚ ᱪᱮᱫ ᱠᱟᱛᱷᱟ ᱠᱟᱱᱟ',
      kundli_title: 'ᱢᱚᱯᱷᱚᱛ ᱠᱩᱱᱰᱞᱤ',
      kundli_desc: 'ᱟᱢᱟᱜ ᱡᱚᱱᱚᱢ ᱪᱟᱨᱴ ᱧᱟᱢ',
      matching_title: 'ᱠᱚᱢᱯᱮᱴᱤᱵᱤᱞᱤᱴᱤ ᱢᱮᱪ',
      matching_desc: 'ᱟᱢᱟᱜ ᱯᱟᱨᱯᱷᱮᱠᱴ ᱢᱮᱪ ᱧᱟᱢ',
      tarot_title: 'ᱴᱟᱨᱳᱴ ᱨᱤᱰᱤᱝ',
      tarot_desc: 'ᱩᱠᱩᱭ ᱩᱛᱛᱚᱨ ᱧᱟᱢ'
    },
    pages: { priestServices_title: 'ᱯᱩᱡᱟᱹᱨᱤ ᱥᱮᱵᱟ', priestServices_subtitle: 'ᱯᱩᱡᱟᱹᱨᱤ ᱵᱩᱠ ᱠᱚ, ᱠᱤᱴ ᱪᱚᱭᱚᱱ ᱠᱚ ᱟᱨ ᱵᱩᱠᱤᱝ ᱢᱮᱱᱮᱡ ᱠᱚ.' }
  },
  sd: {
    ui: { language: 'ٻولي', close: 'بند', bookNow: 'بُڪ ڪريو' },
    brand: { tagline: 'پريميئم ڪاسميڪ رهنمائي' },
    hero: {
      headlineA: 'ڀارت جي',
      headlineB: 'بهترين جوتشين سان ڳنڍيو',
      subtitle: 'پيار، ڪيريئر، صحت وغيره بابت فوري رهنمائي — تصديق ٿيل ويدڪ ماهرن کان.',
      cta: 'پهرين چيٽ مفت'
    },
    nav: { chat: 'چيٽ', talk: 'ڪال', kundli: 'مفت ڪنڊلي', matching: 'ميچنگ', horoscope: 'روزانو راشيفل', tarot: 'ٽاروٽ', services: 'خدمتون' },
    profile: { guestName: 'مهمان', greeting: 'سلام' },
    services: {
      dailyHoroscope_title: 'روزانو راشيفل',
      dailyHoroscope_desc: 'اڄ تارا ڇا چون ٿا',
      kundli_title: 'مفت ڪنڊلي',
      kundli_desc: 'پنهنجو جنم چارٽ حاصل ڪريو',
      matching_title: 'مطابقت ميچ',
      matching_desc: 'پنهنجو پرفيڪٽ ميچ ڳوليو',
      tarot_title: 'ٽاروٽ ريڊنگ',
      tarot_desc: 'لڪيل جواب کوليو'
    },
    pages: { priestServices_title: 'پجاري خدمتون', priestServices_subtitle: 'پجاري بڪ ڪريو، ڪٽ چونڊيو ۽ بڪنگ سنڀاليو.' }
  },
  ur: {
    ui: { language: 'زبان', close: 'بند کریں', bookNow: 'بک کریں' },
    brand: { tagline: 'پریمیم کاسمک گائیڈنس' },
    hero: {
      headlineA: 'بھارت کے',
      headlineB: 'بہترین نجومیوں سے جڑیں',
      subtitle: 'محبت، کیریئر، صحت وغیرہ پر فوری رہنمائی—تصدیق شدہ ویدک ماہرین سے۔',
      cta: 'پہلی چیٹ مفت'
    },
    nav: { chat: 'چیٹ', talk: 'کال', kundli: 'مفت کنڈلی', matching: 'میچنگ', horoscope: 'روزانہ زائچہ', tarot: 'ٹاروٹ', services: 'خدمات' },
    profile: { guestName: 'مہمان', greeting: 'السلام علیکم' },
    services: {
      dailyHoroscope_title: 'روزانہ زائچہ',
      dailyHoroscope_desc: 'آج ستارے کیا کہتے ہیں',
      kundli_title: 'مفت کنڈلی',
      kundli_desc: 'اپنا پیدائشی چارٹ حاصل کریں',
      matching_title: 'مطابقت میچ',
      matching_desc: 'اپنا بہترین میچ تلاش کریں',
      tarot_title: 'ٹاروٹ ریڈنگ',
      tarot_desc: 'چھپے جواب کھولیں'
    },
    pages: { priestServices_title: 'پجاری خدمات', priestServices_subtitle: 'پجاری بک کریں، کٹس منتخب کریں اور بکنگ مینیج کریں۔' }
  },
  bho: {
    ui: { language: 'भाषा', close: 'बंद', bookNow: 'बुक करीं' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारत के',
      headlineB: 'सबसे बढ़िया ज्योतिषियन से जुड़ीं',
      subtitle: 'प्यार, करियर, सेहत वगैरह पर तुरन्त सलाह — सत्यापित वैदिक विशेषज्ञ से।',
      cta: 'पहिली चैट फ्री'
    },
    nav: { chat: 'चैट', talk: 'कॉल', kundli: 'फ्री कुंडली', matching: 'मैचिंग', horoscope: 'दैनिक राशिफल', tarot: 'टैरो', services: 'सेवा' },
    profile: { guestName: 'मेहमान', greeting: 'नमस्ते' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'आज तारा का कहत बा',
      kundli_title: 'फ्री कुंडली',
      kundli_desc: 'अपना जनम चार्ट पाईं',
      matching_title: 'संगति मैच',
      matching_desc: 'अपना परफेक्ट मैच खोजीं',
      tarot_title: 'टैरो रीडिंग',
      tarot_desc: 'छुपल जवाब खोलीं'
    },
    pages: { priestServices_title: 'पुजारी सेवा', priestServices_subtitle: 'पुजारी बुक करीं, किट चुनीं आ बुकिंग मैनेज करीं।' }
  },
  mwr: {
    ui: { language: 'भाषा', close: 'बंद', bookNow: 'बुक करो' },
    brand: { tagline: 'प्रीमियम ब्रह्मांडीय मार्गदर्शन' },
    hero: {
      headlineA: 'भारत रे',
      headlineB: 'बेस्ट ज्योतिषियां सूं जुड़ो',
      subtitle: 'प्यार, करियर, सेहत वगैरह पर तुरंत मार्गदर्शन — सत्यापित वैदिक विशेषज्ञां सूं।',
      cta: 'पहली चैट फ्री'
    },
    nav: { chat: 'चैट', talk: 'कॉल', kundli: 'फ्री कुंडली', matching: 'मैचिंग', horoscope: 'दैनिक राशिफल', tarot: 'टैरो', services: 'सेवां' },
    profile: { guestName: 'मेहमान', greeting: 'राम राम सा' },
    services: {
      dailyHoroscope_title: 'दैनिक राशिफल',
      dailyHoroscope_desc: 'आज तारा क्या कहै',
      kundli_title: 'फ्री कुंडली',
      kundli_desc: 'आपरो जनम चार्ट पावो',
      matching_title: 'संगति मैच',
      matching_desc: 'आपरो परफेक्ट मैच खोजो',
      tarot_title: 'टैरो रीडिंग',
      tarot_desc: 'छुप्या जवाब खोलो'
    },
    pages: { priestServices_title: 'पुजारी सेवां', priestServices_subtitle: 'पुजारी बुक करो, किट चुनो अर बुकिंग मैनेज करो।' }
  }
};

const locales = [
  'hi','bn','mr','te','ta','gu','kn','ml','or','pa','as','mai','doi','ks','kok','mni','ne','sa','sat','sd','ur','bho','mwr'
];

const outDir = path.join(process.cwd(), 'messages');
await fs.mkdir(outDir, { recursive: true });

for (const locale of locales) {
  const merged = structuredClone(base);
  const overrides = t[locale] || {};
  // deep merge
  for (const [k1, v1] of Object.entries(overrides)) {
    if (v1 && typeof v1 === 'object' && !Array.isArray(v1)) {
      merged[k1] = { ...(merged[k1] || {}), ...v1 };
    } else {
      merged[k1] = v1;
    }
  }

  // ensure brand name constant
  merged.brand.name = 'AstroVeda';

  // If locale missing, keep English base but at least translate nav labels using simple transliteration.
  // (In this script we covered all locales.)

  await fs.writeFile(path.join(outDir, `${locale}.json`), JSON.stringify(merged, null, 2) + '\n', 'utf8');
}

console.log('Wrote messages for', locales.length, 'locales →', outDir);
