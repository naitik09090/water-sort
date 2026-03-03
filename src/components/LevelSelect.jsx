import { useEffect, useState } from "react";

/* ── Palette (same as game) ── */
const PALETTE = [
    { a: "#ff6b9d", b: "#ff1f6e" },
    { a: "#00f5ff", b: "#00b8cc" },
    { a: "#b0ff57", b: "#6ad020" },
    { a: "#ffcc44", b: "#ff8800" },
    { a: "#d580ff", b: "#a020f0" },
    { a: "#ffe055", b: "#f5c200" },
    { a: "#ff7a45", b: "#e84000" },
    { a: "#80c8ff", b: "#2288ee" },
    { a: "#ffffff", b: "#cccccc" },
    { a: "#ff0000", b: "#aa0000" },
];

/* ── tier config ── */
const TIERS = {
    Easy: { rgb: "0,245,255", label: "💧 Easy", levels: [1, 2, 3, 4, 5, 6, 7, 8] },
    Medium: { rgb: "163,255,64", label: "🌊 Medium", levels: [9, 10, 11, 12, 13, 14, 15] },
    Hard: { rgb: "255,180,60", label: "⚡ Hard", levels: [16, 17, 18, 19, 20, 21] },
    Expert: { rgb: "200,100,255", label: "🔥 Expert", levels: [22, 23, 24, 25, 26] },
    Master: { rgb: "255,210,50", label: "💎 Master", levels: [27, 28, 29, 30, 31] },
    Legend: { rgb: "255,107,157", label: "👑 Legend", levels: [32, 33, 34, 35, 36, 37, 38, 39, 40] },
};

const LEVEL_TIERS = [
    "Easy", "Easy", "Easy", "Easy", "Easy", "Easy", "Easy", "Easy",
    "Medium", "Medium", "Medium", "Medium", "Medium", "Medium", "Medium",
    "Hard", "Hard", "Hard", "Hard", "Hard", "Hard",
    "Expert", "Expert", "Expert", "Expert", "Expert",
    "Master", "Master", "Master", "Master", "Master",
    "Legend", "Legend", "Legend", "Legend", "Legend", "Legend", "Legend", "Legend", "Legend"
];

function getTier(levelNum) { return LEVEL_TIERS[levelNum - 1]; }

/* ── deterministic "preview" colors per level (2 tubes × 4 slots) ── */
function getPreviewColors(lvlNum) {
    // Use level number as seed for deterministic but varied colors
    const seed = lvlNum * 17 + 3;
    const tube1 = [
        PALETTE[(seed) % PALETTE.length],
        PALETTE[(seed + 3) % PALETTE.length],
        PALETTE[(seed + 6) % PALETTE.length],
        PALETTE[(seed + 1) % PALETTE.length],
    ];
    const tube2 = [
        PALETTE[(seed + 2) % PALETTE.length],
        PALETTE[(seed + 5) % PALETTE.length],
        PALETTE[(seed + 4) % PALETTE.length],
        PALETTE[(seed + 7) % PALETTE.length],
    ];
    return [tube1, tube2];
}

/* ── Single mini glass tube ── */
function MiniTube({ colors, showQuestion, tierRgb, isGrayscale }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 0,
        }}>
            {/* Neck */}
            <div style={{
                width: 14, height: 7,
                borderRadius: "5px 5px 0 0",
                border: `1.5px solid rgba(255,255,255,${isGrayscale ? 0.12 : 0.28})`,
                borderBottom: "none",
                background: "rgba(255,255,255,0.04)",
                boxSizing: "border-box",
                flexShrink: 0,
            }} />
            {/* Body */}
            <div style={{
                width: 20, height: 52,
                borderRadius: "0 0 10px 10px",
                border: `1.5px solid rgba(255,255,255,${isGrayscale ? 0.1 : 0.25})`,
                background: "rgba(6,12,38,0.85)",
                backdropFilter: "blur(4px)",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                boxShadow: isGrayscale
                    ? "inset 0 4px 14px rgba(0,0,0,0.5)"
                    : `inset 0 4px 14px rgba(0,0,0,0.5), 0 0 8px rgba(${tierRgb},0.15)`,
            }}>
                {/* Water segments (4 slots, bottom to top) */}
                {colors.map((col, i) => (
                    <div key={i} style={{
                        position: "absolute",
                        left: 0, right: 0,
                        bottom: `${i * 25}%`,
                        height: "25%",
                        background: showQuestion
                            ? `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)`
                            : `linear-gradient(180deg, ${col.a} 0%, ${col.b} 100%)`,
                        transition: "background 0.3s",
                    }}>
                        {/* ? mark overlay */}
                        {showQuestion && (
                            <div style={{
                                position: "absolute", inset: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 8, fontWeight: 900,
                                color: "rgba(255,255,255,0.4)",
                                textShadow: "0 0 6px rgba(255,255,255,0.3)",
                            }}>?</div>
                        )}
                    </div>
                ))}
                {/* Glass left shine */}
                <div style={{
                    position: "absolute", top: 0, left: 2, bottom: 0, width: 3,
                    background: "linear-gradient(90deg,rgba(255,255,255,.18),transparent)",
                    pointerEvents: "none", zIndex: 10,
                }} />
            </div>
        </div>
    );
}

