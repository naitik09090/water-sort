import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const TUBE_CAPACITY = 4;
const SEG_PCT = 100 / TUBE_CAPACITY; // 25%

const PALETTE = [
    { id: 1, a: "#ff6b9d", b: "#ff1f6e", c: "#8b0030", glow: "255,107,157" },
    { id: 2, a: "#00f5ff", b: "#00b8cc", c: "#004d5c", glow: "0,245,255" },
    { id: 3, a: "#b0ff57", b: "#6ad020", c: "#2a6600", glow: "163,255,64" },
    { id: 4, a: "#ffcc44", b: "#ff8800", c: "#883a00", glow: "255,180,60" },
    { id: 5, a: "#d580ff", b: "#a020f0", c: "#4b007a", glow: "200,100,255" },
    { id: 6, a: "#ffe055", b: "#f5c200", c: "#7a5800", glow: "255,210,70" },
    { id: 7, a: "#ff7a45", b: "#e84000", c: "#7a1800", glow: "255,120,69" },
    { id: 8, a: "#80c8ff", b: "#2288ee", c: "#003880", glow: "128,200,255" },
    { id: 9, a: "#ffffff", b: "#cccccc", c: "#666666", glow: "255,255,255" },
    { id: 10, a: "#ff0000", b: "#aa0000", c: "#550000", glow: "255,0,0" },
];

const LEVELS = [
    { n: 3, e: 2, label: "Level 1", icon: "💧", tier: "Easy" },
    { n: 3, e: 2, label: "Level 2", icon: "💧", tier: "Easy" },
    { n: 3, e: 2, label: "Level 3", icon: "💧", tier: "Easy" },
    { n: 4, e: 2, label: "Level 4", icon: "🌊", tier: "Easy" },
    { n: 4, e: 2, label: "Level 5", icon: "🌊", tier: "Easy" },
    { n: 4, e: 2, label: "Level 6", icon: "🌊", tier: "Easy" },
    { n: 5, e: 2, label: "Level 7", icon: "🌀", tier: "Easy" },
    { n: 5, e: 2, label: "Level 8", icon: "🌀", tier: "Easy" },
    { n: 5, e: 2, label: "Level 9", icon: "🌀", tier: "Medium" },
    { n: 5, e: 2, label: "Level 10", icon: "🌀", tier: "Medium" },
    { n: 6, e: 2, label: "Level 11", icon: "⚡", tier: "Medium" },
    { n: 6, e: 2, label: "Level 12", icon: "⚡", tier: "Medium" },
    { n: 6, e: 2, label: "Level 13", icon: "⚡", tier: "Medium" },
    { n: 6, e: 2, label: "Level 14", icon: "🔥", tier: "Medium" },
    { n: 7, e: 2, label: "Level 15", icon: "🔥", tier: "Medium" },
    { n: 7, e: 2, label: "Level 16", icon: "🔥", tier: "Hard" },
    { n: 7, e: 2, label: "Level 17", icon: "💎", tier: "Hard" },
    { n: 7, e: 2, label: "Level 18", icon: "💎", tier: "Hard" },
    { n: 8, e: 2, label: "Level 19", icon: "💎", tier: "Hard" },
    { n: 8, e: 2, label: "Level 20", icon: "👑", tier: "Hard" },
    { n: 8, e: 2, label: "Level 21", icon: "⚡", tier: "Hard" },
    { n: 8, e: 2, label: "Level 22", icon: "⚡", tier: "Expert" },
    { n: 8, e: 2, label: "Level 23", icon: "⚡", tier: "Expert" },
    { n: 9, e: 2, label: "Level 24", icon: "🔥", tier: "Expert" },
    { n: 9, e: 2, label: "Level 25", icon: "🔥", tier: "Expert" },
    { n: 9, e: 2, label: "Level 26", icon: "🔥", tier: "Expert" },
    { n: 9, e: 2, label: "Level 27", icon: "💎", tier: "Master" },
    { n: 9, e: 2, label: "Level 28", icon: "💎", tier: "Master" },
    { n: 10, e: 2, label: "Level 29", icon: "💎", tier: "Master" },
    { n: 10, e: 2, label: "Level 30", icon: "👑", tier: "Master" },
    { n: 10, e: 2, label: "Level 31", icon: "🔥", tier: "Master" },
    { n: 10, e: 2, label: "Level 32", icon: "🔥", tier: "Legend" },
    { n: 10, e: 2, label: "Level 33", icon: "🔥", tier: "Legend" },
    { n: 10, e: 2, label: "Level 34", icon: "🔥", tier: "Legend" },
    { n: 10, e: 2, label: "Level 35", icon: "💎", tier: "Legend" },
    { n: 10, e: 2, label: "Level 36", icon: "💎", tier: "Legend" },
    { n: 10, e: 1, label: "Level 37", icon: "💎", tier: "Legend" },
    { n: 10, e: 1, label: "Level 38", icon: "👑", tier: "Legend" },
    { n: 10, e: 1, label: "Level 39", icon: "👑", tier: "Legend" },
    { n: 10, e: 1, label: "Level 40", icon: "👑", tier: "Legend" },
];

/* ══════════════════════════════════════════════════════════════
   GAME LOGIC
══════════════════════════════════════════════════════════════ */
const gc = (id) => PALETTE.find((p) => p.id === id);
const top = (t) => (t.length ? t[t.length - 1] : null);

function countTop(t) {
    if (!t.length) return 0;
    const h = top(t); let n = 0;
    for (let i = t.length - 1; i >= 0 && t[i] === h; i--) n++;
    return n;
}
const done = (t) => t.length === TUBE_CAPACITY && t.every((c) => c === t[0]);
const solved = (ts) => ts.every((t) => !t.length || done(t));

