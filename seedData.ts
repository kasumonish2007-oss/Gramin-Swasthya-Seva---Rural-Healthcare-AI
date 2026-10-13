export interface SeedHospital {
  _id: string;
  name: string;
  facilityType: 'PHC' | 'CHC' | 'District Hospital' | 'Sub-Centre' | 'Jan Aushadhi' | 'Clinic';
  state: string;
  district: string;
  taluk?: string;
  village?: string;
  pincode: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  emergencyPhone?: string;
  emergency24x7: boolean;
  beds: number;
  oxygenAvailable: boolean;
  ayushmanEmpanelled: boolean;
  services: string[];
  timings: string;
}

export interface SeedDoctor {
  _id: string;
  name: string;
  speciality: string;
  qualification: string;
  hospitalName: string;
  experienceYears: number;
  languages: string[];
  fee: number;
  teleconsultAvailable: boolean;
  availableDays: string[];
  timing: string;
  rating: number;
  avatarUrl?: string;
}

export interface SeedArticle {
  _id: string;
  articleId: string;
  category: string;
  titleEn: string;
  titleHi: string;
  titleTe: string;
  summaryEn: string;
  summaryHi: string;
  summaryTe: string;
  contentEn: string;
  contentHi: string;
  contentTe: string;
  keyTips: string[];
  readTimeMinutes: number;
  tag: string;
}

export const INITIAL_HOSPITALS: SeedHospital[] = [
  {
    _id: 'hosp-1',
    name: 'Shamshabad Community Health Centre (CHC)',
    facilityType: 'CHC',
    state: 'Telangana',
    district: 'Ranga Reddy',
    taluk: 'Shamshabad',
    village: 'Shamshabad Rural',
    pincode: '501218',
    lat: 17.2582,
    lng: 78.3965,
    address: 'Main Road, Near Old Bus Stand, Shamshabad, Telangana 501218',
    phone: '+91 8413 222108',
    emergencyPhone: '108',
    emergency24x7: true,
    beds: 30,
    oxygenAvailable: true,
    ayushmanEmpanelled: true,
    services: ['24x7 Emergency Delivery', 'General Surgery', 'Pediatrics', 'X-Ray & Basic Lab', 'Janani Suraksha Yojana'],
    timings: '24 Hours Emergency, OPD: 9:00 AM - 2:00 PM',
  },
  {
    _id: 'hosp-2',
    name: 'Shabad Primary Health Centre (PHC)',
    facilityType: 'PHC',
    state: 'Telangana',
    district: 'Ranga Reddy',
    taluk: 'Shabad',
    village: 'Shabad Village',
    pincode: '509217',
    lat: 17.1852,
    lng: 78.1425,
    address: 'Opposite Mandal Parishad Office, Shabad Village, Telangana 509217',
    phone: '+91 8417 244102',
    emergencyPhone: '108',
    emergency24x7: true,
    beds: 6,
    oxygenAvailable: true,
    ayushmanEmpanelled: true,
    services: ['Maternal & Child Health', 'Routine Immunization', 'TB DOTS Centre', 'Free Essential Medicines', 'Tele-Consultation Room'],
    timings: 'OPD: 9:00 AM - 4:00 PM (Emergency 24x7)',
  },
  {
    _id: 'hosp-3',
    name: 'Pradhana Mantri Jan Aushadhi Kendra - Rural Outlet',
    facilityType: 'Jan Aushadhi',
    state: 'Telangana',
    district: 'Ranga Reddy',
    taluk: 'Chevella',
    village: 'Chevella Town',
    pincode: '501503',
    lat: 17.3102,
    lng: 78.1362,
    address: 'Near Ambedkar Statue, Bus Stand Road, Chevella, Telangana 501503',
    phone: '+91 94401 88921',
    emergencyPhone: '112',
    emergency24x7: false,
    beds: 0,
    oxygenAvailable: false,
    ayushmanEmpanelled: false,
    services: ['Generic Medicines at 50-90% Discount', 'ORS & Zinc Supplements', 'Maternal Iron Folic Acid', 'BP & Blood Sugar Screening'],
    timings: '8:30 AM - 8:30 PM (Mon-Sat)',
  },
  {
    _id: 'hosp-4',
    name: 'Mahabubnagar Government General Hospital (District Hospital)',
    facilityType: 'District Hospital',
    state: 'Telangana',
    district: 'Mahabubnagar',
    taluk: 'Mahabubnagar Urban',
    village: 'Bhoothpur Road',
    pincode: '509001',
    lat: 16.7488,
    lng: 78.0035,
    address: 'Station Road, Beside Collectorate, Mahabubnagar, Telangana 509001',
    phone: '+91 8542 222100',
    emergencyPhone: '108',
    emergency24x7: true,
    beds: 350,
    oxygenAvailable: true,
    ayushmanEmpanelled: true,
    services: ['ICU & Critical Care', 'Blood Bank', 'Trauma Centre', 'Snakebite Anti-venom Ward', 'Dialysis Centre', 'Pediatric ICU'],
    timings: '24 Hours Open',
  },
  {
    _id: 'hosp-5',
    name: 'Arogya Sanjeevani Rural Wellness Sub-Centre',
    facilityType: 'Sub-Centre',
    state: 'Telangana',
    district: 'Vikarabad',
    taluk: 'Pargi',
    village: 'Domah Rural',
    pincode: '501502',
    lat: 17.0655,
    lng: 77.8920,
    address: 'Grama Panchayat Building Compound, Domah, Vikarabad, Telangana 501502',
    phone: '+91 94409 77123',
    emergencyPhone: '108',
    emergency24x7: false,
    beds: 2,
    oxygenAvailable: false,
    ayushmanEmpanelled: true,
    services: ['ANM & ASHA Worker Station', 'Antenatal Checkups', 'Child Growth Monitoring', 'First Aid & Wound Dressing'],
    timings: '9:00 AM - 1:00 PM, Field visits in afternoon',
  },
  {
    _id: 'hosp-6',
    name: 'Kothur Primary Health Centre',
    facilityType: 'PHC',
    state: 'Telangana',
    district: 'Ranga Reddy',
    taluk: 'Kothur',
    village: 'Kothur Industrial Bypass',
    pincode: '509228',
    lat: 17.1472,
    lng: 78.2912,
    address: 'Near ZPHS High School, NH 44 Service Road, Kothur, Telangana 509228',
    phone: '+91 8418 255201',
    emergencyPhone: '108',
    emergency24x7: true,
    beds: 10,
    oxygenAvailable: true,
    ayushmanEmpanelled: true,
    services: ['Emergency First-Aid', 'Minor Surgeries', 'Normal Delivery Care', 'Diagnostic Lab'],
    timings: 'OPD: 9:00 AM - 4:00 PM, Labor room 24x7',
  },
  {
    _id: 'hosp-7',
    name: 'Moinabad Gramin Health Clinic',
    facilityType: 'Clinic',
    state: 'Telangana',
    district: 'Ranga Reddy',
    taluk: 'Moinabad',
    village: 'Moinabad Mandal',
    pincode: '501504',
    lat: 17.3255,
    lng: 78.2785,
    address: 'Opposite Bus Depot, Main Highway, Moinabad, Telangana 501504',
    phone: '+91 98480 33411',
    emergencyPhone: '112',
    emergency24x7: false,
    beds: 4,
    oxygenAvailable: true,
    ayushmanEmpanelled: false,
    services: ['General Physician OPD', 'Nebulization', 'Pediatric Fever Management', 'Point-of-Care Blood Testing'],
    timings: '8:00 AM - 1:00 PM & 5:00 PM - 9:00 PM',
  },
  {
    _id: 'hosp-8',
    name: 'Vikarabad Area Hospital (CHC)',
    facilityType: 'CHC',
    state: 'Telangana',
    district: 'Vikarabad',
    taluk: 'Vikarabad',
    village: 'Vikarabad Town',
    pincode: '501101',
    lat: 17.3364,
    lng: 77.9048,
    address: 'Near Railway Station, Vikarabad, Telangana 501101',
    phone: '+91 8416 252033',
    emergencyPhone: '108',
    emergency24x7: true,
    beds: 50,
    oxygenAvailable: true,
    ayushmanEmpanelled: true,
    services: ['24x7 Emergency Casualty', 'Surgical Theatre', 'Gynecology & Obstetrics', 'Ultrasonography & ECG'],
    timings: '24 Hours Emergency Service',
  }
];