/* ── Level card (shows 2 mini tubes) ── */
function LevelCard({ levelNum, tier, cfg, unlocked, isCurrent, isNextLocked, onClick }) {
    const [hov, setHov] = useState(false);
    const previewColors = getPreviewColors(levelNum);
    const isGray = !unlocked;

    return (
        <div
            className={unlocked ? "lv-btn" : ""}
            id={`ws-lvl-${levelNum}`}
            onClick={unlocked ? onClick : undefined}
            onMouseEnter={() => unlocked && setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: "relative",
                borderRadius: "clamp(12px,2vw,16px)",
                border: isCurrent
                    ? `2px solid rgba(255,255,255,0.9)`
                    : unlocked
                        ? `2px solid rgba(${cfg.rgb},${hov ? 0.65 : 0.28})`
                        : isNextLocked
                            ? `2px solid rgba(255,255,255,0.12)`
                            : `2px solid rgba(255,255,255,0.06)`,
                background: isCurrent
                    ? `linear-gradient(145deg, rgba(${cfg.rgb},0.25), rgba(6,12,38,0.95))`
                    : unlocked
                        ? hov
                            ? `linear-gradient(145deg, rgba(${cfg.rgb},0.2), rgba(6,12,38,0.92))`
                            : `linear-gradient(145deg, rgba(${cfg.rgb},0.10), rgba(6,12,38,0.95))`
                        : "rgba(255,255,255,0.02)",
                boxShadow: isCurrent
                    ? `0 0 0 3px rgba(${cfg.rgb},0.2), 0 0 22px rgba(${cfg.rgb},0.5), 0 4px 20px rgba(0,0,0,0.6)`
                    : hov && unlocked
                        ? `0 0 22px rgba(${cfg.rgb},0.4), 0 4px 20px rgba(0,0,0,0.5)`
                        : `0 2px 12px rgba(0,0,0,0.4)`,
                cursor: unlocked ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "8px 6px 6px",
                gap: 5,
                opacity: unlocked ? 1 : isNextLocked ? 0.55 : 0.38,
                filter: isGray ? "grayscale(1) brightness(0.7)" : "none",
                transition: "opacity 0.3s, filter 0.3s",
                backdropFilter: "blur(8px)",
                overflow: "hidden",
                userSelect: "none",
                minHeight: 90,
                boxSizing: "border-box",
            }}
        >
            {/* Top shine strip */}
            {unlocked && (
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "35%",
                    background: "linear-gradient(180deg,rgba(255,255,255,.06),transparent)",
                    pointerEvents: "none", borderRadius: "inherit",
                }} />
            )}

            {/* ▶ NOW badge */}
            {isCurrent && (
                <div style={{
                    position: "absolute", top: 5, right: 5,
                    fontSize: 7, fontWeight: 900, color: "#fff",
                    letterSpacing: ".04em",
                    background: `rgba(${cfg.rgb},0.75)`,
                    borderRadius: 4, padding: "1px 4px",
                    animation: "ws-pulse 1.4s ease-in-out infinite",
                }}>▶</div>
            )}

            {/* NEXT badge */}
            {isNextLocked && !isCurrent && (
                <div style={{
                    position: "absolute", top: 5, right: 5,
                    fontSize: 7, fontWeight: 800,
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 4, padding: "1px 4px",
                }}>NEXT</div>
            )}

            {/* Mini tubes preview */}
            {unlocked ? (
                <div style={{
                    display: "flex", gap: 5, alignItems: "flex-end",
                    justifyContent: "center",
                }}>
                    <MiniTube
                        colors={previewColors[0]}
                        showQuestion={false}
                        tierRgb={cfg.rgb}
                        isGrayscale={false}
                    />
                    <MiniTube
                        colors={previewColors[1]}
                        showQuestion={false}
                        tierRgb={cfg.rgb}
                        isGrayscale={false}
                    />
                </div>
            ) : (
                /* Locked: show tubes with ? marks */
                <div style={{
                    display: "flex", gap: 5, alignItems: "flex-end",
                    justifyContent: "center",
                }}>
                    <MiniTube
                        colors={previewColors[0]}
                        showQuestion={true}
                        tierRgb={cfg.rgb}
                        isGrayscale={true}
                    />
                    <MiniTube
                        colors={previewColors[1]}
                        showQuestion={true}
                        tierRgb={cfg.rgb}
                        isGrayscale={true}
                    />
                </div>
            )}

            {/* Level number */}
            <div style={{
                fontSize: "clamp(13px,2.5vw,17px)",
                fontWeight: 900,
                color: isCurrent
                    ? "#fff"
                    : unlocked ? `rgb(${cfg.rgb})` : "rgba(255,255,255,0.22)",
                lineHeight: 1,
                textShadow: isCurrent
                    ? `0 0 16px rgba(255,255,255,.9)`
                    : unlocked ? `0 0 12px rgba(${cfg.rgb},.6)` : "none",
                letterSpacing: ".02em",
            }}>{levelNum}</div>

            {/* Lock icon for fully locked */}
            {!unlocked && !isNextLocked && (
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    opacity: 0.35,
                    pointerEvents: "none",
                }}>🔒</div>
            )}
        </div>
    );
}