function canPour(f, t) {
    if (!f.length) return false;
    if (t.length === TUBE_CAPACITY) return false;
    if (!t.length) return true;
    return top(f) === top(t);
}
function pour(ts, fi, ti) {
    const nx = ts.map((t) => [...t]);
    const f = nx[fi], t = nx[ti];
    const n = Math.min(TUBE_CAPACITY - t.length, countTop(f));
    for (let i = 0; i < n; i++) t.push(f.pop());
    return nx;
}
function gen(n, e) {
    const all = [];
    for (let c = 0; c < n; c++)
        for (let i = 0; i < TUBE_CAPACITY; i++) all.push(PALETTE[c].id);
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    const ts = [];
    for (let i = 0; i < n; i++) ts.push(all.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
    for (let i = 0; i < e; i++) ts.push([]);
    return ts;
}

/* ══════════════════════════════════════════════════════════════
   CSS KEYFRAMES  (injected once)
══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;overflow-x:hidden;background:#020508}
#root{max-width:100%;padding:0}

@keyframes ws-wave{
  0%{transform:translateX(0)} 100%{transform:translateX(29.4%)}
}
@keyframes ws-fall{
  0%{transform:translateY(-12px) rotate(0deg);opacity:1}
  100%{transform:translateY(110vh) rotate(600deg);opacity:0}
}
@keyframes ws-shimmer{
  0%,100%{opacity:.12} 50%{opacity:.85}
}
@keyframes ws-pop{
  0%{transform:scale(0) rotate(-15deg);opacity:0}
  65%{transform:scale(1.3) rotate(4deg)}
  100%{transform:scale(1) rotate(0deg);opacity:1}
}
@keyframes ws-fadein{from{opacity:0}to{opacity:1}}
@keyframes ws-winpop{
  0%{transform:scale(0.7) translateY(30px);opacity:0}
  70%{transform:scale(1.04) translateY(-4px)}
  100%{transform:scale(1) translateY(0);opacity:1}
}
@keyframes ws-orb{
  0%,100%{transform:translate(0,0) scale(1)}
  40%{transform:translate(45px,-35px) scale(1.1)}
  70%{transform:translate(-20px,22px) scale(0.9)}
}
@keyframes ws-title{
  0%{background-position:-300% center} 100%{background-position:300% center}
}
@keyframes ws-pulse{
  0%,100%{box-shadow:0 0 0 0 rgba(0,245,255,.35)}
  50%{box-shadow:0 0 0 8px rgba(0,245,255,0)}
}
/* ── POUR KEYFRAMES ── */
/* Water RISES from the bottom: scaleY starts at 0 (invisible, transform-origin bottom),
   animates to scaleY(1) — fully visible, growing upward like water filling a tube. */
@keyframes ws-seg-fill{
  0%  { transform: scaleY(0); opacity: 0.6; }
  20% { opacity: 1; }
  100%{ transform: scaleY(1); opacity: 1; }
}
/* Bubble dot rising animation for the fill effect */
@keyframes ws-bubble-rise{
  0%   { transform: translateY(0)   scale(0.4); opacity: 0;   }
  15%  { opacity: 0.85; }
  60%  { transform: translateY(-58%) scale(1);   opacity: 0.7; }
  100% { transform: translateY(-110%) scale(0.5); opacity: 0;  }
}
@keyframes ws-ring{
  0%{r:0;stroke-opacity:1;stroke-width:3}
  100%{r:22;stroke-opacity:0;stroke-width:0.5}
}
/* ── WIN ANIMATION KEYFRAMES ── */
@keyframes ws-letter-wave{
  0%,100%{transform:translateY(0) scale(1);filter:brightness(1)}
  50%{transform:translateY(-14px) scale(1.18);filter:brightness(1.5)}
}
@keyframes ws-border-spin{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes ws-tube-fill{
  from{transform:scaleY(0);transform-origin:bottom}
  to{transform:scaleY(1);transform-origin:bottom}
}
@keyframes ws-star-pop{
  0%{transform:scale(0) rotate(-30deg);opacity:0}
  60%{transform:scale(1.35) rotate(6deg);opacity:1}
  80%{transform:scale(0.92) rotate(-2deg)}
  100%{transform:scale(1) rotate(0deg);opacity:1}
}
@keyframes ws-particle-float{
  0%{transform:translateY(0) rotate(0deg) scale(1);opacity:0.9}
  50%{transform:translateY(-38px) rotate(180deg) scale(1.15);opacity:0.6}
  100%{transform:translateY(-70px) rotate(360deg) scale(0.6);opacity:0}
}
@keyframes ws-ripple{
  0%{transform:scale(0.6);opacity:0.8}
  100%{transform:scale(2.4);opacity:0}
}
@keyframes ws-glow-pulse{
  0%,100%{opacity:0.5;transform:scale(1)}
  50%{opacity:1;transform:scale(1.08)}
}
@keyframes ws-win-bg-shift{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
button{transition:all .2s cubic-bezier(.34,1.56,.64,1)}
button:hover:not(:disabled){filter:brightness(1.2);transform:translateY(-2px)}
button:active:not(:disabled){transform:translateY(1px);filter:brightness(.92)}
`;

/* ══════════════════════════════════════════════════════════════
   WATER SEGMENT — uses Web Animations API for fill (works on all mobile browsers)
   Includes bubble/dot animation when a new color fills in.
 ══════════════════════════════════════════════════════════════ */
// Bubble config: [leftPercent, sizePx, delayFactor]
const BUBBLE_CFG = [
    [18, 7, 0.0],
    [42, 5, 0.18],
    [65, 8, 0.08],
    [80, 5, 0.28],
];

function Seg({ colorId, slotIdx, isTop, isFull, isNew, fillDelay }) {
    const col = gc(colorId);
    const innerRef = useRef(null);
    const bubbleRefs = useRef([]);

    useEffect(() => {
        if (!isNew || !col) return;
        const delay = fillDelay || 0;

        // ── Main fill: scaleY 0 → 1, growing upward from the bottom
        if (innerRef.current) {
            innerRef.current.animate(
                [
                    { transform: 'scaleY(0)', opacity: 0, offset: 0 },
                    { transform: 'scaleY(0.18)', opacity: 0.9, offset: 0.14 },
                    { transform: 'scaleY(1)', opacity: 1, offset: 1 },
                ],
                { duration: 680, delay, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
            );
        }

        // ── Bubble dots: each floats upward from the bottom with a staggered delay
        bubbleRefs.current.forEach((el, i) => {
            if (!el) return;
            const cfg = BUBBLE_CFG[i];
            el.animate(
                [
                    { transform: 'translateY(0) scale(0.4)', opacity: 0 },
                    { transform: 'translateY(-22%) scale(1)', opacity: 0.88, offset: 0.18 },
                    { transform: 'translateY(-75%) scale(0.9)', opacity: 0.6, offset: 0.65 },
                    { transform: 'translateY(-115%) scale(0.4)', opacity: 0 },
                ],
                {
                    duration: 620 + i * 55,
                    delay: delay + Math.round(cfg[2] * 400),
                    easing: 'ease-in-out',
                    fill: 'forwards',
                }
            );
        });
    }, []); // only on mount

    if (!col) return null;

    return (
        <div style={{
            position: "absolute", left: 0, right: 0,
            bottom: `${slotIdx * SEG_PCT}%`, height: `${SEG_PCT}%`,
            borderRadius: isTop ? (isFull ? "0" : "5px 5px 0 0") : "0",
            zIndex: slotIdx + 1,
            overflow: "hidden",
        }}>
            {/* ── Main fill layer ── */}
            <div
                ref={innerRef}
                style={{
                    position: "absolute", inset: 0,
                    transformOrigin: "bottom center",
                    transform: isNew ? "scaleY(0)" : "scaleY(1)",
                    opacity: isNew ? 0 : 1,
                }}
            >
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,${col.a} 0%,${col.b} 55%,${col.c} 100%)` }} />
                {isTop && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg,rgba(255,255,255,.42) 0%,transparent 100%)", pointerEvents: "none" }} />}
                {isTop && <div style={{ position: "absolute", top: 0, left: "-120%", width: "340%", height: "100%", background: "linear-gradient(90deg,transparent 30%,rgba(255,255,255,.5) 50%,transparent 70%)", animation: "ws-wave 2.2s linear infinite", pointerEvents: "none" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.16) 0%,transparent 35%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 14px rgba(${col.glow},.3)`, pointerEvents: "none" }} />
            </div>

            {/* ── Bubble dots ── only rendered for new (freshly filled) segments */}
            {isNew && BUBBLE_CFG.map((cfg, i) => (
                <div
                    key={i}
                    ref={el => { bubbleRefs.current[i] = el; }}
                    style={{
                        position: "absolute",
                        bottom: "4%",
                        left: `${cfg[0]}%`,
                        width: cfg[1],
                        height: cfg[1],
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 35% 35%, ${col.a}, ${col.b})`,
                        boxShadow: `0 0 ${cfg[1] + 2}px rgba(${col.glow},.75)`,
                        opacity: 0,
                        pointerEvents: "none",
                        zIndex: slotIdx + 5,
                    }}
                />
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   POUR STREAM  —  dot-only animation (no solid line)
   Glowing circles race along the arc using SVG animateMotion.
══════════════════════════════════════════════════════════════ */
// Dot config: [radius, opacity, duration(ms), delay(ms)]
const DOT_CFG = [
    [9, 1.00, 650, 0],
    [6, 0.80, 680, 90],
    [10, 0.95, 640, 180],
    [6, 0.75, 670, 270],
    [8, 0.90, 660, 360],
    [5, 0.70, 690, 450],
    [9, 0.85, 645, 540],
    [6, 0.78, 675, 630],
];

function PourStream({ info }) {
    const ringRef = useRef(null);
    const animsRef = useRef([]);

    // Ring splash at destination — still uses Web API since SMIL r animation is less reliable
    useEffect(() => {
        if (!info || info.phase !== 'stream') return;
        animsRef.current.forEach(a => { try { a.cancel(); } catch (_) { } });
        animsRef.current = [];
        if (!ringRef.current) return;

        const { toRect, col } = info;
        const isFlying = !!info.isFar;
        const ex = toRect.left + toRect.width / 2;
        const ey = isFlying ? toRect.top + toRect.height * 0.60 : toRect.top + toRect.height * 0.22;

        ringRef.current.setAttribute('cx', `${ex}`);
        ringRef.current.setAttribute('cy', `${ey}`);
        ringRef.current.setAttribute('stroke', col.a);

        const a = ringRef.current.animate(
            [
                { r: '0', strokeOpacity: 1, strokeWidth: '6' },
                { r: '22', strokeOpacity: 0.4, strokeWidth: '2.5', offset: 0.60 },
                { r: '36', strokeOpacity: 0, strokeWidth: '0.5' },
            ],
            { duration: 600, delay: 560, easing: 'ease-out', fill: 'forwards' }
        );
        animsRef.current.push(a);
        // ⚠️ No return cleanup — handled by unmount effect below
    }, [info]);

    useEffect(() => {
        return () => { animsRef.current.forEach(a => { try { a.cancel(); } catch (_) { } }); };
    }, []);

    if (!info) return null;

    // ── Compute path coordinates synchronously from info ─────────
    const { fromRect, toRect, col, tiltDir } = info;
    const isFlying = !!info.isFar;
    const tubeLift = fromRect.height > 0 ? fromRect.height : 160;
    const flyDy = isFlying
        ? (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2)
        : 0;

    const sx = isFlying
        ? fromRect.left + fromRect.width / 2 + (info.flyDx || 0)
        : fromRect.left + fromRect.width / 2;
    const sy = isFlying
        ? fromRect.top + flyDy - tubeLift * 0.38 + 10
        : fromRect.top - tubeLift * 0.24 + 8;

    const ex = toRect.left + toRect.width / 2;
    const ey = isFlying ? toRect.top + toRect.height * 0.60 : toRect.top + toRect.height * 0.22;

    const dx = Math.abs(ex - sx);
    let midX, midY;
    if (isFlying) {
        const dir = tiltDir || (ex > sx ? 1 : -1);
        midX = sx + dir * Math.max(18, fromRect.width * 0.28);
        midY = sy + (ey - sy) * 0.35;
    } else if (ey > sy + 50) {
        const dir = tiltDir || (ex > sx ? 1 : -1);
        midX = sx + dir * Math.min(70, (ey - sy) * 0.26) + (ex - sx) * 0.28;
        midY = sy + (ey - sy) * 0.18;
    } else {
        midX = (sx + ex) / 2;
        midY = Math.min(sy, ey) - Math.max(50, dx * 0.40) - 8;
    }
    const pathD = `M${sx},${sy} Q${midX},${midY} ${ex},${ey}`;
    // unique ID so React key reuse doesn't share the path element across pours
    const pathId = `pp-${info.fromIdx}-${info.toIdx}`;

    return (
        <svg style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 300, overflow: 'visible' }}>
            <defs>
                {/* Soft bloom for the outer halo of each dot */}
                <filter id="ps-bloom" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="8" />
                </filter>
                {/* Slight glow that merges with source graphic */}
                <filter id="ps-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Hidden path that dots follow — no stroke, just geometry */}
            <path id={pathId} d={pathD} fill="none" stroke="none" />

            {/* 8 glowing dots racing along the path, staggered */}
            {DOT_CFG.map(([r, op, dur, delay], i) => {
                const durS = `${dur}ms`;
                const delayS = `${delay}ms`;
                return (
                    <g key={i}>
                        {/* Outer bloom halo */}
                        <circle r={r * 2.2} fill={col.b} filter="url(#ps-bloom)" opacity={0}>
                            <animateMotion dur={durS} begin={delayS} repeatCount="indefinite" calcMode="spline"
                                keyTimes="0;1" keySplines="0.4 0 0.2 1">
                                <mpath href={`#${pathId}`} />
                            </animateMotion>
                            <animate attributeName="opacity"
                                values={`0;${op * 0.45};${op * 0.45};0`}
                                keyTimes="0;0.1;0.85;1"
                                dur={durS} begin={delayS} repeatCount="indefinite" />
                        </circle>

                        {/* Core colored dot */}
                        <circle r={r} fill={col.a} filter="url(#ps-dot-glow)" opacity={0}>
                            <animateMotion dur={durS} begin={delayS} repeatCount="indefinite" calcMode="spline"
                                keyTimes="0;1" keySplines="0.4 0 0.2 1">
                                <mpath href={`#${pathId}`} />
                            </animateMotion>
                            <animate attributeName="opacity"
                                values={`0;${op};${op};0`}
                                keyTimes="0;0.08;0.88;1"
                                dur={durS} begin={delayS} repeatCount="indefinite" />
                            <animate attributeName="r"
                                values={`${r * 0.5};${r};${r * 1.1};${r * 0.4}`}
                                keyTimes="0;0.1;0.5;1"
                                dur={durS} begin={delayS} repeatCount="indefinite" />
                        </circle>

                        {/* Bright white center spark */}
                        <circle r={r * 0.42} fill="white" opacity={0}>
                            <animateMotion dur={durS} begin={delayS} repeatCount="indefinite" calcMode="spline"
                                keyTimes="0;1" keySplines="0.4 0 0.2 1">
                                <mpath href={`#${pathId}`} />
                            </animateMotion>
                            <animate attributeName="opacity"
                                values="0;0.95;0.95;0"
                                keyTimes="0;0.08;0.85;1"
                                dur={durS} begin={delayS} repeatCount="indefinite" />
                        </circle>
                    </g>
                );
            })}

            {/* Splash ring at destination (animated by Web API in useEffect) */}
            <circle ref={ringRef} cx={ex} cy={ey} r={0}
                fill="none" strokeWidth={4} stroke={col.a}
                filter="url(#ps-dot-glow)" style={{ opacity: 0 }} />
        </svg>
    );
}

