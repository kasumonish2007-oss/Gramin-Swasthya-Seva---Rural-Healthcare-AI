# Gramin Swasthya Seva (ग्रामीण स्वास्थ्य सेवा)
### AI-Based Rural Healthcare Assistance and Early Disease Detection System

A responsive, production-ready full-stack healthcare web application designed specifically for rural and remote communities across India. The system provides accessible preliminary AI symptom triage, verified Primary Health Centre (PHC) & hospital mapping via Google Maps, doctor appointment scheduling with remote telemedicine video rooms, and multilingual vernacular health education with Text-to-Speech (TTS) in English, Hindi (हिन्दी), and Telugu (తెలుగు).

---

## 🌟 Key Features

### 1. Home Page & Emergency Helpline Ticker
- **24x7 Emergency Hotlines:** Instant one-click dial buttons for:
  - **108** — Free National Emergency Ambulance
  - **112** — All-in-One National Emergency Support
  - **1091** — Women Helpline
  - **14555** — Ayushman Bharat (PM-JAY)
  - **14416** — Tele-MANAS Mental Health
- **Rural Community Notice Board:** Trilingual health announcements with Web Speech API audio playback.
- **Critical Red-Flag Warning Guide:** Easy-to-understand visual triage signs for infant fever, respiratory distress, snakebite first aid, and acute dehydration.

### 2. AI Health Assistant & Early Risk Triage
- **Structured Assessment:** Captures symptoms, duration (days), severity level, fever, temperature, pre-existing conditions (Hypertension, Diabetes, Asthma, TB), pregnancy status, and environmental risk factors (standing rainwater, contaminated well water).
- **Backend AI Engine:** Powered by Gemini AI (`gemini-3.8-flash` via `@google/genai`) with an intelligent clinical-rule fallback engine.
- **Triage Stratification:**
  - 🟢 **Green (Mild):** Safe home supportive care (ORS, hydration, sponge bath) and monitoring.
  - 🟡 **Yellow (Moderate):** Consult a PHC/CHC doctor within 24–48 hours.
  - 🔴 **Red (Urgent Alert):** Immediate emergency warning signs requiring 108 ambulance dispatch.
- **Audio Read-Aloud:** Non-literate friendly Text-to-Speech in English, Hindi, and Telugu.
- **Medical Safety:** Clearly disclaims that assessments are preliminary risk stratification and strictly forbids drug prescribing or replacing a clinician.

### 3. Find Nearby Hospitals, PHCs & Jan Aushadhi Stores
- **Google Maps Platform Integration:** Interactive maps rendered with `@vis.gl/react-google-maps` using `AdvancedMarker` and `InfoWindow`.
- **Comprehensive Facility Directory:** Primary Health Centres (PHCs), Community Health Centres (CHCs), District Hospitals, Sub-Centres, Rural Clinics, and Pradhan Mantri Jan Aushadhi Kendras (generic medicine pharmacies).
- **Geolocation & Search:** Search by village, town, district, or PIN code, or tap "Use My Location" (HTML5 Geolocation) to calculate real-time road distance in km.
- **Facility Verification:** 24x7 emergency beds, oxygen readiness, Ayushman Bharat empanelment, operating hours, direct phone call, and Google Maps directions.
- **Low-Bandwidth List View:** Switch between Google Maps view and a lightweight list view for slow 2G/3G mobile networks.

### 4. Doctor Consultations & Telemedicine Video Rooms
- **Registered Practitioners:** General Physicians, Pediatricians, Gynecologists, and AYUSH doctors with qualifications and village hospital affiliations.
- **Booking Workflow:** Choose date, time slot, patient phone, and consultation mode:
  - *In-Person Visit* at local health centre
  - *Remote Tele-Consultation* (audio/video call)
- **Virtual Telemedicine Room:** Live encrypted video interface simulation with self-view camera, microphone toggling, doctor chat, and meeting ID (`GRAMIN-TELE-xxxxx`).

### 5. Multilingual Health Awareness & Audio Education
- **Verified Primary Healthcare Guides:**
  - Clean Drinking Water & Preventing Monsoon Diarrhea & Typhoid
  - Maternal Nutrition, Iron-Folic Acid & Anemia Prevention
  - Recognizing Dengue & Malaria vs. Seasonal Viral Fevers
  - Snakebite First Aid: Life-saving DOs & DON'Ts (Anti-Snake Venom ASV guidance)
  - Universal Immunization Programme (UIP) Complete Child Vaccination Schedule