export default function LevelSelect({ onSelect, onBack, currentLvl = -1 }) {
    const [ready, setReady] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [page, setPage] = useState(() => Math.floor(Math.max(0, currentLvl) / 20));
    // Read from localStorage on mount (and keep in sync if storage changes in another tab)
    const [unlockedCount, setUnlockedCount] = useState(
        () => parseInt(localStorage.getItem("ws_unlocked") || "1")
    );

    // Re-read on every mount so navigating back from a won game reflects the new unlock
    useEffect(() => {
        const fresh = parseInt(localStorage.getItem("ws_unlocked") || "1");
        setUnlockedCount(fresh);
    }, []);

    const LEVELS_PER_PAGE = 20;
    const TOTAL_PAGES = Math.ceil(40 / LEVELS_PER_PAGE);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 60);
        return () => clearTimeout(t);
    }, []);

    function handleSelect(idx) {
        setLeaving(true);
        setTimeout(() => onSelect(idx), 380);
    }
    function handleBack() {
        setLeaving(true);
        setTimeout(onBack, 380);
    }

    return (
        <div
            id="ws-level-select"
            style={{
                minHeight: "100dvh",
                background: "radial-gradient(ellipse at 25% 20%,#0e1e3a 0%,#060d1e 48%,#020508 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily: "'Segoe UI',system-ui,sans-serif",
                position: "relative",
                overflow: "hidden",
                padding: "clamp(14px,2.5vw,28px) clamp(10px,2.5vw,22px) clamp(20px,4vw,36px)",
                boxSizing: "border-box",
                opacity: leaving ? 0 : ready ? 1 : 0,
                transform: leaving ? "translateY(16px)" : ready ? "translateY(0)" : "translateY(24px)",
                transition: "opacity .38s ease, transform .38s ease",
            }}
        >
            <style>{`
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0;overflow-x:hidden;background:#020508}
        #root{max-width:100%;padding:0}

        @keyframes ls-shimmer{0%,100%{opacity:.1}50%{opacity:.8}}
        @keyframes ls-orb{
          0%,100%{transform:translate(0,0) scale(1)}
          40%{transform:translate(36px,-28px) scale(1.1)}
          70%{transform:translate(-16px,18px) scale(.92)}
        }
        @keyframes ls-title{
          0%{background-position:-300% center}100%{background-position:300% center}
        }
        @keyframes ls-in{
          from{opacity:0;transform:translateY(18px) scale(.95)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes ws-pulse{
          0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.4)}
          50%{box-shadow:0 0 0 4px rgba(255,255,255,0)}
        }
        .lv-btn{
          transition: transform .22s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .22s ease,
                      border-color .22s ease,
                      background .22s ease !important;
        }
        .lv-btn:hover{ transform: translateY(-4px) scale(1.06) !important; }
        .lv-btn:active{ transform: scale(.93) !important; }
        #ws-back-ls:hover{ color:#00f5ff!important; border-color:rgba(0,245,255,.5)!important; }
        .pg-btn:not(:disabled):hover{ background:rgba(255,255,255,.14)!important; transform:scale(1.05); }
        .pg-btn:not(:disabled):active{ transform:scale(.95); }
        .pg-btn:disabled{ opacity:.28; cursor:not-allowed; }

        /* Tier label badges */
        .tier-badge{
          display:inline-flex; align-items:center; gap:5px;
          padding:3px 10px; border-radius:20px;
          font-size:clamp(9px,1.2vw,11px); font-weight:700;
          letter-spacing:.06em;
        }
      `}</style>

            {/* ── STARS ── */}
            {Array.from({ length: 40 }, (_, i) => (
                <div key={i} style={{
                    position: "fixed",
                    left: `${(i * 53 + 11) % 100}%`,
                    top: `${(i * 71 + 7) % 100}%`,
                    width: i % 7 === 0 ? 2.5 : 1.4,
                    height: i % 7 === 0 ? 2.5 : 1.4,
                    borderRadius: "50%", background: "white",
                    opacity: .08 + (i % 5) * .05,
                    animation: `ls-shimmer ${2 + (i % 4)}s ease-in-out infinite`,
                    animationDelay: `${(i * .38) % 4}s`,
                    pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* ── AMBIENT ORBS ── */}
            {[
                { c: "rgba(0,245,255,.07)", x: "4%", y: "8%", s: 380, d: 17 },
                { c: "rgba(163,255,64,.05)", x: "80%", y: "62%", s: 300, d: 22 },
                { c: "rgba(200,80,255,.06)", x: "50%", y: "82%", s: 240, d: 20 },
            ].map((o, i) => (
                <div key={i} style={{
                    position: "fixed", left: o.x, top: o.y,
                    width: o.s, height: o.s, borderRadius: "50%",
                    background: `radial-gradient(circle,${o.c},transparent 70%)`,
                    animation: `ls-orb ${o.d}s ease-in-out infinite`,
                    animationDelay: `${i * 5}s`, pointerEvents: "none", zIndex: 0,
                }} />
            ))}

            {/* ═══════════════ HEADER ═══════════════ */}
            <div style={{
                width: "100%", maxWidth: 680,
                display: "flex", alignItems: "center",
                marginBottom: "clamp(14px,2.5vw,24px)",
                position: "relative", zIndex: 2,
            }}>

                <div style={{ textAlign: "center", flex: 1 }}>
                    <h1 style={{
                        fontSize: "clamp(22px,5vw,40px)",
                        fontWeight: 900, margin: "0 0 3px",
                        letterSpacing: ".1em", textTransform: "uppercase",
                        background: "linear-gradient(90deg,#00f5ff,#b0ff57,#c084fc,#ff6b9d,#00f5ff)",
                        backgroundSize: "400% auto",
                        WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                        animation: "ls-title 5s linear infinite",
                    }}>Select Level</h1>
                    <p style={{
                        color: "rgba(255,255,255,.28)", fontSize: "clamp(9px,1.2vw,11px)",
                        margin: 0, letterSpacing: ".4em", textTransform: "uppercase",
                    }}>
                        40 Levels · Choose Your Challenge
                    </p>
                </div>
            </div>

            {/* ═══════════════ TIER BADGES ═══════════════ */}
            <div style={{
                display: "flex", gap: "clamp(5px,1.2vw,10px)", flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "clamp(12px,2vw,20px)", zIndex: 2,
            }}>
                {Object.entries(TIERS).map(([tier, cfg]) => (
                    <div key={tier} className="tier-badge" style={{
                        background: `rgba(${cfg.rgb},.1)`,
                        border: `1px solid rgba(${cfg.rgb},.3)`,
                        color: `rgb(${cfg.rgb})`,
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: `rgb(${cfg.rgb})`,
                            boxShadow: `0 0 5px rgba(${cfg.rgb},.8)`,
                        }} />
                        {cfg.label}
                    </div>
                ))}
            </div>

            {/* ═══════════════ LEVEL GRID (tube cards) ═══════════════ */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "clamp(8px,2vw,14px)",
                width: "100%", maxWidth: 580,
                zIndex: 2,
                animation: "ls-in .45s cubic-bezier(.34,1.2,.64,1) both",
            }}>
                {Array.from({ length: LEVELS_PER_PAGE }, (_, i) => {
                    const actualIdx = (page * LEVELS_PER_PAGE) + i;
                    if (actualIdx >= 40) return null;
                    const num = actualIdx + 1;
                    const tier = getTier(num);
                    const cfg = TIERS[tier];
                    const unlocked = actualIdx < unlockedCount;
                    const isCurrent = actualIdx === currentLvl;
                    const isNextLocked = actualIdx === unlockedCount;

                    return (
                        <div
                            key={actualIdx}
                            style={{
                                animation: `ls-in .4s cubic-bezier(.34,1.2,.64,1) both`,
                                animationDelay: `${i * 0.025}s`,
                            }}
                        >
                            <LevelCard
                                levelNum={num}
                                tier={tier}
                                cfg={cfg}
                                unlocked={unlocked}
                                isCurrent={isCurrent}
                                isNextLocked={isNextLocked}
                                onClick={() => handleSelect(actualIdx)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ═══════════════ PAGINATION ═══════════════ */}
            <div style={{
                display: "flex", alignItems: "center", gap: 18,
                marginTop: "clamp(14px,2.5vw,22px)", zIndex: 2,
            }}>
                <button
                    className="pg-btn"
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    style={{
                        padding: "9px 20px", borderRadius: 30,
                        border: "1.5px solid rgba(255,255,255,.15)",
                        background: "rgba(255,255,255,0.05)",
                        color: "white", fontWeight: 700, cursor: "pointer",
                        fontSize: "clamp(11px,1.6vw,13px)",
                        transition: "all .2s", fontFamily: "inherit",
                    }}
                >← Prev</button>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                        <div
                            key={i}
                            onClick={() => setPage(i)}
                            style={{
                                width: page === i ? 22 : 9,
                                height: 9, borderRadius: 5,
                                background: page === i ? "#00f5ff" : "rgba(255,255,255,0.2)",
                                boxShadow: page === i ? "0 0 10px #00f5ff" : "none",
                                transition: "all .3s ease",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </div>

                <button
                    className="pg-btn"
                    disabled={page === TOTAL_PAGES - 1}
                    onClick={() => setPage(p => p + 1)}
                    style={{
                        padding: "9px 20px", borderRadius: 30,
                        border: "1.5px solid rgba(255,255,255,.15)",
                        background: "rgba(255,255,255,0.05)",
                        color: "white", fontWeight: 700, cursor: "pointer",
                        fontSize: "clamp(11px,1.6vw,13px)",
                        transition: "all .2s", fontFamily: "inherit",
                    }}
                >Next →</button>
            </div>

            {/* ───── progress bar ───── */}
            <div style={{
                width: "100%", maxWidth: 340,
                marginTop: "clamp(12px,2vw,18px)",
                zIndex: 2,
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginBottom: 5,
                }}>
                    <span style={{
                        fontSize: "clamp(9px,1.2vw,11px)",
                        color: "rgba(255,255,255,.3)",
                        letterSpacing: ".15em", textTransform: "uppercase",
                    }}>Progress</span>
                    <span style={{
                        fontSize: "clamp(9px,1.2vw,11px)",
                        color: "#00f5ff",
                        fontWeight: 700,
                    }}>{Math.min(unlockedCount, 40)} / 40</span>
                </div>
                <div style={{
                    height: 5, borderRadius: 10,
                    background: "rgba(255,255,255,.07)",
                    overflow: "hidden",
                }}>
                    <div style={{
                        height: "100%",
                        width: `${Math.min((unlockedCount / 40) * 100, 100)}%`,
                        background: "linear-gradient(90deg, #00f5ff, #b0ff57)",
                        borderRadius: 10,
                        boxShadow: "0 0 8px rgba(0,245,255,.5)",
                        transition: "width 0.8s ease",
                    }} />
                </div>
            </div>

            {/* Footer */}
            <p style={{
                color: "rgba(255,255,255,.14)",
                marginTop: "clamp(12px,2vw,20px)",
                fontSize: "clamp(9px,1.2vw,11px)",
                letterSpacing: ".15em", textAlign: "center", zIndex: 2,
            }}>
                Each level gets progressively harder 🌊
            </p>
        </div>
    );
}