/* ══════════════════════════════════════════════════════════════
   TUBE
══════════════════════════════════════════════════════════════ */
function Tube({ tube, prev, onClick, selected, hinted, isDone, sz, pourKey,
    isPouringSrc, tiltDir, pourPhase, tubeIdx }) {

    const { w, h, r } = sz;

    const border = selected ? "#00f5ff"
        : hinted ? "#ffdd22"
            : isDone ? "#b0ff57"
                : "rgba(255,255,255,0.18)";

    const glow = selected
        ? "0 0 28px rgba(0,245,255,0.7), inset 0 0 16px rgba(0,245,255,0.1)"
        : isDone ? "0 0 24px rgba(163,255,64,0.55)"
            : hinted ? "0 0 20px rgba(255,220,34,0.5)"
                : "inset 0 6px 24px rgba(0,0,0,0.6)";

    /* ── Phase-aware transform ──
       Wrapper div (in JSX) handles translateX (horizontal fly) and zIndex.
       Tube only handles translateY + rotate, always pivoting from its OWN top-center.
       Lift amounts scale with bottle height so bigger mobile bottles move properly. */
    let transform, transition;
    const td = (tiltDir || 1) * 22;   // tilt degrees when pouring
    // Scale lift proportionally to the bottle height passed via sz
    const liftPx = Math.round(h * 0.38);   // ~38 % of bottle height (fly/lift)
    const tiltLift = Math.round(h * 0.24);   // ~24 % (lower when tilted to pour)

    if (isPouringSrc) {
        switch (pourPhase) {
            case 'lift':   // lift straight up
                transform = `translateY(-${liftPx}px) scale(1.12)`;
                transition = `transform 0.28s cubic-bezier(0.33,1,0.68,1)`;
                break;
            case 'fly':    // wrapper is sliding — tube stays elevated
                transform = `translateY(-${liftPx}px) scale(1.12)`;
                transition = `transform 0.35s linear`;
                break;
            case 'hover':  // settle gently above dest
                transform = `translateY(-${Math.round(liftPx * 0.85)}px) scale(1.10)`;
                transition = `transform 0.18s ease-out`;
                break;
            case 'tilt':   // tilt to pour
            case 'stream':
            case 'fill':
                transform = `translateY(-${tiltLift}px) scale(1.09) rotate(${td}deg)`;
                transition = `transform 0.32s cubic-bezier(0.33,1,0.68,1)`;
                break;
            case 'flyback': // wrapper slides home, tube descends/untilts
                transform = `translateY(0px) scale(1) rotate(0deg)`;
                transition = `transform 0.50s cubic-bezier(0.33,1,0.68,1)`;
                break;
            default:
                transform = `translateY(-${tiltLift}px) scale(1.09) rotate(${(tiltDir || 1) * 25}deg)`;
                transition = `transform 0.32s cubic-bezier(0.33,1,0.68,1)`;
        }
    } else {
        transform = selected ? "translateY(-22px) scale(1.09)"
            : hinted ? "translateY(-11px) scale(1.04)"
                : "translateY(0) scale(1)";
        transition = "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)";
    }

    return (
        <div onClick={onClick} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            cursor: "pointer", userSelect: "none",
            transformOrigin: "top center", transition, transform,
        }}>
            {/* NECK */}
            <div style={{
                width: w + 12, height: 16, borderRadius: "10px 10px 0 0",
                border: `2.5px solid ${border}`, borderBottom: "none",
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(4px)",
                marginBottom: -3, zIndex: 10, transition: "border-color 0.3s", boxSizing: "border-box",
            }} />

            {/* BODY */}
            <div style={{
                width: w, height: h, position: "relative",
                borderRadius: `0 0 ${r}px ${r}px`,
                border: `2.5px solid ${border}`,
                background: "rgba(6,12,38,0.82)", backdropFilter: "blur(8px)",
                overflow: "hidden", boxShadow: glow,
                transition: "border-color 0.32s, box-shadow 0.32s", boxSizing: "border-box",
            }}>
                {/* water segments — newly poured ones animate rising from bottom */}
                {tube.map((colorId, i) => {
                    // A segment is NEW if its slot didn't have this exact color before.
                    // Using (tubeIdx, i, colorId, pourKey) as key ensures:
                    //   • Stable segs (same color, same slot) keep their DOM node → no flicker
                    //   • Newly filled slots get a fresh mount → animation fires
                    //   • pourKey change (undo/restart) forces full remount of all segs
                    const isNew = !(prev && prev[i] === colorId);
                    // Stagger each new segment by 60ms for a sequential fill effect
                    // (only relevant if multiple layers pour at once)
                    const fillDelay = isNew ? Math.max(0, (i - (prev ? prev.length : i)) * 60) : 0;
                    return (
                        <Seg
                            key={`t${tubeIdx}-s${i}-c${colorId}-p${pourKey}`}
                            colorId={colorId} slotIdx={i}
                            isTop={i === tube.length - 1}
                            isFull={tube.length === TUBE_CAPACITY}
                            isNew={isNew}
                            fillDelay={fillDelay}
                        />
                    );
                })}

                {/* glass left shine */}
                <div style={{
                    position: "absolute", top: 0, left: 5, bottom: 0, width: 8,
                    background: "linear-gradient(90deg,rgba(255,255,255,.15),transparent)",
                    pointerEvents: "none", zIndex: 20,
                }} />
                {/* glass right dark */}
                <div style={{
                    position: "absolute", top: 0, right: 4, bottom: 0, width: 6,
                    background: "linear-gradient(270deg,rgba(0,0,0,.25),transparent)",
                    pointerEvents: "none", zIndex: 20,
                }} />
                {/* top rim gloss */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 6,
                    background: "rgba(255,255,255,.06)",
                    pointerEvents: "none", zIndex: 20,
                }} />
            </div>

            {/* ── DONE BADGE ── */}
            <div style={{
                marginTop: 8, width: 22, height: 22,
                borderRadius: "50%",
                border: isDone ? "2px solid #b0ff57" : "2px solid transparent",
                background: isDone ? "rgba(163,255,64,.18)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#b0ff57",
                transition: "all 0.4s",
                animation: isDone ? "ws-pop 0.45s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            }}>
                {isDone ? "✓" : ""}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   CONFETTI  (upgraded)
══════════════════════════════════════════════════════════════ */
function Confetti({ on }) {
    if (!on) return null;
    const bits = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2.2,
        size: Math.random() * 11 + 4,
        color: PALETTE[i % PALETTE.length].a,
        dur: 2.4 + Math.random() * 2,
        shape: i % 3 === 0 ? '2px' : i % 3 === 1 ? '50%' : '0',
        rotDir: i % 2 === 0 ? 600 : -600,
    }));
    return (
        <>
            {bits.map((b) => (
                <div key={b.id} style={{
                    position: 'fixed',
                    left: `${b.x}%`, top: '-20px',
                    width: b.size, height: b.size * (b.shape === '2px' ? 2.4 : 1),
                    borderRadius: b.shape,
                    background: b.color,
                    boxShadow: `0 0 10px ${b.color}99`,
                    animation: `ws-fall ${b.dur}s ease-in forwards`,
                    animationDelay: `${b.delay}s`,
                    zIndex: 500, pointerEvents: 'none',
                }} />
            ))}
        </>
    );
}

