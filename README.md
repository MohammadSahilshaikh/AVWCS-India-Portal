# Automated Vacuum Waste Collection System (AVWCS) — Feasibility Study & Interactive Portal

An interactive web platform, research demonstrator, and simulation portal for evaluating the engineering, environmental, and financial feasibility of Automated Vacuum Waste Collection Systems (AVWCS) for Indian smart cities and high-density urban environments.

---

## 🌟 Key Features

- **Interactive System Architecture & Animation**:
  - Step-by-step visual animation demonstrating inlet valve deposition, pneumatic underground pipeline transport, cyclone separation, compaction, and HEPA air filtration.
- **Pilot Implementation Plan**:
  - Interactive multi-phase timeline detailing Phase 0 (Site Readiness), Phase 1 (Underground Trenching & Pipe Laying), Phase 2 (Central Terminal & Vacuum Exhaust Station), and Phase 3 (Sensor Calibration & IoT Commissioning).
- **Comparative Analysis & ROI Estimator**:
  - Dynamic interactive comparison between traditional manual collection (diesel trucks, open bins, labor intensity) vs. AVWCS pneumatic network.
  - Interactive ROI and CAPEX / OPEX model including solar photovoltaic integration for grid energy offset.
- **Interactive Simulator**:
  - Real-time parameter tweaking (population density, collection frequency, pipe diameter, energy tariff) to project capital payback and carbon reduction.
- **Bilingual Interface**:
  - Seamless English / Hindi language toggle across all content, data points, and tooltips.
- **EmailJS Integrated Enquiry Portal**:
  - Direct async contact form powered by EmailJS client SDK with real-time feedback and validation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack App Router)](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Email Service**: [@emailjs/browser](https://www.emailjs.com/)
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (or copy `.env.example`):
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_8ln5mu9
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_ihpt477
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=GIbeIviQo1ehc1gxX
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── about/          # Research team and institution background
│   │   ├── compare/        # Comparative analysis & solar energy offset
│   │   ├── contact/        # EmailJS contact and collaboration form
│   │   ├── dashboard/      # Metrics and system performance
│   │   ├── explore/        # Interactive components explorer
│   │   ├── faq/            # Technical & operational FAQs
│   │   ├── how-it-works/   # Detailed technical mechanics
│   │   ├── paper/          # Research paper reader & bibliography
│   │   ├── pilot/          # Interactive 4-phase pilot roadmap
│   │   ├── simulator/      # Parametric feasibility calculator
│   │   ├── layout.tsx      # Root layout & navigation header/footer
│   │   └── page.tsx        # Homepage with hero & system animations
│   ├── components/         # Shared UI components, animations, & language context
│   └── data/               # Research constants, equations, & baseline data
├── public/                 # Static assets, icons, SVGs
├── package.json
└── tsconfig.json
```

---

## 👨‍💻 Developer & Author

- **Developer**: **MOHAMMAD SAHIL SHAIKH**
- **Institution**: **Narula Institute of Technology (NiT), Agarpara, Kolkata**
- **Role**: Lead Developer & Student Researcher
- **Contact Email**: [sahilfact549@gmail.com](mailto:sahilfact549@gmail.com)
- **Phone / WhatsApp**: [+91 9263602455](tel:+919263602455)
- **GitHub**: [MohammadSahilshaikh](https://github.com/MohammadSahilshaikh)

---

## 📜 License & Acknowledgements

Developed by Mohammad Sahil Shaikh at Narula Institute of Technology (NiT), Agarpara, as part of the Automated Vacuum Waste Collection System (AVWCS) Urban Infrastructure Feasibility Study.
