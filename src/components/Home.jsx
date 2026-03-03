import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── colour palette used across decorations ── */
const PALETTE = [
    "#ff6b9d", "#00f5ff", "#b0ff57", "#ffcc44",
    "#d580ff", "#ff7a45", "#80c8ff", "#ffe055",
    "#ff4d6d", "#38bdf8", "#4ade80", "#fb923c",
];

/* ── animated tube data ── */
const TUBES = [
    { colors: ["#ff6b9d", "#00f5ff", "#b0ff57", "#ffcc44"], x: "8%", delay: 0 },
    { colors: ["#d580ff", "#ff7a45", "#00f5ff", "#b0ff57"], x: "18%", delay: 0.4 },
    { colors: ["#ffcc44", "#ff6b9d", "#d580ff", "#38bdf8"], x: "78%", delay: 0.2 },
    { colors: ["#4ade80", "#fb923c", "#ff4d6d", "#80c8ff"], x: "88%", delay: 0.6 },
];

/* ── random floating bubble data ── */
const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
    color: PALETTE[i % PALETTE.length],
    x: `${(i * 53 + 7) % 100}%`,
    size: 6 + (i % 5) * 4,
    dur: 6 + (i % 5) * 2,
    delay: (i * 0.45) % 6,
}));

/* ── star particles ── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
    x: `${(i * 47 + 13) % 100}%`,
    y: `${(i * 67 + 7) % 100}%`,
    size: i % 8 === 0 ? 2.5 : 1.2,
    dur: 2 + (i % 4),
    delay: (i * 0.38) % 5,
    opacity: 0.08 + (i % 6) * 0.06,
}));

// Mini animated tube component for decorations
function DecoTube({ colors, x, delay, bottom = "5%" }) {
    return (
        <div
            style={{
                position: "fixed",
                left: x,
                bottom: bottom,
                width: 28,
                height: 90,
                zIndex: 1,
                pointerEvents: "none",
                animation: `tube-float 4s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                opacity: 0.55,
            }}
        >
            {/* tube body */}
            {/* <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "0 0 14px 14px",
                border: "2px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(4px)",
                overflow: "hidden",
                boxShadow: "0 0 12px rgba(0,245,255,0.12)",
            }}>
                {colors.map((c, idx) => (
                    <div key={idx} style={{
                        position: "absolute",
                        bottom: `${(idx / colors.length) * 100}%`,
                        left: 0, right: 0,
                        height: `${100 / colors.length}%`,
                        background: `linear-gradient(180deg, ${c}cc, ${c}88)`,
                        borderTop: `1px solid ${c}33`,
                    }} />
                ))}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(120deg,rgba(255,255,255,0.08) 0%,transparent 60%)",
                    borderRadius: "inherit",
                }} />
            </div> */}
            {/* tube cap */}
            <div style={{
                width: "80%", height: 6,
                background: "rgba(255,255,255,0.15)",
                borderRadius: "4px 4px 0 0",
                margin: "0 auto",
                marginBottom: -1,
            }} />
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [btnHover, setBtnHover] = useState(false);
    const [titleGlow, setTitleGlow] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setReady(true);
            setTitleGlow(true);
        }, 100);
        return () => clearTimeout(t);
    }, []);

    // Canvas ripple effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let ripples = [];
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // Spawn ripples occasionally
        const spawnInterval = setInterval(() => {
            ripples.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0,
                maxR: 80 + Math.random() * 120,
                color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
                alpha: 0.25,
                speed: 0.6 + Math.random() * 0.8,
            });
        }, 1400);

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ripples = ripples.filter(rp => rp.alpha > 0.01);
            for (const rp of ripples) {
                rp.r += rp.speed;
                rp.alpha = 0.25 * (1 - rp.r / rp.maxR);
                const grad = ctx.createRadialGradient(rp.x, rp.y, rp.r * 0.5, rp.x, rp.y, rp.r);
                grad.addColorStop(0, `${rp.color}00`);
                grad.addColorStop(0.7, `${rp.color}${Math.floor(rp.alpha * 255).toString(16).padStart(2, "0")}`);
                grad.addColorStop(1, `${rp.color}00`);
                ctx.beginPath();
                ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            clearInterval(spawnInterval);
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    function handlePlay() {
        setLeaving(true);
        setTimeout(() => navigate("/levels"), 480);
    }

    return (
        <div
            id="ws-home"
            style={{
                minHeight: "100dvh",
                background: "radial-gradient(ellipse at 20% 10%, #0b1f42 0%, #050d1f 50%, #020508 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                opacity: leaving ? 0 : ready ? 1 : 0,
                transform: leaving ? "scale(1.05) translateY(-10px)" : ready ? "scale(1) translateY(0)" : "scale(0.94) translateY(20px)",
                transition: "opacity 0.48s cubic-bezier(.4,0,.2,1), transform 0.48s cubic-bezier(.4,0,.2,1)",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

        @keyframes tube-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes star-twinkle { 0%,100%{opacity:.06} 50%{opacity:.65} }
        @keyframes orb-drift {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(35px,-28px) scale(1.06)}
          66%{transform:translate(-20px,18px) scale(.94)}
        }
        @keyframes title-shine {
          0%  {background-position:-400% center}
          100%{background-position:400% center}
        }
        @keyframes drop-icon {
          0%,100%{transform:translateY(0px) scale(1)}
          50%{transform:translateY(-18px) scale(1.06)}
        }
        @keyframes ring-pulse {
          0%  {transform:scale(1); opacity:.7}
          100%{transform:scale(2.6); opacity:0}
        }
        @keyframes btn-glow {
          0%,100%{box-shadow:0 0 30px rgba(0,245,255,.45),0 0 70px rgba(0,245,255,.12),inset 0 0 18px rgba(0,245,255,.06)}
          50%{box-shadow:0 0 55px rgba(0,245,255,.75),0 0 130px rgba(0,245,255,.25),inset 0 0 32px rgba(0,245,255,.14)}
        }
        @keyframes bubble-rise {
          0%   {transform:translateY(0px) scale(.8); opacity:0}
          10%  {opacity:.7}
          90%  {opacity:.4}
          100% {transform:translateY(-110vh) scale(1.1); opacity:0}
        }
        @keyframes subtitle-breathe {
          0%,100%{letter-spacing:.55em; opacity:.38}
          50%{letter-spacing:.65em; opacity:.55}
        }
        @keyframes haze-wave {
          0%  {transform:translateX(0%)}
          100%{transform:translateX(-50%)}
        }
        @keyframes tip-fade {
          0%,100%{opacity:.18}
          50%{opacity:.38}
        }
        @keyframes badge-glow {
          0%,100%{box-shadow:0 0 8px rgba(176,255,87,.2)}
          50%{box-shadow:0 0 18px rgba(176,255,87,.5), 0 0 36px rgba(176,255,87,.15)}
        }
        @keyframes arrow-bounce {
          0%,100%{transform:translateX(0)}
          50%{transform:translateX(5px)}
        }
        #ws-play-btn:hover {
          transform: scale(1.08) translateY(-2px) !important;
          filter: brightness(1.2) saturate(1.2);
        }
        #ws-play-btn:active {
          transform: scale(0.96) !important;
          filter: brightness(0.95);
        }
        .tube-glow-left {
          filter: drop-shadow(0 0 18px rgba(255,107,157,0.4)) drop-shadow(0 0 40px rgba(0,245,255,0.2));
        }
        .tube-glow-right {
          filter: drop-shadow(0 0 18px rgba(212,128,255,0.4)) drop-shadow(0 0 40px rgba(255,204,68,0.2));
        }
      `}</style>

            {/* ── RIPPLE CANVAS ── */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed", inset: 0,
                    width: "100%", height: "100%",
                    pointerEvents: "none", zIndex: 0, opacity: 0.5,
                }}
            />

            {/* ── AMBIENT ORBS ── */}
            {[
                { c: "rgba(0,245,255,.09)", x: "4%", y: "6%", s: 480, d: 18 },
                { c: "rgba(163,255,64,.06)", x: "72%", y: "55%", s: 360, d: 24 },
                { c: "rgba(180,70,255,.08)", x: "48%", y: "75%", s: 300, d: 20 },
                { c: "rgba(255,100,100,.055)", x: "82%", y: "12%", s: 240, d: 26 },
                { c: "rgba(255,204,68,.05)", x: "25%", y: "85%", s: 200, d: 15 },
            ].map((o, i) => (
                <div key={i} style={{
                    position: "fixed", left: o.x, top: o.y,
                    width: o.s, height: o.s,
                    borderRadius: "50%",
                    background: `radial-gradient(circle,${o.c},transparent 72%)`,
                    animation: `orb-drift ${o.d}s ease-in-out infinite`,
                    animationDelay: `${i * 3.5}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* ── STAR FIELD ── */}
            {STARS.map((s, i) => (
                <div key={i} style={{
                    position: "fixed", left: s.x, top: s.y,
                    width: s.size, height: s.size,
                    borderRadius: "50%", background: "white",
                    opacity: s.opacity,
                    animation: `star-twinkle ${s.dur}s ease-in-out infinite`,
                    animationDelay: `${s.delay}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* ── FLOATING BUBBLES ── */}
            {BUBBLES.map((b, i) => (
                <div key={i} style={{
                    position: "fixed", left: b.x, bottom: "-30px",
                    width: b.size, height: b.size,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, ${b.color}bb, ${b.color}44)`,
                    boxShadow: `0 0 ${b.size * 1.4}px ${b.color}66, 0 0 ${b.size * 2.5}px ${b.color}22`,
                    border: `1px solid ${b.color}44`,
                    animation: `bubble-rise ${b.dur}s ease-in-out infinite`,
                    animationDelay: `${b.delay}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* ── BOTTOM WATER HAZE ── */}
            <div style={{
                position: "fixed", bottom: 0, left: 0,
                width: "200%", height: "clamp(70px,14vw,130px)",
                background: `repeating-linear-gradient(
          90deg,
          rgba(0,245,255,.04) 0px, rgba(0,245,255,.04) 2px,
          transparent 2px, transparent 60px
        ), linear-gradient(180deg,transparent, rgba(0,180,220,.06) 60%, rgba(0,120,180,.10))`,
                animation: "haze-wave 22s linear infinite",
                pointerEvents: "none", zIndex: 1,
            }} />

            {/* ── DECO TUBES LEFT ── */}
            <div className="tube-glow-left">
                <DecoTube colors={TUBES[0].colors} x="6%" delay={0} bottom="0" />
                <DecoTube colors={TUBES[1].colors} x="16%" delay={0.7} bottom="0" />
            </div>

            {/* ── DECO TUBES RIGHT ── */}
            <div className="tube-glow-right">
                <DecoTube colors={TUBES[2].colors} x="77%" delay={0.3} bottom="0" />
                <DecoTube colors={TUBES[3].colors} x="87%" delay={1.0} bottom="0" />
            </div>

            {/* ══════════════ MAIN CONTENT ══════════════ */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                padding: "clamp(24px,5vw,48px)",
                gap: 0,
            }}>

                {/* ── HERO ICON: custom SVG water drop with animated gradient ── */}
                <div style={{
                    position: "relative",
                    marginBottom: "clamp(16px,3vw,28px)",
                    animation: "drop-icon 3.5s ease-in-out infinite",
                }}>
                    {/* glow rings behind icon */}
                    {[1, 1.6, 2.2].map((scale, i) => (
                        <div key={i} style={{
                            position: "absolute",
                            inset: "50%",
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            width: 90, height: 90,
                            borderRadius: "50%",
                            border: `1.5px solid rgba(0,245,255,${0.35 - i * 0.1})`,
                            animation: `ring-pulse ${2 + i * 0.4}s ease-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                            pointerEvents: "none",
                        }} />
                    ))}
                    <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style={{ filter: "drop-shadow(0 0 28px rgba(0,245,255,.7)) drop-shadow(0 0 60px rgba(0,245,255,.3))" }}>
                        <defs>
                            <linearGradient id="dropGrad" x1="20" y1="10" x2="75" y2="95" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#80c8ff" />
                                <stop offset="45%" stopColor="#00f5ff" />
                                <stop offset="100%" stopColor="#b0ff57" />
                            </linearGradient>
                            <radialGradient id="dropSheen" cx="35%" cy="30%" r="55%">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M45 5 C45 5 10 42 10 65 C10 84 26 96 45 96 C64 96 80 84 80 65 C80 42 45 5 45 5Z"
                            fill="url(#dropGrad)"
                        />
                        <path
                            d="M45 5 C45 5 10 42 10 65 C10 84 26 96 45 96 C64 96 80 84 80 65 C80 42 45 5 45 5Z"
                            fill="url(#dropSheen)"
                        />
                        {/* inner highlight */}
                        <ellipse cx="35" cy="42" rx="7" ry="12" fill="rgba(255,255,255,0.22)" transform="rotate(-20,35,42)" />
                    </svg>
                </div>

                {/* ── TITLE ── */}
                <h1
                    style={{
                        fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif",
                        fontSize: "clamp(48px,11vw,96px)",
                        fontWeight: 900,
                        margin: "0 0 4px",
                        letterSpacing: ".10em",
                        textTransform: "uppercase",
                        background: "linear-gradient(90deg, #00f5ff 0%, #b0ff57 18%, #d580ff 36%, #ff6b9d 54%, #ffcc44 72%, #00f5ff 90%)",
                        backgroundSize: "400% auto",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        animation: "title-shine 4.5s linear infinite",
                        textAlign: "center",
                        lineHeight: 1.0,
                        textShadow: "none",
                    }}
                >
                    WATER SORT
                </h1>

                {/* ── SUBTITLE ── */}
                <p style={{
                    color: "rgba(255,255,255,.42)",
                    fontSize: "clamp(9px,1.6vw,13px)",
                    fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif",
                    fontWeight: 600,
                    letterSpacing: ".55em",
                    textTransform: "uppercase",
                    margin: 0,
                    animation: "subtitle-breathe 4s ease-in-out infinite",
                }}>
                    Colour Puzzle Game
                </p>

                {/* ── THIN DIVIDER LINE ── */}
                <div style={{
                    width: "clamp(120px,20vw,200px)",
                    height: 1,
                    background: "linear-gradient(90deg,transparent,rgba(0,245,255,.5),transparent)",
                    margin: "clamp(14px,2.5vw,22px) 0",
                }} />

                {/* ── PLAY BUTTON ── */}
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>

                    <button
                        id="ws-play-btn"
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        onClick={handlePlay}
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: "clamp(10px,1.5vw,16px)",
                            padding: "clamp(18px,3vw,24px) clamp(52px,9vw,90px)",
                            borderRadius: 80,
                            border: "2px solid rgba(0,245,255,.65)",
                            background: btnHover
                                ? "linear-gradient(135deg,rgba(0,245,255,.3) 0%,rgba(0,180,220,.18) 100%)"
                                : "linear-gradient(135deg,rgba(0,245,255,.18) 0%,rgba(0,180,220,.08) 100%)",
                            color: "#00f5ff",
                            fontSize: "clamp(18px,3vw,26px)",
                            fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif",
                            fontWeight: 900,
                            letterSpacing: ".3em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            backdropFilter: "blur(16px)",
                            boxShadow: "0 0 32px rgba(0,245,255,.35), 0 0 70px rgba(0,245,255,.10)",
                            transition: "transform .24s cubic-bezier(.34,1.56,.64,1), filter .2s, background .2s, box-shadow .2s",
                            userSelect: "none",
                            zIndex: 1,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {/* button shimmer sweep */}
                        {btnHover && (
                            <div style={{
                                position: "absolute", inset: 0,
                                background: "linear-gradient(105deg,transparent 35%,rgba(255,255,255,.12) 50%,transparent 65%)",
                                animation: "haze-wave 0.5s linear",
                                pointerEvents: "none",
                            }} />
                        )}
                        {/* play icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f5ff" style={{ flexShrink: 0 }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        PLAY
                    </button>
                </div>

                {/* ── FEATURE BADGES ── */}
                <div style={{
                    display: "flex",
                    gap: "clamp(8px,2vw,16px)",
                    marginTop: "clamp(28px,4.5vw,44px)",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}>
                    {[
                        { icon: "🧩", label: "100+ Levels" },
                        { icon: "🎨", label: "12 Colors" },
                        { icon: "⚡", label: "No Ads" },
                    ].map((b, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 30,
                            border: "1px solid rgba(176,255,87,.25)",
                            background: "rgba(176,255,87,.05)",
                            color: "rgba(176,255,87,.7)",
                            fontSize: "clamp(9px,1.4vw,12px)",
                            fontFamily: "'Outfit', system-ui, sans-serif",
                            fontWeight: 600,
                            letterSpacing: ".08em",
                            animation: "badge-glow 3s ease-in-out infinite",
                            animationDelay: `${i * 0.6}s`,
                        }}>
                            <span style={{ fontSize: "clamp(11px,1.6vw,14px)" }}>{b.icon}</span>
                            {b.label}
                        </div>
                    ))}
                </div>

                {/* ── FOOTER HINT ── */}
                <p style={{
                    color: "rgba(255,255,255,.18)",
                    fontSize: "clamp(8px,1.2vw,11px)",
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    letterSpacing: ".22em",
                    textTransform: "uppercase",
                    marginTop: "clamp(16px,3vw,28px)",
                    animation: "tip-fade 4s ease-in-out infinite",
                }}>
                    Sort the colours · Fill the tubes
                </p>
            </div>
        </div>
    );
}
