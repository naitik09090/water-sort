<div align="center">

```
██╗    ██╗ █████╗ ████████╗███████╗██████╗     ███████╗ ██████╗ ██████╗ ████████╗
██║    ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝
██║ █╗ ██║███████║   ██║   █████╗  ██████╔╝    ███████╗██║   ██║██████╔╝   ██║   
██║███╗██║██╔══██║   ██║   ██╔══╝  ██╔══██╗    ╚════██║██║   ██║██╔══██╗   ██║   
╚███╔███╔╝██║  ██║   ██║   ███████╗██║  ██║    ███████║╚██████╔╝██║  ██║   ██║   
 ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
```

### 💧 *Sort the Colours · Fill the Tubes* 💧

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0d1117)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=0d1117)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=0d1117)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Animations-1572B6?style=for-the-badge&logo=css3&logoColor=white&labelColor=0d1117)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<br/>

[![License](https://img.shields.io/badge/License-MIT-b0ff57?style=flat-square&labelColor=0d1117)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-00f5ff?style=flat-square&labelColor=0d1117)](https://github.com/naitik09090/water-sort)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff6b9d?style=flat-square&labelColor=0d1117)](https://github.com/naitik09090/water-sort/pulls)

</div>

---

<div align="center">

## 🎮 &nbsp;What is Water Sort?

</div>

> **Water Sort** is a beautifully crafted browser puzzle game where your goal is to sort coloured water into tubes so that each tube contains only one colour. Simple to learn — endlessly satisfying to master.

<div align="center">

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│ 🟦🟦 │  │ 🟥🟥 │  │ 🟩🟩 │  │ 🟨🟨 │  │      │
│ 🟪🟦 │  │ 🟩🟥 │  │ 🟨🟩 │  │ 🟪🟨 │  │      │
│ 🟨🟪 │  │ 🟪🟩 │  │ 🟥🟨 │  │ 🟥🟪 │  │      │
│ 🟩🟨 │  │ 🟦🟪 │  │ 🟪🟥 │  │ 🟦🟩 │  │      │
└──────┘  └──────┘  └──────┘  └──────┘  └──────┘
  Pour colours strategically to sort them all! 🎯
```

</div>

---

## ✨ &nbsp;Features

| Feature | Description |
|---|---|
| 🎨 **12 Vibrant Colours** | Beautifully rendered colour palette for challenging puzzles |
| 🧩 **100+ Levels** | Progressively challenging levels from beginner to expert |
| 💫 **Smooth Animations** | Fluid pour animations with glowing arc dot effects |
| 🏆 **Win Celebrations** | Confetti burst + glowing win popup on level completion |
| 🔓 **Level Progression** | Unlock new levels as you complete each stage |
| 💾 **Auto Save** | Your progress is saved automatically in the browser |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet & mobile |
| ⚡ **No Ads · No Login** | Pure gameplay — no distractions |
| 🌙 **Dark Glassmorphism UI** | Premium dark theme with glowing effects throughout |

---

## 🚀 &nbsp;Getting Started

### Prerequisites

Make sure you have **Node.js ≥ 18** and **npm** installed.

```bash
node --version   # v18.x or higher
npm --version    # 9.x or higher
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/naitik09090/water-sort.git

# 2. Navigate to the project directory
cd water-sort

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser. 🎮

---

## 🗂️ &nbsp;Project Structure

```
water-sort/
│
├── 📁 public/
│   └── favicon.svg          # Custom game favicon (test tube + drop)
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Home.jsx          # 🏠 Landing screen with animations
│   │   ├── LevelSelect.jsx   # 🗺️  Level selection grid
│   │   └── water_Sort.jsx    # 🎮 Core game engine & logic
│   │
│   ├── App.jsx               # Root — screen router (home/levels/game)
│   ├── App.css               # Global reset & base styles
│   └── index.css             # Design tokens & utility styles
│
├── index.html                # Entry point + SEO meta tags
├── vite.config.js            # Vite build configuration
└── package.json
```

---

## 🎨 &nbsp;Screens

```
 ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
 │                     │     │                     │     │                     │
 │    💧 HOME PAGE     │────▶│  🗺️ LEVEL SELECT   │────▶│  🎮  GAME BOARD    │
 │                     │     │                     │     │                     │
 │  Animated drop icon │     │  Locked 🔒 /        │     │  Tubes + Pour       │
 │  WATER SORT title   │     │  Unlocked levels    │     │  animations         │
 │  ▶ PLAY button      │     │  Star ratings ⭐     │     │  Undo / Reset       │
 │  Feature badges     │     │                     │     │  Win popup 🎉       │
 └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

---

## 🧠 &nbsp;How to Play

1. **Tap** any tube to select it (it will highlight)
2. **Tap** another tube to pour the top colour into it
   - You can only pour if the top colours **match**, or the destination is **empty**
3. **Fill each tube** with a single colour to win the level
4. Use **Undo ↩** to take back your last move
5. Use **Reset 🔄** to restart the current level
6. Complete a level to **unlock the next one** and earn ⭐ stars

---

## 🛠️ &nbsp;Built With

<div align="center">

| Technology | Purpose |
|---|---|
| ⚛️ **React 18** | UI components & state management |
| ⚡ **Vite** | Lightning-fast dev server & bundler |
| 🎨 **Vanilla CSS** | Animations, glassmorphism, responsive layout |
| 🖼️ **SVG** | Custom favicon, water drop icons |
| 💾 **localStorage** | Persistent level progress |
| 🎞️ **Canvas API** | Ripple background effects on home screen |

</div>

---

## 📜 &nbsp;License

This project is licensed under the **MIT License** — feel free to fork, modify, and use it in your own projects.

---

<div align="center">

Made with 💧 and a lot of ☕ &nbsp;by **[Naitik](https://github.com/naitik09090)**

<br/>

⭐ **Star this repo** if you enjoyed the game!

<br/>

```
 💧   💧   💧   💧   💧   💧   💧   💧
```

</div>