export const INITIAL_DOCTORS: SeedDoctor[] = [
  {
    _id: 'doc-1',
    name: 'Dr. Rameshwar Rao, MBBS, MD',
    speciality: 'General Medicine & Rural Health',
    qualification: 'MBBS (Osmania), MD (General Medicine)',
    hospitalName: 'Shamshabad Community Health Centre (CHC)',
    experienceYears: 14,
    languages: ['Telugu', 'Hindi', 'English'],
    fee: 0,
    teleconsultAvailable: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '9:00 AM - 1:30 PM & 3:00 PM - 5:00 PM',
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    _id: 'doc-2',
    name: 'Dr. Sunita Lakshmi, MBBS, DGO',
    speciality: 'Maternal & Women Health (Gynecology)',
    qualification: 'MBBS, DGO (Obstetrics & Gynecology)',
    hospitalName: 'Shabad Primary Health Centre (PHC)',
    experienceYears: 11,
    languages: ['Telugu', 'English', 'Hindi'],
    fee: 0,
    teleconsultAvailable: true,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '9:30 AM - 3:00 PM',
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813590-b184e917d23a?w=200&h=200&fit=crop&crop=faces',
  },
  {
    _id: 'doc-3',
    name: 'Dr. Anand Kumar Verma, MBBS, DCH',
    speciality: 'Pediatrics & Child Health',
    qualification: 'MBBS, DCH (Diploma in Child Health)',
    hospitalName: 'Mahabubnagar Government General Hospital',
    experienceYears: 9,
    languages: ['Hindi', 'Telugu', 'English'],
    fee: 0,
    teleconsultAvailable: true,
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '10:00 AM - 4:00 PM',
    rating: 4.8,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    _id: 'doc-4',
    name: 'Dr. K. Sravani, BAMS (Ayurveda)',
    speciality: 'Ayush & Preventive Community Medicine',
    qualification: 'BAMS (Government Ayurvedic College)',
    hospitalName: 'Moinabad Gramin Health Clinic',
    experienceYears: 7,
    languages: ['Telugu', 'Hindi'],
    fee: 50,
    teleconsultAvailable: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timing: '10:00 AM - 2:00 PM',
    rating: 4.7,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces',
  },
  {
    _id: 'doc-5',
    name: 'Dr. Mohammed Arif, MBBS',
    speciality: 'Emergency Triage & Infectious Diseases',
    qualification: 'MBBS, Fellowship in Emergency Medicine',
    hospitalName: 'Vikarabad Area Hospital (CHC)',
    experienceYears: 12,
    languages: ['Hindi', 'Urdu', 'Telugu', 'English'],
    fee: 0,
    teleconsultAvailable: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Sunday'],
    timing: '8:00 AM - 2:00 PM',
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=faces',
  }
];