/* ══════════════════════════════════════════════════════════════
   WIN MODAL  — cinematic, liquid-themed
══════════════════════════════════════════════════════════════ */
function WinModal({ moves, lvlIdx, onNext, onRetry, onLevels }) {
    // Star rating: 3 = ≤ par, 2 = ≤ par*1.6, 1 = any
    const par = (lvlIdx + 1) * 3 + 4;
    const stars = moves <= par ? 3 : moves <= Math.round(par * 1.6) ? 2 : 1;
    const sortedLetters = 'SORTED!'.split('');
    const letterColors = ['#00f5ff', '#48cfad', '#b0ff57', '#ffd700', '#ff6b9d', '#c678dd', '#00f5ff'];
    const miniTubeColors = [
        ['#ff6b9d', '#c678dd', '#00f5ff', '#b0ff57'],
        ['#ffd700', '#ff8c42', '#48cfad', '#ff6b9d'],
        ['#00f5ff', '#b0ff57', '#ffd700', '#c678dd'],
    ];

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,3,12,0.92)',
            backdropFilter: 'blur(22px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 400, animation: 'ws-fadein 0.35s ease',
        }}>
            {/* Ripple rings */}
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 320 + i * 120, height: 320 + i * 120,
                    borderRadius: '50%',
                    border: `1.5px solid ${['rgba(0,245,255,0.18)', 'rgba(176,255,87,0.12)', 'rgba(255,107,157,0.09)'][i]}`,
                    animation: `ws-ripple ${2.2 + i * 0.7}s ease-out infinite`,
                    animationDelay: `${i * 0.55}s`,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Floating particle orbs */}
            {Array.from({ length: 16 }, (_, i) => (
                <div key={`p${i}`} style={{
                    position: 'absolute',
                    left: `${10 + (i * 37 + 13) % 80}%`,
                    top: `${15 + (i * 53 + 7) % 70}%`,
                    width: 6 + (i % 4) * 3,
                    height: 6 + (i % 4) * 3,
                    borderRadius: '50%',
                    background: PALETTE[i % PALETTE.length].a,
                    boxShadow: `0 0 12px ${PALETTE[i % PALETTE.length].a}`,
                    animation: `ws-particle-float ${2.2 + (i % 4) * 0.6}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.31) % 2}s`,
                    pointerEvents: 'none', opacity: 0.7,
                }} />
            ))}

            {/* Card */}
            <div style={{
                position: 'relative',
                textAlign: 'center',
                padding: 'clamp(28px,5vw,48px) clamp(28px,7vw,56px)',
                background: 'linear-gradient(145deg,rgba(6,14,44,0.97),rgba(2,6,22,0.97))',
                borderRadius: 32,
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 0 0 2px rgba(0,245,255,0.25), 0 0 80px rgba(0,245,255,0.18), 0 0 160px rgba(176,255,87,0.10), inset 0 1px 0 rgba(255,255,255,0.08)',
                animation: 'ws-winpop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
                maxWidth: 'min(90vw,420px)', width: '100%',
                overflow: 'hidden',
            }}>
                {/* Animated top border glow */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg,#00f5ff,#b0ff57,#ff6b9d,#ffd700,#c678dd,#00f5ff)',
                    backgroundSize: '300% 100%',
                    animation: 'ws-border-spin 3s linear infinite',
                    borderRadius: '32px 32px 0 0',
                }} />

                {/* Glow core */}
                <div style={{
                    position: 'absolute', top: '30%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(0,245,255,0.08),transparent 70%)',
                    animation: 'ws-glow-pulse 2.4s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />

                {/* SORTED! — each letter waves with its own color + timing */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 10 }}>
                    {sortedLetters.map((ch, i) => (
                        <span key={i} style={{
                            fontSize: 'clamp(28px,6vw,46px)',
                            fontWeight: 900,
                            color: letterColors[i],
                            textShadow: `0 0 18px ${letterColors[i]}99, 0 0 40px ${letterColors[i]}44`,
                            animation: `ws-letter-wave 1.6s ease-in-out infinite`,
                            animationDelay: `${i * 0.12}s`,
                            display: 'inline-block',
                            letterSpacing: ch === '!' ? 0 : 2,
                        }}>{ch}</span>
                    ))}
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                    {[1, 2, 3].map(s => (
                        <span key={s} style={{
                            fontSize: 'clamp(20px,4vw,28px)',
                            filter: s <= stars
                                ? 'drop-shadow(0 0 8px rgba(255,215,0,0.9))'
                                : 'grayscale(1) opacity(0.25)',
                            animation: s <= stars ? `ws-star-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both` : 'none',
                            animationDelay: `${0.3 + (s - 1) * 0.15}s`,
                            display: 'inline-block',
                        }}>⭐</span>
                    ))}
                </div>

                {/* Level info */}
                <p style={{
                    color: 'rgba(0,245,255,0.75)', fontSize: 'clamp(11px,1.6vw,14px)',
                    margin: '0 0 3px', letterSpacing: '.15em', textTransform: 'uppercase',
                }}>
                    Level {lvlIdx + 1} Complete
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px,1.8vw,15px)', margin: '0 0 20px' }}>
                    Completed in <strong style={{ color: '#00f5ff' }}>{moves}</strong> moves
                    {stars === 3 && <span style={{ color: '#b0ff57', marginLeft: 8, fontSize: 12 }}>✦ Perfect!</span>}
                </p>

                {/* Mini animated tubes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 22 }}>
                    {miniTubeColors.map((cols, ti) => (
                        <div key={ti} style={{
                            width: 28, height: 70,
                            borderRadius: '0 0 14px 14px',
                            border: '2px solid rgba(255,255,255,0.18)',
                            background: 'rgba(6,12,38,0.7)',
                            overflow: 'hidden',
                            position: 'relative',
                            animation: `ws-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
                            animationDelay: `${0.4 + ti * 0.12}s`,
                            boxShadow: `0 0 12px ${cols[1]}44`,
                        }}>
                            {cols.map((c, ci) => (
                                <div key={ci} style={{
                                    position: 'absolute',
                                    bottom: `${ci * 25}%`, left: 0, right: 0, height: '25%',
                                    background: `linear-gradient(180deg,${c}dd,${c}88)`,
                                    transformOrigin: 'bottom',
                                    animation: `ws-tube-fill 0.4s ease-out both`,
                                    animationDelay: `${0.55 + ti * 0.12 + ci * 0.08}s`,
                                }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={onRetry} style={btnStyle('rgba(255,255,255,.07)', 'rgba(255,255,255,.65)', 'rgba(255,255,255,.2)')}>
                        ↺ Retry
                    </button>
                    {onLevels && (
                        <button onClick={onLevels} style={btnStyle('rgba(176,255,87,.1)', '#b0ff57', 'rgba(176,255,87,.35)')}>
                            ☰ Levels
                        </button>
                    )}
                    <button onClick={onNext} style={btnStyle('rgba(0,245,255,.14)', '#00f5ff', 'rgba(0,245,255,.5)')}>
                        {lvlIdx < LEVELS.length - 1 ? 'Next →' : 'Again →'}
                    </button>
                </div>

                {/* Bottom border glow */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg,#c678dd,#00f5ff,#b0ff57,#ff6b9d,#c678dd)',
                    backgroundSize: '300% 100%',
                    animation: 'ws-border-spin 3s linear infinite reverse',
                    borderRadius: '0 0 32px 32px',
                }} />
            </div>
        </div>
    );
}
function btnStyle(bg, color, border) {
    return {
        padding: '11px 26px', borderRadius: 50,
        border: `2px solid ${border}`, background: bg, color,
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
        letterSpacing: '.06em', backdropFilter: 'blur(6px)',
    };
}