- **True Trilingual Content:** Instant toggle between English, Hindi (हिन्दी), and Telugu (తెలుగు).
- **Speech Synthesis:** Accessible "Listen to Guide" audio reader.

### 6. User Portals & Healthcare Administrator Dashboard
- **Patient Dashboard:**
  - View appointment history with status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - Access previous AI symptom assessments and clinical recommendations.
  - Manage village/district profile and medical consent.
- **Admin & PHC Coordinator Dashboard:**
  - Real-time community metrics: total patients, appointments, pending requests, teleconsults, and high-risk alerts.
  - Appointment review table: Confirm requests, complete visits, record doctor clinical notes, or cancel.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API (TTS), `@vis.gl/react-google-maps` |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`), JWT, BcryptJS |
| **Database** | MongoDB / Mongoose Schemas (with resilient in-memory & file-based auto-seeding fallback) |
| **AI Provider** | Google Gemini API (`gemini-3.8-flash` via `@google/genai`) |
| **Maps & Places** | Google Maps Platform JavaScript API (Demo Key Provisioned) |

---

## 🚀 Getting Started Locally (Visual Studio Code)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- (Optional) **MongoDB** instance (if not installed, the application automatically uses the built-in resilient database store).

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd rural-healthcare-ai

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Review the values in `.env`:
```env
# Gemini AI Key (for AI symptom triage)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Google Maps Platform API Key
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

# Optional MongoDB Connection String
MONGODB_URI="mongodb://localhost:27017/rural_health_db"

# JWT Secret for Session Security
JWT_SECRET="gramin-health-secret-key-2026-production"

# Port (Defaults to 3000)
PORT=3000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running in Production
```bash
# Build frontend assets
npm run build

# Start the full-stack server
npm start
```

---

## 🔑 Demo Test Accounts

You can test the application using the pre-seeded credentials or the one-click demo buttons in the login modal:

| Role | Username / Identifier | Password | Description |
|---|---|---|---|
| **Patient** | `9876543210` or `ravi.patient@ruralhealth.in` | `patient123` | Patient from Shamshabad Village with pre-existing appointments and symptom history |
| **PHC Administrator** | `admin@ruralhealth.gov.in` | `admin123` | Dr. Anita Sharma, PHC Officer with access to the Admin Control Panel |

---

## 📡 REST API Reference & Testing Examples

### 1. Authentication
- `POST /api/auth/register` — Register a new patient or administrator
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Suresh Reddy",
      "phone": "9848011223",
      "password": "password123",
      "village": "Shabad",
      "district": "Ranga Reddy",
      "preferredLanguage": "te"
    }'
  ```

- `POST /api/auth/login` — Sign in with phone/email and password
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "identifier": "9876543210",
      "password": "patient123"
    }'
  ```

### 2. AI Health Triage
- `POST /api/health/assess` — Assess symptoms
  ```bash
  curl -X POST http://localhost:3000/api/health/assess \
    -H "Content-Type: application/json" \
    -d '{
      "patientName": "Sunita Devi",
      "age": 28,
      "gender": "female",
      "isPregnant": true,
      "symptoms": "High fever, chills in evening, extreme fatigue",
      "durationDays": 2,
      "severity": "moderate",
      "feverPresent": true,
      "environmentalRisk": "Monsoon rainwater in village"
    }'
  ```

### 3. Hospitals & Doctors
- `GET /api/hospitals?district=Ranga%20Reddy&type=PHC` — Search facilities by type and district
- `GET /api/doctors?teleconsult=true` — Retrieve telemedicine-ready doctors

### 4. Appointments
- `POST /api/appointments` — Schedule a consultation (Requires `Authorization: Bearer <token>`)
- `GET /api/appointments/my` — Fetch patient's appointments
- `GET /api/appointments/all` — Administrator review list (Requires admin token)
- `PUT /api/appointments/:id/status` — Confirm, reschedule, complete, or cancel appointment

---

## ⚕️ Medical & Safety Disclaimer

**Gramin Swasthya Seva** is designed as a rural healthcare awareness and primary triage assistance tool. It does **not** generate definitive medical diagnoses and does **not** prescribe controlled or prescription medications. In any life-threatening situation (chest pain, severe breathlessness, snakebite, unconsciousness), patients should immediately contact national emergency services (**108** or **112**) or proceed to the nearest emergency hospital.
