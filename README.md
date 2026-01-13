# South Park 3D Map 🏔️

Een interactieve 3D-kaart van South Park gebouwd met React Three Fiber, Rapier Physics en GSAP animaties.

## 📋 Project Omschrijving

Dit project is een virtuele tour door South Park waar bezoekers verschillende Points of Interest (POI) kunnen verkennen. De kaart bevat 30+ locaties verdeeld over drie categorieën:

**Houses** - Karakterhuizen zoals Stan, Kyle, Cartman, Kenny en meer
**Buildings** - Gebouwen zoals de school, ziekenhuis, mall, en restaurants  
**Landmarks** - Iconische plekken zoals de bus stop, South Park sign, en Stark's Pond

Bij het selecteren van een locatie beweegt de camera vloeiend naar het object en verschijnt er informatie met character images die audio afspelen bij klik.

## 🛠️ Technologieën

- **React 18.3.1** - UI Framework
- **React Three Fiber 8.17.10** - Three.js React renderer
- **@react-three/drei 9.114.3** - Helpers voor R3F
- **@react-three/rapier 1.4.0** - Physics engine (sneeuw systeem)
- **Three.js 0.169.0** - 3D Graphics library
- **GSAP 3.12.5** - Camera animaties
- **Vite 5.4.11** - Build tool & dev server
- **Blender** - 3D modeling

## 🚀 Installatie

```bash
# Clone repository
git clone [repository-url]

# Navigeer naar project folder
cd webMap

# Dependencies installeren
npm install

# Development server starten
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structuur

```
webMap/
├── src/
│   ├── App.jsx              # Hoofdapplicatie met audio/camera/state beheer
│   ├── main.jsx             # React entry point
│   ├── components/
│   │   ├── UI/              # React UI componenten
│   │   │   ├── InfoPanel.jsx      # POI informatie met character audio
│   │   │   ├── IntroScreen.jsx    # Welkomstscherm
│   │   │   ├── LoadingScreen.jsx  # Laadscherm met progress bar
│   │   │   └── PoiList.jsx        # Navigatielijst met categorieën
│   │   ├── Effects/
│   │   │   └── SnowSystem.jsx     # Rapier physics sneeuw (1200 particles)
│   │   ├── Environment/
│   │   │   └── Clouds.jsx         # Procedurele wolken
│   │   └── Models/
│   │       └── Model.jsx          # GLB model loader
│   ├── scenes/
│   │   └── SouthParkScene.jsx     # Hoofd 3D scene met fog planes
│   ├── data/
│   │   └── poiData.js             # 30+ POI definities
│   └── styles/
│       ├── index.css              # Globale styles
│       └── PoiList.css            # Navigatie styling
├── public/
│   ├── audio/               # 40+ audio bestanden (characters + ambient)
│   ├── images/              # Character afbeeldingen
│   │   └── characters/      # 35+ character images
│   └── fonts/               # Custom fonts
├── 3Dmodels/                # GLB/GLTF modellen (huizen, gebouwen, etc.)
└── images/                  # Texturen en achtergronden
```

## ✨ Features

### Interactie
- ✅ 30+ klikbare Points of Interest
- ✅ Gecategoriseerde navigatielijst (Houses/Buildings/Landmarks)
- ✅ Vloeiende GSAP camera animaties naar POI's
- ✅ HTML info panels met character afbeeldingen
- ✅ Klik op characters om audio af te spelen

### Physics (Rapier)
- ✅ Sneeuwsysteem met 1200 physics-based particles
- ✅ 30ms spawn interval voor realistische sneeuwval
- ✅ Gravity-based falling met collision

### Audio
- ✅ Ambient vogelgeluiden (pauzeert tijdens character audio)
- ✅ 35+ character-specifieke audio clips
- ✅ South Park theme muziek bij sign
- ✅ Easter egg: Crab People multipliceren bij klikken

### Visueel
- ✅ Procedurele wolken met blob-geometrie
- ✅ Fog planes voor diepte-effect
- ✅ Custom South Park color palette (#4DA6FF sky)
- ✅ Loader met progress bar
- ✅ Intro scherm met South Park branding

### Easter Eggs
- ✅ Crab People Lair - klik meerdere keren voor meer crabs
- ✅ Chinpokomon audio in de mall
- ✅ "Oh my God, they killed Kenny!" audio

## 🎮 Controls

- **Linker muisknop + slepen**: Camera roteren
- **Scroll**: Zoom in/uit
- **Rechter muisknop + slepen**: Camera verplaatsen
- **Klik op locatie in lijst**: Navigeer naar POI
- **Klik op character image**: Speel character audio af
- **X knop**: Sluit info panel en keer terug naar overview

## 🎨 Credits

### 3D Modellen
- **Eigen werk (Blender)**: South Park terrein/map basis
- **Online bronnen**: South park wiki

### Audio
- Character quotes: South Park (Comedy Central)
- Ambient sounds: Mixkit (vogels)
- Bewerkt met Voicemod

### Afbeeldingen
- South Park Wiki voor character references
- Eigen screenshots en edits

## 📝 Technische Vereisten (Checklist)

- [x] React met React Three Fiber (v8.17.10)
- [x] Rapier physics engine (sneeuwsysteem)
- [x] Eigen Blender-gemaakte map/terrein
- [x] 3-5 eigen 3D-modellen
- [x] Interactie (klik) met info display
- [x] GSAP camera animaties
- [x] Physics element (sneeuw easter egg)
- [x] Audio integratie (ambient + 35+ character clips)
- [x] Fullscreen ervaring
- [x] Loader bij opstart
- [x] Intro scherm

## 🔧 Technische Keuzes

### State Management
React useState/useRef voor lokale state - geen Redux nodig voor deze scope.

### Camera Animatie
GSAP voor smooth tweening met `power2.inOut` easing. Camera positie en OrbitControls target worden simultaan geanimeerd.

### Audio Systeem
Twee audio tracks: 
1. `birdsAudioRef` - Ambient loop die pauzeert tijdens character audio
2. `characterAudioRef` - On-demand character clips met hogere volume voor speciale items

### Performance
- `useMemo` voor expensive operations (geometry pooling, scene cloning)
- Rapier physics voor efficiënte snow simulation
- Lazy loading van 3D modellen

## 👨‍💻 Auteur

**Emili**
- School: Tech3 - Jaar 2
- Datum: Januari 2026

## 📄 Licentie

Dit is een schoolproject voor educatieve doeleinden.
South Park is eigendom van Comedy Central / Paramount.

---

*"Oh my God, they rendered Kenny!"*
