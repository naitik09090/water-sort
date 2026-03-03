import './App.css'
import { useState } from 'react'
import Home from './components/Home.jsx'
import LevelSelect from './components/LevelSelect.jsx'
import WaterSortGame from './components/water_Sort.jsx'

/*
  screen: "home" | "levels" | "game"
*/
export default function App() {
  const [screen, setScreen] = useState("home")
  const [startLvl, setStartLvl] = useState(0)
  // Increment every time we navigate TO levels so LevelSelect fully remounts
  // and reads fresh localStorage on each visit.
  const [levelsKey, setLevelsKey] = useState(0)

  function goLevels() { setLevelsKey(k => k + 1); setScreen("levels") }
  function goHome() { setScreen("home") }
  function startGame(idx) { setStartLvl(idx); setScreen("game") }
  function backToLevels() { setLevelsKey(k => k + 1); setScreen("levels") }
  // Called when player clicks "Next →" inside the game, so App tracks the new level
  function handleLevelChange(newIdx) { setStartLvl(newIdx) }

  if (screen === "home") return <Home onPlay={goLevels} />
  if (screen === "levels") return <LevelSelect key={levelsKey} onSelect={startGame} onBack={goHome} currentLvl={startLvl} />
  return <WaterSortGame initialLevel={startLvl} onBack={backToLevels} onLevelChange={handleLevelChange} />

}