/* ══════════════════════════════════════════════════════════════
   MAIN GAME
══════════════════════════════════════════════════════════════ */
export default function WaterSortGame() {
    const { lvl } = useParams();
    const navigate = useNavigate();
    const initialLevel = Math.max(0, Math.min(parseInt(lvl ?? "0", 10), LEVELS.length - 1));

    const [lvlIdx, setLvlIdx] = useState(initialLevel);
    const [tubes, setTubes] = useState(() => gen(3, 2));
    const [prev, setPrev] = useState(() => gen(3, 2));
    const [sel, setSel] = useState(null);
    const [hist, setHist] = useState([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [hint, setHint] = useState(null);
    const [party, setParty] = useState(false);
    const [pourKey, setPourKey] = useState(0);
    const [winW, setWinW] = useState(window.innerWidth);

    // Pour animation
    // pourState: null | { fromIdx, toIdx, col, fromRect, toRect, phase:'tilt'|'stream'|'fill' }
    const [pourState, setPourState] = useState(null);
    const isPouring = pourState !== null;
    const tubeRefs = useRef([]);
    const hintT = useRef(null);
    const timers = useRef([]);

    /* cleanup all timers on unmount */
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    /* responsive */
    useEffect(() => {
        const h = () => setWinW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    // Bigger bottles on mobile so they are easier to tap and animation is clearly visible
    // Sizes tuned so 3 bottles fit side-by-side on a narrow phone screen.
    const sz = (() => {
        if (winW < 360) return { w: 52, h: 156, r: 26, gap: 8 };
        if (winW < 480) return { w: 58, h: 172, r: 29, gap: 10 };
        if (winW < 600) return { w: 64, h: 190, r: 32, gap: 12 };
        if (winW < 860) return { w: 68, h: 200, r: 34, gap: 14 };
        return { w: 66, h: 188, r: 33, gap: 18 };
    })();

    /* rows must be defined before click handler so it's always current.
       3 per row on small phones: 5 tubes → [3, 2] rows; 7 tubes → [3, 3, 1] etc. */
    const perRow = winW < 400 ? 3 : winW < 540 ? 4 : winW < 760 ? 5 : winW < 1020 ? 6 : 8;
    const rows = [];
    for (let i = 0; i < tubes.length; i += perRow)
        rows.push(tubes.slice(i, i + perRow).map((_, j) => i + j));

    /* hasWonRef — gates unlock logic to exactly ONE genuine win per level */
    const hasWonRef = useRef(false);
    /* winSessionRef — unique ID per win; guards the 480ms popup timer so it
       cannot fire for a stale solve after restart() has been called. */
    const winSessionRef = useRef(0);

    /* level reset */
    useEffect(() => {
        hasWonRef.current = false;   // new level → allow win unlock again
        winSessionRef.current++;     // invalidate any pending win-popup timer from prev level
        const t = gen(LEVELS[lvlIdx].n, LEVELS[lvlIdx].e);
        setTubes(t); setPrev(t);
        setSel(null); setHist([]); setMoves(0);
        setWon(false); setHint(null); setParty(false); setPourKey(0);
        setPourState(null);
    }, [lvlIdx]);

    /* win check — popup timer only. Unlock is deferred to the "Next →" click
       so that Retry / returning to levels does NOT unlock the next level.
       hasWonRef prevents double-popup if tubes re-evaluates (e.g. after Retry). */
    useEffect(() => {
        if (solved(tubes) && !hasWonRef.current) {
            hasWonRef.current = true;

            // ── Show win modal ────────────────────────────────────────────────
            // Capture a session token so restart() can invalidate this timer
            // even though it's not in timers.current.
            const session = ++winSessionRef.current;
            setTimeout(() => {
                // Only show if the session hasn't been invalidated by restart()
                if (winSessionRef.current === session) {
                    setWon(true); setParty(true);
                    setTimeout(() => setParty(false), 4200);
                }
            }, 480);
        }
    }, [tubes]);

    /* ── CLICK HANDLER ─────────────────────────────────── */
    function click(idx) {
        if (won || isPouring) return;
        clearTimeout(hintT.current); setHint(null);

        if (sel === null) {
            if (!tubes[idx].length) return;
            setSel(idx);
        } else {
            if (sel === idx) { setSel(null); return; }

            if (canPour(tubes[sel], tubes[idx])) {
                const fromIdx = sel;
                const toIdx = idx;
                const colorId = top(tubes[fromIdx]);
                const col = gc(colorId);
                const before = tubes;
                const next = pour(tubes, fromIdx, toIdx);

                setSel(null);

                // Grab DOM rects NOW (before render)
                const fromEl = tubeRefs.current[fromIdx];
                const toEl = tubeRefs.current[toIdx];
                const fromRect = fromEl ? fromEl.getBoundingClientRect() : null;
                const toRect = toEl ? toEl.getBoundingClientRect() : null;

                // Calculate pixel distance between the two tubes
                const horizDx = fromRect && toRect
                    ? (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2)
                    : 0;
                const vertDy = fromRect && toRect
                    ? (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2)
                    : 0;

                // On MOBILE: source bottle ALWAYS flies to destination regardless of distance.
                // On DESKTOP: only fly when tubes are far apart in the same row.
                const isMobile = winW < 768;
                const fromRow = rows.findIndex(r => r.includes(fromIdx));
                const toRow = rows.findIndex(r => r.includes(toIdx));
                const tubeWidth = fromRect ? fromRect.width : (sz.w + sz.gap);
                const farThreshold = tubeWidth * 1.8;

                // Mobile: source bottle ALWAYS flies to the DESTINATION position (lands on top).
                // flyDx/flyDy move the wrapper to destination's center (X and Y).
                const tiltDir = horizDx >= 0 ? 1 : -1;
                const isFar = isMobile
                    ? true   // always fly on mobile → same animation everywhere
                    : fromRow === toRow && Math.abs(horizDx) > farThreshold;
                // Move wrapper both horizontally AND vertically to destination:
                const flyDx = isFar ? horizDx : 0;
                const flyDy = isFar ? vertDy : 0;  // vertical offset to reach dest row

                // Mobile: deliberate pacing so each phase is clearly visible.
                const LIFT_T = isMobile ? 260 : 250;   // lift completes
                const FLY_T = isMobile ? 520 : 710;   // fly slide completes (unused var, hover fires at TILT_T-80)
                const TILT_T = isMobile ? 700 : 710;   // tilt starts
                const STREAM_T = isMobile ? 820 : 860;   // stream arc drawn
                const FILL_T = STREAM_T + 640;           // stream DUR = 640ms
                const BACK_T = FILL_T + 300;
                const CLEAN_T = BACK_T + 700;
                void FLY_T; // suppresses unused-variable lint warning

                if (isFar) {
                    /* UNIVERSAL FLY: lift → fly (X+Y) → tilt → stream → fill → flyback */
                    setPourState({
                        fromIdx, toIdx, col, fromRect, toRect,
                        phase: 'lift', tiltDir, flyDx, flyDy, isFar
                    });

                    // FLY — slide horizontally to above dest
                    const tA = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'fly' }), LIFT_T);
                    timers.current.push(tA);

                    // TILT — tilt to pour angle
                    const tC = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'tilt' }), TILT_T);
                    timers.current.push(tC);

                    // STREAM — draw the water arc
                    const tD = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'stream' }), STREAM_T);
                    timers.current.push(tD);

                    // FILL — commit state after stream arc fully drawn
                    const tE = setTimeout(() => {
                        setPrev(before); setTubes(next);
                        setHist(h => [...h, before]);
                        setMoves(m => m + 1);
                        setPourState(s => s && { ...s, phase: 'fill' });
                    }, FILL_T);
                    timers.current.push(tE);

                    // FLYBACK — return to original position
                    const tF = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'flyback' }), BACK_T);
                    timers.current.push(tF);

                    // CLEANUP
                    const tG = setTimeout(() => setPourState(null), CLEAN_T);
                    timers.current.push(tG);

                } else {
                    /* CLOSE DESKTOP pour: lift → tilt → stream → fill → return */
                    setPourState({
                        fromIdx, toIdx, col, fromRect, toRect,
                        phase: 'lift', tiltDir, flyDx: 0, isFar: false
                    });

                    // TILT
                    const t0 = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'tilt' }), 250);
                    timers.current.push(t0);

                    // STREAM
                    const t1 = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'stream' }), 350);
                    timers.current.push(t1);

                    // FILL (350 + 580 = 930ms)
                    const t2 = setTimeout(() => {
                        setPrev(before); setTubes(next);
                        setHist(h => [...h, before]);
                        setMoves(m => m + 1);
                        setPourState(s => s && { ...s, phase: 'fill' });
                    }, 930);
                    timers.current.push(t2);

                    // RETURN
                    const t3 = setTimeout(() =>
                        setPourState(s => s && { ...s, phase: 'flyback' }), 1200);
                    timers.current.push(t3);

                    // CLEANUP
                    const t4 = setTimeout(() => setPourState(null), 1900);
                    timers.current.push(t4);
                }

            } else {
                setSel(null);
            }
        }
    }

    function undo() {
        if (!hist.length || isPouring) return;
        const last = hist[hist.length - 1];
        setPrev(tubes); setTubes(last);
        setHist(h => h.slice(0, -1));
        setMoves(m => Math.max(0, m - 1));
        setSel(null); setWon(false);
        setPourKey(k => k + 1);
    }

    function restart() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        hasWonRef.current = false;   // reset so next genuine win can unlock
        winSessionRef.current++;     // invalidate any pending win popup timer
        const t = gen(LEVELS[lvlIdx].n, LEVELS[lvlIdx].e);
        setTubes(t); setPrev(t);
        setSel(null); setHist([]); setMoves(0);
        setWon(false); setHint(null); setParty(false); setPourKey(k => k + 1);
        setPourState(null);
    }

    function showHint() {
        for (const pref of [true, false]) {
            for (let f = 0; f < tubes.length; f++) {
                if (!tubes[f].length) continue;
                for (let t = 0; t < tubes.length; t++) {
                    if (f === t) continue;
                    if (canPour(tubes[f], tubes[t]) && (pref ? tubes[t].length > 0 : true)) {
                        setHint({ from: f, to: t });
                        hintT.current = setTimeout(() => setHint(null), 2400);
                        return;
                    }
                }
            }
        }
    }

    /* rows/perRow already computed above (before click handler) */

    const doneN = tubes.filter(t => !t.length || done(t)).length;

    /* ─────────────────────────────────────────── RENDER ── */
    return (
        <div style={{
            minHeight: "100dvh",
            background: "radial-gradient(ellipse at 25% 20%,#0e1e3a 0%,#060d1e 45%,#020508 100%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            fontFamily: "'Segoe UI',system-ui,sans-serif",
            position: "relative", overflow: "hidden",
            padding: "clamp(14px,3vw,28px) clamp(10px,2vw,22px) clamp(22px,3vw,36px)",
            boxSizing: "border-box",
        }}>
            <style>{GLOBAL_CSS}</style>

            {/* AMBIENT ORBS */}
            {[
                { c: "rgba(0,245,255,.07)", x: "6%", y: "10%", s: 380, d: 17 },
                { c: "rgba(163,255,64,.05)", x: "82%", y: "62%", s: 300, d: 23 },
                { c: "rgba(180,80,255,.06)", x: "50%", y: "84%", s: 230, d: 20 },
            ].map((o, i) => (
                <div key={i} style={{
                    position: "fixed", left: o.x, top: o.y,
                    width: o.s, height: o.s, borderRadius: "50%",
                    background: `radial-gradient(circle,${o.c},transparent 70%)`,
                    animation: `ws-orb ${o.d}s ease-in-out infinite`,
                    animationDelay: `${i * 5}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* STARS */}
            {Array.from({ length: 42 }, (_, i) => (
                <div key={`st${i}`} style={{
                    position: "fixed",
                    left: `${(i * 43 + 11) % 100}%`,
                    top: `${(i * 61 + 9) % 100}%`,
                    width: i % 7 === 0 ? 3 : 1.5,
                    height: i % 7 === 0 ? 3 : 1.5,
                    borderRadius: "50%", background: "white",
                    opacity: .1 + (i % 5) * .07,
                    animation: `ws-shimmer ${2 + (i % 4)}s ease-in-out infinite`,
                    animationDelay: `${(i * .37) % 4}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            <Confetti on={party} />
            {won && (
                <WinModal moves={moves} lvlIdx={lvlIdx} onRetry={restart}
                    onNext={() => {
                        const nextIdx = lvlIdx < LEVELS.length - 1 ? lvlIdx + 1 : 0;
                        // ── UNLOCK next level only when player intentionally clicks Next ──
                        const cur = parseInt(localStorage.getItem("ws_unlocked") || "1");
                        const nextUnlock = lvlIdx + 2; // 0-indexed lvlIdx; next level number = lvlIdx+2
                        if (nextUnlock > cur) {
                            localStorage.setItem("ws_unlocked", nextUnlock.toString());
                        }
                        // Navigate to next level URL
                        navigate(`/game/${nextIdx}`, { replace: true });
                        setLvlIdx(nextIdx);
                    }}
                    onLevels={() => navigate("/levels", { state: { currentLvl: lvlIdx } })}
                />
            )}

            {/* ═══ HEADER ═══ */}
            <div style={{ width: "100%", maxWidth: 960, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(10px,2.2vw,20px)", position: "relative", zIndex: 1 }}>
                <button id="ws-back" onClick={() => navigate("/levels", { state: { currentLvl: lvlIdx } })} style={{
                    padding: "7px 16px", borderRadius: 40,
                    border: "1.5px solid rgba(255,255,255,.2)",
                    background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.6)",
                    fontSize: "clamp(10px,1.6vw,13px)", fontWeight: 700, cursor: "pointer",
                    backdropFilter: "blur(6px)", letterSpacing: ".05em", fontFamily: "inherit",
                    transition: "all .2s",
                }}>← Levels</button>
                <div style={{ textAlign: "center", flex: 1 }}>
                    <h1 style={{
                        fontSize: "clamp(22px,5vw,42px)", fontWeight: 900, margin: "0 0 2px",
                        letterSpacing: ".13em",
                        background: "linear-gradient(90deg,#00f5ff,#b0ff57,#c084fc,#ff6b9d,#00f5ff)",
                        backgroundSize: "400% auto",
                        WebkitBackgroundClip: "text", backgroundClip: "text",
                        color: "transparent",
                        animation: "ws-title 5.5s linear infinite",
                        textTransform: "uppercase",
                    }}>💧 Water Sort</h1>
                    <p style={{ color: "rgba(255,255,255,.25)", fontSize: "clamp(8px,1.2vw,11px)", margin: 0, letterSpacing: ".4em", textTransform: "uppercase" }}>
                        {LEVELS[lvlIdx].icon} {LEVELS[lvlIdx].label} Mode
                    </p>
                </div>
                <div style={{ width: 72 }} />
            </div>

            {/* ═══ STATS ═══ */}
            <div style={{
                display: "flex", marginBottom: "clamp(14px,2.4vw,24px)",
                padding: "clamp(9px,1.8vw,13px) clamp(18px,3.5vw,34px)",
                background: "rgba(255,255,255,.03)", borderRadius: 60,
                border: "1px solid rgba(255,255,255,.07)",
                backdropFilter: "blur(12px)", zIndex: 1,
            }}>
                {[
                    { label: "MOVES", val: moves, col: "#00f5ff" },
                    { label: "TUBES", val: tubes.length, col: "#c084fc" },
                    { label: "DONE", val: `${doneN}/${tubes.length}`, col: "#b0ff57" },
                ].map((s, i, a) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "rgba(255,255,255,.28)", fontSize: "clamp(8px,1.1vw,10px)", letterSpacing: ".3em" }}>{s.label}</div>
                            <div style={{ color: s.col, fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, lineHeight: 1.1, textShadow: `0 0 14px ${s.col}55` }}>{s.val}</div>
                        </div>
                        {i < a.length - 1 && <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.07)", margin: "0 clamp(12px,2vw,26px)" }} />}
                    </div>
                ))}
            </div>

            {/* ═══ TUBES ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: `clamp(20px,3.5vw,36px)`, alignItems: "center", zIndex: 1, width: "100%", maxWidth: 980 }}>
                {rows.map((row, ri) => (
                    <div key={ri} style={{ display: "flex", gap: `${sz.gap}px`, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
                        {row.map(idx => {
                            const isSrc = !!(pourState && pourState.fromIdx === idx && pourState.isFar);
                            // Wrapper handles X (horizontal fly) AND Y (vertical, for cross-row pours).
                            // No rotation on wrapper → transformOrigin irrelevant → no skew bug.
                            const flyPhase = pourState?.phase;
                            // Wrapper moves both X (horizontal) and Y (vertical) to reach destination.
                            const activeFlyPhases = ['fly', 'hover', 'tilt', 'stream', 'fill'];
                            const wrapX = isSrc
                                ? (activeFlyPhases.includes(flyPhase) ? pourState.flyDx : 0)
                                : 0;
                            const wrapY = isSrc
                                ? (activeFlyPhases.includes(flyPhase) ? (pourState.flyDy || 0) : 0)
                                : 0;
                            const wrapTrans = isSrc
                                ? (flyPhase === 'fly'
                                    ? 'transform 0.42s cubic-bezier(0.4,0,0.2,1)'
                                    : flyPhase === 'flyback'
                                        ? 'transform 0.48s cubic-bezier(0.33,1,0.68,1)'
                                        : 'transform 0.22s ease')
                                : 'none';
                            return (
                                <div
                                    key={idx}
                                    ref={el => { tubeRefs.current[idx] = el; }}
                                    style={{
                                        transform: `translateX(${wrapX}px) translateY(${wrapY}px)`,
                                        transition: wrapTrans,
                                        zIndex: isSrc ? 50 : 1,
                                        position: 'relative',
                                    }}
                                >
                                    <Tube
                                        tube={tubes[idx]}
                                        prev={prev[idx]}
                                        onClick={() => click(idx)}
                                        selected={sel === idx}
                                        hinted={!!(hint && (hint.from === idx || hint.to === idx))}
                                        isDone={done(tubes[idx])}
                                        sz={sz}
                                        pourKey={pourKey}
                                        tubeIdx={idx}
                                        isPouringSrc={!!(pourState && pourState.fromIdx === idx)}
                                        tiltDir={pourState && pourState.fromIdx === idx ? pourState.tiltDir : 0}
                                        pourPhase={pourState && pourState.fromIdx === idx ? pourState.phase : null}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* ═══ POUR STREAM SVG OVERLAY ═══ */}
            {pourState && (pourState.phase === 'stream' || pourState.phase === 'fill') && (
                <PourStream
                    key={`${pourState.fromIdx}-${pourState.toIdx}`}
                    info={pourState}
                />
            )}

            {/* ═══ CONTROLS ═══ */}
            <div style={{ display: "flex", gap: "clamp(8px,1.8vw,14px)", marginTop: "clamp(22px,3.5vw,42px)", flexWrap: "wrap", justifyContent: "center", zIndex: 1 }}>
                {[
                    { id: "ws-undo", label: "↩ Undo", fn: undo, dis: !hist.length || isPouring, rgb: "0,245,255" },
                    { id: "ws-restart", label: "⟳ Restart", fn: restart, dis: false, rgb: "255,107,157" },
                    { id: "ws-hint", label: "💡 Hint", fn: showHint, dis: isPouring, rgb: "255,210,50" },
                ].map(b => (
                    <button key={b.id} id={b.id} onClick={b.fn} disabled={b.dis} style={{
                        padding: "clamp(9px,1.5vw,12px) clamp(18px,2.8vw,26px)",
                        borderRadius: 50,
                        border: b.dis ? "2px solid rgba(255,255,255,.07)" : `2px solid rgba(${b.rgb},.4)`,
                        background: b.dis ? "rgba(255,255,255,.02)" : `linear-gradient(135deg,rgba(${b.rgb},.18),rgba(${b.rgb},.06))`,
                        color: b.dis ? "rgba(255,255,255,.18)" : `rgb(${b.rgb})`,
                        fontSize: "clamp(12px,1.7vw,15px)", fontWeight: 700,
                        cursor: b.dis ? "not-allowed" : "pointer",
                        letterSpacing: ".05em", backdropFilter: "blur(6px)",
                        boxShadow: b.dis ? "none" : `0 0 16px rgba(${b.rgb},.22)`,
                    }}>{b.label}</button>
                ))}
            </div>

            <p style={{ color: "rgba(255,255,255,.15)", marginTop: "clamp(12px,2vw,20px)", fontSize: "clamp(9px,1.4vw,12px)", letterSpacing: ".14em", textAlign: "center", zIndex: 1 }}>
                Tap a tube to select&nbsp;·&nbsp;Tap another to pour
            </p>
        </div>
    );
}
