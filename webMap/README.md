# 🏔️ South Park 3D Interactive Map

> *"Come on down to South Park and meet some friends of mine!"*

Een volledig interactieve 3D-webervaring waarmee je door het stadje South Park kunt navigeren. Klik op gebouwen, ontdek personages en luister naar iconische quotes - allemaal vanuit je browser.

---

## 🎬 Demo

De applicatie start met een intro screen, gevolgd door een cinematische fly-in animatie vanaf het South Park welkomstbord. Vervolgens kan je vrij navigeren door de map of locaties selecteren uit de zijbalk.

---

## 🌟 Wat maakt dit project bijzonder?

| Feature | Beschrijving |
|---------|-------------|
| 🏠 **30+ Locaties** | Alle iconische plekken: huizen van de boys, Tweek Bros Coffee, City Wok, de school, en meer |
| 🎤 **35+ Audio Clips** | Klik op personages om hun bekendste quotes te horen |
| ❄️ **Physics Sneeuw** | Schakel sneeuw in voor 1200 realistische vallende sneeuwvlokken |
| 🎥 **Smooth Animaties** | Vloeiende camera bewegingen tussen locaties |
| 🦀 **Easter Eggs** | Ontdek de Crab People... taste like crab, talk like people! |

---

## 🛠️ Technische Stack

```
Frontend Framework    →  React 18
3D Rendering         →  React Three Fiber + Three.js
Physics Engine       →  Rapier (via @react-three/rapier)
Animaties            →  GSAP
3D Modeling          →  Blender
Build Tool           →  Vite
```

---

## 🚀 Installatie & Starten

```bash
# Clone het project
git clone [repository-url]
cd webMap

# Installeer dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in je browser.

---

## 📂 Projectstructuur

```
webMap/
│
├── src/
│   ├── App.jsx                    # Hoofdlogica: camera, audio, state
│   ├── components/
│   │   ├── UI/                    # Interface componenten
│   │   │   ├── InfoPanel.jsx      # Locatie-info + character audio
│   │   │   ├── PoiList.jsx        # Navigatie sidebar
│   │   │   ├── IntroScreen.jsx    # Startscherm
│   │   │   └── LoadingScreen.jsx  # Laadscherm met progress
│   │   ├── Effects/
│   │   │   └── SnowSystem.jsx     # Physics-based sneeuwsysteem
│   │   ├── Environment/
│   │   │   └── Clouds.jsx         # Procedurele wolken
│   │   └── Models/
│   │       └── Model.jsx          # 3D model loader met hover effect
│   ├── scenes/
│   │   └── SouthParkScene.jsx     # Hoofd 3D scene
│   └── data/
│       └── poiData.js             # Alle locatie definities
│
├── public/
│   ├── audio/                     # 40+ audio bestanden
│   └── images/characters/         # Character afbeeldingen
│
└── 3Dmodels/                      # GLB modellen (Blender exports)
```

---

## 🎮 Besturing

| Actie | Wat gebeurt er |
|-------|----------------|
| **Klik + Sleep** | Camera roteren |
| **Scrollen** | In/uitzoomen |
| **Klik op locatie (lijst)** | Camera vliegt naar locatie |
| **Klik op character (panel)** | Audio afspelen |
| **ESC of X** | Panel sluiten, terug naar overzicht |
| **Snow toggle** | Sneeuw aan/uit zetten |

---

## ✨ Features in Detail

### 🎥 Intro Sequence
Bij het starten krijg je een welkomstscherm, daarna laadt de 3D scene op de achtergrond. Na het laden speelt de iconische South Park gitaar riff, gevolgd door een sunrise-effect en fly-in animatie vanaf het welkomstbord.

### 🏘️ Points of Interest
Meer dan 30 locaties onderverdeeld in:
- **Houses** - Stan, Kyle, Cartman, Kenny, Butters, en meer
- **Buildings** - School, City Hall, Tweek Bros, Mall, Skeeter's Bar
- **Landmarks** - Bus Stop, South Park Sign, Stark's Pond

### 🔊 Audio Systeem
- Ambient vogelgeluiden die automatisch pauzeren tijdens character audio
- Elk personage heeft een eigen quote
- Volume balancing tussen ambient en character clips

### ❄️ Sneeuwsysteem
Toggle rechtsboven in het scherm. Activeert 1200 physics-gesimuleerde sneeuwvlokken die realistisch vallen en verdwijnen bij de grond. De lucht kleurt automatisch grijzer.

### 🦀 Easter Eggs
- Klik 5+ keer op de Crab People voor een verrassend effect
- Luister naar het Chinpokomon thema in de mall
- "Oh my God, they killed Kenny!" - je weet wat er gebeurt

---

## 🎨 Visuele Highlights

- **Sunrise Animatie** - De lucht gaat van warm oranje naar helder blauw bij het opstarten
- **Hover Glow** - Gebouwen lichten op wanneer je eroverheen hovert
- **South Park Stijl UI** - Comic Sans, felle kleuren, dikke borders
- **Procedurele Wolken** - Dynamisch gegenereerde wolken die bewegen en van kleur veranderen

---

## 🔧 Technische Aanpak

### Camera Systeem
GSAP wordt gebruikt voor alle camera animaties. Bij het selecteren van een POI worden zowel de camera positie als het focuspunt (OrbitControls target) simultaan geanimeerd voor een natuurlijke beweging.

### Physics
Het sneeuwsysteem draait op Rapier, een Rust-based physics engine gecompileerd naar WebAssembly. Elke sneeuwvlok is een RigidBody met gravity en collision detection.

### Performance Optimalisaties
- Model instantiëring met `useMemo` om re-renders te voorkomen
- Efficiënte material handling voor hover effecten
- Lazy loading van 3D assets

---

## 👤 Gemaakt door

**Emilien**  
Tech3 - Jaar 2  
December 2025 - Januari 2026

---

## 📜 Disclaimer

Dit project is gemaakt voor educatieve doeleinden.  
South Park™ is eigendom van Comedy Central / Paramount Global.  
Alle character assets en audio zijn gebruikt onder fair use voor een schoolproject.

---

<p align="center">
  <i>"Screw you guys, I'm going home!"</i>
</p>
