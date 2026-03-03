import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
import LevelSelect from './components/LevelSelect.jsx'
import WaterSortGame from './components/water_Sort.jsx'
import { useEffect } from 'react'

/*
  Routes:
    /           → Home screen
    /levels     → Level select screen
    /game/:lvl  → Game screen for level index `lvl` (0-based)
*/
export default function App() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const noSelectElements = document.querySelectorAll(".no-select");
      noSelectElements.forEach((el) => {
        el.style.userSelect = "none";
      });
    }
  }, []);
  return (
    <main id="main-content" className="no-select">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/game/:lvl" element={<WaterSortGame />} />
        {/* Fallback: any unknown path → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