export const INITIAL_ARTICLES: SeedArticle[] = [
  {
    _id: 'art-1',
    articleId: 'clean-water-diarrhea',
    category: 'Water & Hygiene',
    tag: 'Prevention',
    readTimeMinutes: 3,
    titleEn: 'Clean Water & Preventing Monsoon Diarrhea & Typhoid',
    titleHi: 'स्वच्छ जल और बारिश के मौसम में डायरिया तथा टाइफाइड से बचाव',
    titleTe: 'పరిశుభ్రమైన నీరు మరియు వర్షాకాలంలో డయేరియా, టైఫాయిడ్ నివారణ',
    summaryEn: 'How rural families can protect themselves against waterborne diseases using simple boiling, chlorine tablets, and ORS solution.',
    summaryHi: 'ग्रामीण परिवार पानी को 10 मिनट उबालकर, क्लोरीन गोलियों और ओआरएस के उपयोग से जलजनित रोगों से कैसे सुरक्षित रहें।',
    summaryTe: 'నీటిని మరిగించడం, క్లోరిన్ మాత్రలు మరియు ORS ద్రావణం వాడడం ద్వారా గ్రామీణ కుటుంబాలు నీటి సంబంధిత వ్యాధుల నుండి ఎలా రక్షించుకోవచ్చు.',
    contentEn: `In rural communities, monsoon floods and shallow well water often lead to bacterial contamination causing acute diarrhea, cholera, and typhoid. 

1. ALWAYS boil drinking water vigorously for at least 10 minutes, or use government-provided chlorine tablets (one 0.5g halazone tablet per 20 liters of water; wait 30 minutes before drinking).
2. Never store water in open vessels. Use clean, covered containers with a ladle.
3. If anyone in the household starts having loose stools or vomiting, immediately start Oral Rehydration Salts (ORS). If ORS packets from the ASHA worker are not immediately accessible, mix 6 level teaspoons of sugar and 1/2 teaspoon of salt in 1 liter of cooled boiled water.
4. Warning signs requiring immediate hospital visit: sunken eyes, extreme thirst, inability to drink, lethargy, or blood in stool.`,
    contentHi: `ग्रामीण क्षेत्रों में बारिश के दिनों में कुओं और हैंडपंप का पानी दूषित होने से हैजा, डायरिया और टाइफाइड का खतरा बढ़ जाता है।

1. पीने के पानी को कम से कम 10 मिनट तक अच्छी तरह उबालें या आशा कार्यकर्ता द्वारा दी गई क्लोरीन की गोलियों का प्रयोग करें (20 लीटर पानी में एक गोली डालें और 30 मिनट बाद पिएं)।
2. पानी को हमेशा ढके हुए बर्तनों में रखें और निकालने के लिए डंडी वाले लोटे का उपयोग करें।
3. दस्त या उल्टी शुरू होते ही तुरंत ओआरएस (ORS) का घोल देना शुरू करें। यदि ओआरएस पैकेट नहीं है, तो 1 लीटर उबले पानी में 6 चम्मच चीनी और आधा चम्मच नमक मिलाकर घोल बनाएं।
4. गंभीर लक्षण दिखने पर (जैसे आंखें धंसना, अत्यधिक कमजोरी, पेशाब कम होना) तुरंत नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) ले जाएं।`,
    contentTe: `వర్షాకాలంలో గ్రామాల్లో బావులు, బోర్ల నీరు కలుషితమై డయేరియా, కలరా మరియు టైఫాయిడ్ వంటి వ్యాధులు ప్రబలే అవకాశం ఉంది.

1. తాగే నీటిని కనీసం 10 నిమిషాలు బాగా మరిగించి చల్లార్చండి, లేదా ప్రభుత్వ క్లోరిన్ మాత్రలను ఉపయోగించండి (20 లీటర్ల నీటికి ఒక మాత్ర వేసి 30 నిమిషాలు ఆగాలి).
2. నీటిని ఎల్లప్పుడూ మూత ఉన్న శుభ్రమైన పాత్రలలో భద్రపరచండి. చేతులతో తాకకుండా పొడవైన పిడి గరిటెను వాడండి.
3. విరేచనాలు లేదా వాంతులు ప్రారంభమైన వెంటనే ORS (ఓరల్ రీహైడ్రేషన్ సాల్ట్స్) ద్రావణాన్ని తాగించండి. ORS అందుబాటులో లేకపోతే, 1 లీటరు కాచి చల్లార్చిన నీటిలో 6 చెంచాల చక్కెర మరియు అర చెంచా ఉప్పు కలపండి.
4. కళ్ళు గుంటలు పడటం, తీవ్రమైన నీరసం, మూత్రం రాకపోవడం వంటి ప్రమాద సంకేతాలు ఉంటే వెంటనే సమీపంలోని PHC లేదా CHCకి తీసుకెళ్లండి.`,
    keyTips: [
      'Boil drinking water for 10 minutes',
      'Start ORS immediately at first sign of loose motion',
      'Wash hands with soap before meals and after toilet',
      'Never allow stagnant water near handpumps'
    ]
  },
  {
    _id: 'art-2',
    articleId: 'maternal-nutrition-anemia',
    category: 'Maternal & Child Health',
    tag: 'Nutrition',
    readTimeMinutes: 4,
    titleEn: 'Maternal Nutrition: Beating Anemia with Iron & Antenatal Care',
    titleHi: 'मातृ पोषण: आयरन गोलियों और प्रसवपूर्व देखभाल से एनीमिया पर विजय',
    titleTe: 'తల్లుల పోషకాహారం: ఐరన్ మాత్రలు మరియు గర్భిణీ సంరక్షణ ద్వారా రక్తహీనత నివారణ',
    summaryEn: 'Essential guide for pregnant and lactating mothers on daily iron-folic acid tablets, green leafy vegetables, and timely PHC checkups.',
    summaryHi: 'गर्भवती और धात्री माताओं के लिए दैनिक आयरन-फोलिक एसिड गोलियां, हरी सब्जियां और नियमित एएनसी जांच की आवश्यक जानकारी।',
    summaryTe: 'గర్భిణీలు మరియు బాలింతలకు రోజువారీ ఐరన్-ఫోలిక్ యాసిడ్ మాత్రలు, ఆకుకూరలు మరియు సకాలంలో PHC పరీక్షల ప్రాముఖ్యత.',
    contentEn: `Over 50% of pregnant women in rural India experience anemia (low hemoglobin), which increases the danger of low birth weight, premature birth, and maternal complications.

1. Free Iron & Folic Acid (IFA) Tablets: Provided free of cost at every Sub-Centre, PHC, and Anganwadi. Take one tablet daily with water or lemon water after meals starting from the 4th month of pregnancy until at least 6 months after delivery. Do NOT take with tea or milk as calcium and tannin block iron absorption.
2. Local Nutritious Foods: Eat drumstick leaves (moringa), spinach, jaggery (gud), roasted chana, groundnut chikki, sprouted pulses, eggs, and seasonal fruits like guava and amla (rich in Vitamin C which helps iron absorption).
3. 4 Antenatal Checkups (ANC): Register with your local ASHA/ANM worker as soon as pregnancy is known. Ensure at least 4 medical checkups with blood pressure, urine test, hemoglobin check, and two Tetanus-Diphtheria (Td) injections.
4. Janani Suraksha Yojana (JSY): Get institutional delivery at government health centres for financial support and safe delivery by skilled nurses and doctors.`,
    contentHi: `ग्रामीण भारत में 50% से अधिक गर्भवती महिलाएं खून की कमी (एनीमिया) से जूझती हैं। सही खानपान और देखभाल से इसे आसानी से ठीक किया जा सकता है।

1. मुफ्त आयरन और फोलिक एसिड (IFA) गोलियां: नजदीकी उपकेंद्र, प्राथमिक स्वास्थ्य केंद्र या आंगनवाड़ी से मुफ्त प्राप्त करें। गर्भावस्था के चौथे महीने से रोजाना एक लाल गोली भोजन के बाद पानी या नींबू पानी के साथ लें। चाय या दूध के साथ न लें।
2. स्थानीय पौष्टिक आहार: सहजन (मुनगा) की पत्तियां, पालक, गुड़, भुना चना, मूंगफली, अंकुरित दालें, अंडा, अमरूद और आंवला खाएं।
3. कम से कम 4 प्रसवपूर्व जांच (ANC): आशा या एएनएम दीदी से संपर्क करें। रक्तचाप, हीमोग्लोबिन और टिटनेस (Td) के दो टीके अवश्य लगवाएं।
4. जननी सुरक्षा योजना (JSY): सरकारी अस्पताल में सुरक्षित प्रसव कराएं जिससे जच्चा-बच्चा दोनों सुरक्षित रहें और सरकारी प्रोत्साहन राशि मिले।`,
    contentTe: `గ్రామీణ ప్రాంతాల్లోని గర్భిణీ స్త్రీలలో రక్తహీనత (ఎనీమియా) సాధారణ సమస్య. సరైన పోషకాహారం, మందులతో దీనిని సులభంగా నివారించవచ్చు.

1. ఉచిత ఐరన్ & ఫోలిక్ యాసిడ్ మాత్రలు: ఆశా కార్యకర్త లేదా అంగన్‌వాడీ ద్వారా అందించే ఐరన్ మాత్రలను గర్భం 4వ నెల నుండి రోజుకు ఒకటి చొప్పున తీసుకోండి. నిమ్మరసం లేదా నీటితో వేసుకోవాలి, టీ లేదా పాలతో వేసుకోకూడదు.
2. స్థానిక బలవర్ధక ఆహారం: మునగాకు, పాలకూర, బెల్లం, వేరుశెనగ చిక్కీ, మొలకెత్తిన గింజలు, గుడ్లు, ఉసిరి మరియు జామకాయలు రోజూ ఆహారంలో భాగం చేసుకోండి.
3. 4 సార్లు గర్భధారణ పరీక్షలు (ANC): రక్తపోటు (BP), హిమోగ్లోబిన్ పరీక్ష, మూత్ర పరీక్ష మరియు ధనుర్వాతం (Td) టీకాలు తప్పనిసరిగా వేయించుకోండి.
4. ప్రభుత్వ ఆసుపత్రులలో కాన్పు (జనని సురక్ష యోజన): సురక్షిత ప్రసవం కోసం సమీపంలోని PHC లేదా CHCకి వెళ్లండి.`,
    keyTips: [
      'Take 1 Iron-Folic Acid tablet daily from 4th month onwards',
      'Include drumstick leaves, jaggery, and amla in daily meals',
      'Do not drink tea with iron tablets or meals',
      'Register for Janani Suraksha Yojana with your village ASHA worker'
    ]
  },
  {
    _id: 'art-3',
    articleId: 'vector-borne-dengue-malaria',
    category: 'Monsoon Diseases',
    tag: 'Emergency Awareness',
    readTimeMinutes: 3,
    titleEn: 'Recognizing Dengue & Malaria: When to Rush to the Hospital',
    titleHi: 'डेंगू और मलेरिया की पहचान: कब तुरंत अस्पताल भागना चाहिए',
    titleTe: 'డెంగ్యూ మరియు మలేరియా గుర్తింపు: వెంటనే ఆసుపత్రికి ఎప్పుడు వెళ్ళాలి',
    summaryEn: 'How to differentiate between seasonal flu, malaria, and severe dengue, plus life-saving warning signs for rural patients.',
    summaryHi: 'साधारण मौसमी बुखार, मलेरिया और डेंगू में अंतर कैसे समझें और कौन से खतरे के लक्षण दिखने पर तुरंत बड़े अस्पताल जाएं।',
    summaryTe: 'సాధారణ జ్వరం, మలేరియా మరియు డెంగ్యూ లక్షణాల మధ్య తేడాలు, మరియు వెంటనే ఆసుపత్రికి వెళ్లాల్సిన ప్రమాద సంకేతాలు.',
    contentEn: `During and after the rainy season, stagnant water in ditches, overhead tanks, and farm equipment breeds Anopheles (malaria) and Aedes (dengue) mosquitoes.

1. Malaria Symptoms: High fever that comes with severe chills/shivering, followed by profuse sweating every alternate day, intense headache, body aches. Malaria is tested for free at all PHCs using Rapid Diagnostic Kits (RDT).
2. Dengue Symptoms: Sudden high-grade fever (103°F-104°F), severe pain behind the eyes, intense muscle and joint pain ("breakbone fever"), red skin rashes.
3. CRITICAL RED-FLAG WARNING SIGNS (Dengue Hemorrhagic Fever):
   - Severe persistent abdominal pain
   - Persistent vomiting (cannot keep liquids down)
   - Bleeding from gums, nose, or blood in stool/vomit
   - Extreme sleepiness, cold or clammy hands and feet
   - Sudden drop in body temperature accompanied by dizziness
4. First Aid Rule: Never take ibuprofen, aspirin, or combiflam for suspected dengue fever, as they thin the blood and cause fatal internal bleeding. Use ONLY paracetamol under medical supervision and drink coconut water, rice kanji, and ORS.`,
    contentHi: `बरसात के समय रुके हुए पानी, कूलरों, और खेतों में जमा पानी से मच्छर पनपते हैं जो मलेरिया और डेंगू फैलाते हैं।

1. मलेरिया के लक्षण: ठंड और कंपकंपी के साथ तेज बुखार आना, पसीना आकर बुखार उतरना, सिरदर्द। सभी पीएचसी में इसकी मुफ्त खून जांच उपलब्ध है।
2. डेंगू के लक्षण: अचानक तेज बुखार (103-104°F), आंखों के पीछे तेज दर्द, जोड़ों और मांसपेशियों में तेज दर्द, त्वचा पर लाल चकत्ते।
3. तुरंत बड़े अस्पताल जाने के खतरे के संकेत:
   - पेट में तेज लगातार दर्द
   - लगातार उल्टी आना
   - मसूड़ों या नाक से खून आना, उल्टी में खून
   - हाथ-पैर ठंडे पड़ना, अत्यधिक सुस्ती या बेहोशी
4. महत्वपूर्ण चेतावनी: डेंगू या बुखार में कभी भी एस्पिरिन (Aspirin) या कॉम्बीफ्लेम न लें, यह खून पतला कर आंतरिक रक्तस्राव का कारण बन सकता है। केवल पैरासिटामोल लें और खूब ओआरएस, नारियल पानी पिएं।`,
    contentTe: `వర్షాల సమయంలో నీరు నిల్వ ఉండే గుంతలు, తొట్టెలలో దోమలు పెరిగి మలేరియా మరియు డెంగ్యూ వ్యాధులను వ్యాప్తి చేస్తాయి.

1. మలేరియా లక్షణాలు: తీవ్రమైన చలి, వణుకుతో కూడిన జ్వరం, చెమటలు పట్టి జ్వరం తగ్గడం, తీవ్ర తలనొప్పి. ప్రభుత్వ PHCలలో ఉచిత రక్త పరీక్ష అందుబాటులో ఉంటుంది.
2. డెంగ్యూ లక్షణాలు: అకస్మాత్తుగా వచ్చే తీవ్ర జ్వరం, కళ్ళ వెనుక తీవ్ర నొప్పి, ఒళ్ళు నొప్పులు, కండరాల నొప్పులు, చర్మంపై ఎర్రటి మచ్చలు.
3. అత్యవసర ప్రమాద సంకేతాలు (వెంటనే పెద్ద ఆసుపత్రికి వెళ్ళండి):
   - కడుపులో భరించలేని తీవ్ర నొప్పి
   - ఆగకుండా వచ్చే వాంతులు
   - చిగుళ్ళు లేదా ముక్కు నుండి రక్తం కారడం, వాంతిలో రక్తం
   - కాళ్ళు చేతులు చల్లబడటం, తీవ్రమైన బలహీనత లేదా మైకం
4. ముఖ్య గమనిక: జ్వరం ఉన్నప్పుడు వైద్యుడి సలహా లేకుండా ఆస్పిరిన్ లేదా ఐబుప్రోఫెన్ మందులు వాడకూడదు. డాక్టర్ సలహాతో పారాసిటమాల్ మాత్రమే వేసుకోవాలి మరియు ORS, కొబ్బరి నీళ్ళు ఎక్కువగా తాగాలి.`,
    keyTips: [
      'Sleep under mosquito nets (especially children & pregnant women)',
      'Empty all open water containers, tyres, and mud pots once weekly',
      'Never take Aspirin or Combiflam for fever with joint pains',
      'Visit nearest PHC for free blood smear / rapid kit testing'
    ]
  },
  {
    _id: 'art-4',
    articleId: 'snakebite-first-aid',
    category: 'Rural Emergencies',
    tag: 'Critical First Aid',
    readTimeMinutes: 4,
    titleEn: 'Snakebite First Aid: Life-Saving Rules (Do’s and Don’ts)',
    titleHi: 'सांप के काटने पर प्राथमिक उपचार: जान बचाने वाले जरूरी नियम',
    titleTe: 'పాముకాటు ప్రథమ చికిత్స: ప్రాణాలు కాపాడే ముఖ్య నియమాలు',
    summaryEn: 'Essential DOs and DONTs for snakebite in farms: immobilization, why tourniquets and cuts are deadly, and reaching anti-venom fast.',
    summaryHi: 'खेतों में सर्पदंश पर क्या करें और क्या न करें: पट्टी बांधना, चीरा लगाने से क्यों बचें, और एंटी-वेनम वाले अस्पताल कैसे तुरंत पहुंचें।',
    summaryTe: 'పొలాల్లో పాము కాటు వేసినప్పుడు చేయవలసినవి, చేయకూడనివి: రక్త ప్రసరణను ఆపకుండా వెంటనే యాంటీ-వెనమ్ ఆసుపత్రికి ఎలా చేరాలి.',
    contentEn: `In rural India, snakebites are a major medical emergency, especially during monsoon and farming seasons. The ONLY scientifically proven cure is Polyvalent Anti-Snake Venom (ASV) available free at government hospitals.

WHAT TO DO IMMEDIATELY (RIGHT acronym):
- R = Reassure the victim. Over 70% of snakebites are from non-venomous snakes or "dry bites". Panic accelerates heart rate and venom spread.
- I = Immobilize the bitten limb using a splint or stick and cloth, exactly like a fractured bone. Keep the bitten limb STILL and below heart level.
- G = Get to hospital immediately. Call 108 ambulance or use fastest motor vehicle.
- H = Tell healthcare workers about bite symptoms (drooping eyelids, difficulty swallowing, swelling, bleeding).
- T = Time of bite should be noted.

WHAT NEVER TO DO (DANGEROUS MYTHS):
- NEVER use a tight tourniquet (rope/wire) that cuts off blood circulation; this causes gangrene and limb amputation.
- NEVER cut, burn, or slash the bite mark with razor blades.
- NEVER try to suck venom out with mouth or suction pumps.
- NEVER waste precious time visiting faith healers or snake charmers. Anti-snake venom at the Community Health Centre or District Hospital is the only life saver.`,
    contentHi: `ग्रामीण क्षेत्रों में खेती और बारिश के मौसम में सर्पदंश (सांप का काटना) एक बड़ी आपात स्थिति है। इसका एकमात्र प्रमाणित इलाज पॉलीवैलेंट एंटी-स्नेक वेनम (ASV) है जो सरकारी अस्पतालों में मुफ्त मिलता है।

तुरंत क्या करें:
1. पीड़ित को शांत रखें। घबराने से दिल की धड़कन तेज होती है और जहर तेजी से फैलता है।
2. जिस अंग पर काटा है (हाथ या पैर), उसे बिल्कुल स्थिर रखें। एक लकड़ी की पट्टी और कपड़े से उस अंग को बांधें (जैसे हड्डी टूटने पर बांधते हैं)। अंग को दिल के स्तर से नीचे रखें।
3. तुरंत 108 एम्बुलेंस को कॉल करें या निकटतम सीएचसी / जिला अस्पताल ले जाएं।
4. काटने का समय याद रखें ताकि डॉक्टर सही इलाज कर सकें।

क्या भूलकर भी न करें:
1. रस्सी या तार से कसकर रक्त संचार बंद न करें (इससे अंग सड़ने और काटने की नौबत आ जाती है)।
2. ब्लेड से चीरा न लगाएं और न ही जलाएं।
3. मुंह से जहर चूसने की कोशिश न करें।
4. झाड़-फूंक या तांत्रिक के चक्कर में समय बिल्कुल न गंवाएं।`,
    contentTe: `వ్యవసాయ పనుల సమయంలో గ్రామీణ ప్రాంతాల్లో పాముకాటు తరచుగా జరుగుతుంది. దీనికి ఏకైక నివారణ ప్రభుత్వ ఆసుపత్రులలో ఉచితంగా లభించే యాంటీ-స్నేక్ వెనమ్ (ASV) ఇంజెక్షన్ మాత్రమే.

వెంటనే చేయవలసినవి:
1. బాధితుడిని ప్రశాంతంగా ఉంచండి. భయాందోళనల వల్ల గుండె వేగంగా కొట్టుకుని విషం వేగంగా వ్యాపిస్తుంది.
2. కాటు వేసిన కాలు లేదా చేతిని ఏమాత్రం కదపకుండా కర్ర బద్దెలు మరియు గుడ్డతో కట్టండి (ఎముక విరిగినప్పుడు కట్టినట్లు). ఆ అవయవాన్ని గుండె కంటే కింద స్థాయిలోనే ఉంచండి.
3. వెంటనే 108 వాహనాన్ని పిలిచి సమీపంలోని ప్రభుత్వ CHC లేదా ఏరియా ఆసుపత్రికి తరలించండి.
4. పాము కాటు వేసిన సమయాన్ని గుర్తుంచుకోండి.

చేయకూడని తప్పులు:
1. కాటు వేసిన చోట తాడు లేదా వైరుతో రక్త ప్రసరణ ఆగిపోయేలా గట్టిగా కట్టవద్దు (దీనివల్ల అవయవం కుళ్ళిపోయే ప్రమాదం ఉంది).
2. బ్లేడ్లతో కోయడం, మండించడం చేయవద్దు.
3. నోటితో విషాన్ని పీల్చడానికి ప్రయత్నించవద్దు.
4. నాటు మందులు, మంత్రగాళ్ల దగ్గరకు వెళ్లి విలువైన సమయాన్ని వృధా చేయవద్దు.`,
    keyTips: [
      'Keep the patient calm and immobilize the bitten limb like a fracture',
      'Never apply tight tourniquets or cut the bite site',
      'Rush immediately to the nearest CHC or District Hospital with 108',
      'Free Anti-Snake Venom (ASV) is stocked at all government CHCs'
    ]
  },
  {
    _id: 'art-5',
    articleId: 'universal-immunization-schedule',
    category: 'Child Vaccination',
    tag: 'Prevention',
    readTimeMinutes: 4,
    titleEn: 'Complete Child Vaccination Schedule (National UIP India)',
    titleHi: 'शिशु टीकाकरण की पूरी समय-सारणी (राष्ट्रीय प्रतिरक्षण कार्यक्रम)',
    titleTe: 'పిల్లల పూర్తి టీకాల షెడ్యూల్ (జాతీయ ఇమ్యునైజేషన్ ప్రోగ్రామ్)',
    summaryEn: 'Simple milestone guide for rural parents: vaccines from birth to 16 years provided free of cost at Village Health & Nutrition Days (VHND).',
    summaryHi: 'ग्रामीण माता-पिता के लिए जन्म से 16 वर्ष तक के सभी आवश्यक टीकों की आसान जानकारी, जो गांव के वीएचएनडी दिवस पर मुफ्त लगते हैं।',
    summaryTe: 'పుట్టినప్పటి నుండి 16 సంవత్సరాల వరకు ప్రభుత్వ అంగన్‌వాడీ / గ్రామ ఆరోగ్య దినోత్సవం (VHND) ద్వారా ఉచితంగా అందించే టీకాల వివరాలు.',
    contentEn: `Under India's Universal Immunization Programme (UIP), government healthcare protects every child against 12 deadly diseases free of cost.

Key Vaccination Milestones:
1. At Birth (Within 24 hours):
   - BCG (Tuberculosis protection)
   - OPV 0 (Oral Polio Vaccine drop)
   - Hepatitis B birth dose
2. At 6 Weeks, 10 Weeks, and 14 Weeks:
   - Pentavalent Vaccine (protects against Diphtheria, Pertussis, Tetanus, Hepatitis B, and Hib)
   - Rotavirus Vaccine (oral drops against severe diarrhea)
   - fIPV (Fractional Inactivated Polio Vaccine)
   - PCV (Pneumococcal Conjugate Vaccine against pneumonia)
3. At 9 Completed Months:
   - MR 1st dose (Measles-Rubella)
   - JE 1st dose (Japanese Encephalitis in endemic districts)
   - Vitamin A 1st dose (prevents night blindness)
4. At 16-24 Months:
   - DPT Booster-1, MR 2nd dose, OPV Booster
5. At 5-6 Years & 10/16 Years:
   - DPT Booster-2 at 5 years
   - Td (Tetanus-Diphtheria) at 10 and 16 years.

Bring your Mother & Child Protection (MCP) card to every session at the Anganwadi centre or Sub-centre.`,
    contentHi: `भारत सरकार के राष्ट्रीय टीकाकरण कार्यक्रम के तहत बच्चों को 12 जानलेवा बीमारियों से बचाने के लिए सभी टीके मुफ्त लगाए जाते हैं।

टीकाकरण की समय-सारणी:
1. जन्म के समय: बीसीजी (टीबी से बचाव), पोलियो की जीरो खुराक, हेपेटाइटिस बी।
2. 6, 10 और 14 सप्ताह पर: पेंटावेलेंट (गलघोंटू, काली खांसी, धनुस्तंभ, हेपेटाइटिस बी और हिब से बचाव), रोटावायरस (दस्त से बचाव), पोलियो और निमोनिया (पीसीवी) का टीका।
3. 9 महीने पूरे होने पर: खसरा-रूबेला (MR) का पहला टीका, विटामिन ए की पहली खुराक।
4. 16-24 महीने पर: डीपीटी बूस्टर-1, एमआर का दूसरा टीका, पोलियो बूस्टर।
5. 5 वर्ष, 10 वर्ष और 16 वर्ष पर: 5 साल में डीपीटी बूस्टर-2, 10 और 16 साल में टीडी (Td) का टीका।

हर बुधवार या गांव के टीकाकरण दिवस (VHND) पर अपना 'ममता कार्ड' लेकर अवश्य जाएं।`,
    contentTe: `భారత ప్రభుత్వ సార్వత్రిక టీకా కార్యక్రమం కింద పిల్లలను 12 రకాల ప్రాణాంతక వ్యాధుల నుండి కాపాడేందుకు అన్ని టీకాలు ఉచితంగా ఇవ్వబడతాయి.

టీకాల వివరాలు:
1. పుట్టిన వెంటనే: BCG (టీబీ నిరోధక), పోలియో చుక్కలు (OPV-0), హెపటైటిస్-B.
2. 6, 10, మరియు 14 వారాల వయసులో: పెంటావాలెంట్ (5 వ్యాధులను నిరోధించే టీకా), రోటావైరస్ చుక్కలు (విరేచనాల నివారణ), పోలియో (fIPV), మరియు నిమోనియా (PCV) టీకాలు.
3. 9 నెలలు పూర్తయినప్పుడు: తట్టు-రుబెల్లా (MR-1), విటమిన్-A మొదటి డోస్.
4. 16-24 నెలల వయసులో: DPT బూస్టర్-1, MR-2, పోలియో బూస్టర్.
5. 5 సంవత్సరాలు & 10, 16 సంవత్సరాలకు: 5 ఏళ్ళకు DPT బూస్టర్-2, 10 మరియు 16 ఏళ్ళకు Td టీకాలు.

గ్రామ ఆరోగ్య మరియు పోషకాహార దినోత్సవం (VHND) రోజున మాతా-శిశు సంరక్షణ (MCP) కార్డును తప్పకుండా తీసుకెళ్ళండి.`,
    keyTips: [
      'Keep your Mother & Child Protection (MCP) card safe',
      'Vaccines are 100% free at Anganwadi and Sub-Centres',
      'Mild fever after vaccine is normal; consult ANM or give paracetamol',
      'Never skip the 9-month Measles-Rubella (MR) vaccine'
    ]
  }
];
