import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTRUCTIVA.CZ — HOMEPAGE PROTOTYPE
// Construction Marketing Agency — Premium Website
// ============================================================

const COLORS = {
  navy: "#152A3E",
  navyDark: "#0D1F2D",
  navyLight: "#1E3A52",
  accent: "#A8C5D6",
  accentLight: "#C8DDE8",
  white: "#FFFFFF",
  offWhite: "#F5F7F9",
  grey: "#8A9BAE",
  greyLight: "#D0D8E0",
  greyDark: "#4A5E72",
  statGreen: "#2ECC87",
};

// Smooth scroll hook
function useSmoothScroll() {
  return useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);
}

// Intersection Observer hook
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Counter animation
function AnimatedCounter({ target, suffix = "", duration = 2000, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span>{count.toLocaleString("cs-CZ")}{suffix}</span>;
}

// ============================================================
// LOADING SCREEN
// ============================================================
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); setTimeout(onComplete, 400); return 100; }
        return p + 1.5;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: COLORS.navy,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: progress >= 100 ? 0 : 1, transition: "opacity 0.6s ease",
      pointerEvents: progress >= 100 ? "none" : "all",
    }}>
      <svg viewBox="0 0 200 180" width="120" height="108" style={{ marginBottom: 32 }}>
        {/* Simplified Constructiva logo — line art buildings */}
        <path
          ref={pathRef}
          d="M40,140 L40,60 L80,40 L80,140 M60,140 L60,80 M90,140 L90,70 L110,60 L110,140 M120,140 L120,55 L150,45 L150,140 M135,140 L135,65 M160,140 L160,50 L175,45 L175,140"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength || 800,
            strokeDashoffset: pathLength ? pathLength * (1 - progress / 100) : 800 * (1 - progress / 100),
            transition: "stroke-dashoffset 0.05s linear",
          }}
        />
      </svg>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 28, letterSpacing: 12, color: COLORS.accent,
        textTransform: "uppercase", opacity: progress > 30 ? 1 : 0,
        transition: "opacity 0.8s ease", marginBottom: 40,
      }}>
        Constructiva
      </div>
      <div style={{ width: 200, height: 1, background: COLORS.navyLight, borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          width: `${progress}%`, height: "100%", background: COLORS.accent,
          transition: "width 0.05s linear",
        }} />
      </div>
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Navigation({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Proces", id: "process" },
    { label: "Služby", id: "services" },
    { label: "Reference", id: "projects" },
    { label: "O nás", id: "about" },
    { label: "Kontakt", id: "contact" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "16px 48px" : "28px 48px",
        background: scrolled ? "rgba(21,42,62,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.navyLight}` : "1px solid transparent",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, letterSpacing: 8, color: COLORS.white,
          textTransform: "uppercase", cursor: "pointer", fontWeight: 600,
        }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Constructiva
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map((l) => (
            <span key={l.id} onClick={() => scrollTo(l.id)} style={{
              fontFamily: "'DM Sans', Helvetica, sans-serif",
              fontSize: 13, letterSpacing: 1.5, color: COLORS.grey,
              textTransform: "uppercase", cursor: "pointer",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = COLORS.white}
            onMouseLeave={(e) => e.target.style.color = COLORS.grey}
            >
              {l.label}
            </span>
          ))}
          <button onClick={() => scrollTo("contact")} style={{
            fontFamily: "'DM Sans', Helvetica, sans-serif",
            fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
            padding: "10px 28px", background: "transparent",
            border: `1px solid ${COLORS.accent}`, color: COLORS.accent,
            cursor: "pointer", transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => { e.target.style.background = COLORS.accent; e.target.style.color = COLORS.navy; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = COLORS.accent; }}
          >
            Spojte se s námi
          </button>
        </div>
      </nav>

      {/* Current Project Widget — floating, bottom-left */}
      <div style={{
        position: "fixed", bottom: 32, left: 32, zIndex: 90,
        background: "rgba(21,42,62,0.92)", backdropFilter: "blur(16px)",
        border: `1px solid ${COLORS.navyLight}`, borderRadius: 12,
        padding: "16px 20px", maxWidth: 220, cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <div style={{ fontSize: 9, letterSpacing: 2, color: COLORS.statGreen, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.statGreen, display: "inline-block" }} />
          Aktuální projekt
        </div>
        <div style={{ fontSize: 14, color: COLORS.white, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 4 }}>
          Jipocar Transport
        </div>
        <div style={{ fontSize: 11, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif" }}>
          Hala M — Vysočina
        </div>
      </div>
    </>
  );
}

// ============================================================
// HERO — Timelapse Scroll Section
// ============================================================
function HeroSection() {
  const [scrollPct, setScrollPct] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, -rect.top / total));
      setScrollPct(pct);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const phases = [
    { pct: 0, label: "Holá zem", sub: "Začátek projektu", color: "#8B7355" },
    { pct: 0.2, label: "Základy", sub: "Založení stavby", color: "#7A8B6F" },
    { pct: 0.4, label: "Konstrukce", sub: "Ocelová kostra", color: "#5A7A9B" },
    { pct: 0.6, label: "Opláštění", sub: "Fasáda a střecha", color: "#4A6A8B" },
    { pct: 0.8, label: "Dokončení", sub: "Finální podoba", color: COLORS.accent },
    { pct: 1, label: "Hotovo", sub: "Předání klientovi", color: COLORS.statGreen },
  ];

  const currentPhase = phases.reduce((acc, p) => scrollPct >= p.pct ? p : acc, phases[0]);

  return (
    <section ref={sectionRef} style={{ height: "400vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        background: COLORS.navyDark, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Animated building visualization */}
        <div style={{ position: "relative", width: "100%", maxWidth: 1000, height: "60vh", margin: "0 auto" }}>
          {/* Ground */}
          <div style={{
            position: "absolute", bottom: 0, left: "5%", right: "5%", height: 4,
            background: COLORS.grey, opacity: 0.3,
          }} />

          {/* Building rising */}
          <div style={{
            position: "absolute", bottom: 4, left: "15%", right: "15%",
            height: `${Math.min(scrollPct * 1.2, 1) * 70}%`,
            background: `linear-gradient(180deg, ${COLORS.navyLight} 0%, ${COLORS.navy} 100%)`,
            border: `1px solid ${COLORS.accent}33`,
            borderBottom: "none",
            transition: "height 0.1s linear",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            {/* Windows appearing progressively */}
            {scrollPct > 0.35 && (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8,
                padding: "16px 24px", opacity: Math.min(1, (scrollPct - 0.35) * 4),
                transition: "opacity 0.3s ease",
              }}>
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: "1/1.4", background: COLORS.accent,
                    opacity: scrollPct > 0.35 + i * 0.015 ? 0.15 + Math.random() * 0.3 : 0,
                    transition: "opacity 0.5s ease",
                  }} />
                ))}
              </div>
            )}

            {/* Roof / top structure */}
            {scrollPct > 0.7 && (
              <div style={{
                position: "absolute", top: -12, left: -2, right: -2, height: 12,
                background: COLORS.accent, opacity: Math.min(1, (scrollPct - 0.7) * 5) * 0.6,
              }} />
            )}
          </div>

          {/* Crane */}
          {scrollPct < 0.9 && (
            <div style={{
              position: "absolute", bottom: 4,
              right: `${18 - scrollPct * 5}%`,
              opacity: scrollPct > 0.85 ? (0.9 - scrollPct) * 20 : 1,
              transition: "opacity 0.3s ease",
            }}>
              {/* Crane vertical */}
              <div style={{ width: 3, height: "50vh", background: COLORS.accent, opacity: 0.4 }} />
              {/* Crane arm */}
              <div style={{
                position: "absolute", top: 0, left: 3, width: 120, height: 2,
                background: COLORS.accent, opacity: 0.4,
              }} />
            </div>
          )}
        </div>

        {/* Phase label */}
        <div style={{
          position: "absolute", left: 48, bottom: 120,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 3, color: currentPhase.color,
            textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            marginBottom: 12, transition: "color 0.5s ease",
          }}>
            Fáze výstavby
          </div>
          <div style={{
            fontSize: 48, fontWeight: 700, color: COLORS.white,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: 1.1, transition: "all 0.5s ease",
          }}>
            {currentPhase.label}
          </div>
          <div style={{
            fontSize: 16, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif",
            marginTop: 8,
          }}>
            {currentPhase.sub}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)",
          width: 2, height: "40vh", background: COLORS.navyLight,
        }}>
          <div style={{
            width: "100%", height: `${scrollPct * 100}%`,
            background: `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.statGreen})`,
            transition: "height 0.1s linear",
          }} />
          {phases.map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: 12, top: `${p.pct * 100}%`,
              transform: "translateY(-50%)",
              fontSize: 10, color: scrollPct >= p.pct ? COLORS.white : COLORS.grey,
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 1,
              transition: "color 0.3s ease", whiteSpace: "nowrap",
            }}>
              {p.label}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        {scrollPct < 0.05 && (
          <div style={{
            position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "fadeInUp 1s ease forwards",
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              Scrollujte a stavte s námi
            </div>
            <div style={{ width: 1, height: 40, background: COLORS.accent, opacity: 0.5, animation: "pulse 2s ease infinite" }} />
          </div>
        )}

        {/* Hero headline overlay */}
        <div style={{
          position: "absolute", top: 120, left: 48,
          opacity: scrollPct < 0.15 ? 1 : Math.max(0, 1 - (scrollPct - 0.15) * 8),
          transition: "opacity 0.3s ease",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 64, fontWeight: 300, color: COLORS.white,
            lineHeight: 1.15, maxWidth: 600,
          }}>
            Stavíme viditelnost<br />
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>vašich projektů</span>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.grey,
            marginTop: 24, maxWidth: 440, lineHeight: 1.7,
          }}>
            Marketingová agentura specializovaná na stavebnictví a development. Od vizualizace po hotový obsah.
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SCROLL STORYTELLING — Process Wipe Section
// ============================================================
function ProcessSection() {
  const [ref, inView] = useInView(0.15);
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, -rect.top / total));
      setActiveStep(Math.min(4, Math.floor(pct * 5)));
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Vizualizace",
      desc: "Proměníme architektonické plány ve fotorealistické 3D vizuály ještě před položením prvního základu.",
      mockup: "render",
      gradient: "linear-gradient(135deg, #1a2a3a 0%, #2a4a5a 100%)",
    },
    {
      num: "02",
      title: "Dokumentace",
      desc: "Pravidelné návštěvy staveniště s profesionálním týmem fotografů a kameramanů. Zachytíme každý milník.",
      mockup: "camera",
      gradient: "linear-gradient(135deg, #2a3a4a 0%, #1a3a5a 100%)",
    },
    {
      num: "03",
      title: "Letecké záběry",
      desc: "Certifikovaní piloti s nejnovějšími drony. Ptačí perspektiva, drone-mapping i termovize.",
      mockup: "drone",
      gradient: "linear-gradient(135deg, #1a3a4a 0%, #2a5a6a 100%)",
    },
    {
      num: "04",
      title: "Obsah & Sítě",
      desc: "Personalizované příspěvky, copywriting a kompletní správa sociálních sítí. Instagram, LinkedIn, Facebook.",
      mockup: "social",
      gradient: "linear-gradient(135deg, #1a2a4a 0%, #3a4a6a 100%)",
    },
    {
      num: "05",
      title: "Klientský portál",
      desc: "Vše na jednom místě. Cloudové řešení pro schvalování, tracking a přístup ke všem materiálům.",
      mockup: "dashboard",
      gradient: "linear-gradient(135deg, #0a2a3a 0%, #1a4a5a 100%)",
    },
  ];

  return (
    <section id="process" ref={sectionRef} style={{ height: "500vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        background: COLORS.offWhite,
      }}>
        {/* Section label */}
        <div style={{
          position: "absolute", top: 100, left: 48, zIndex: 10,
        }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
            (Proces)
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 42, fontWeight: 600, color: COLORS.navy,
            lineHeight: 1.2,
          }}>
            Od vize k realitě
          </div>
        </div>

        {/* Steps */}
        {steps.map((step, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            opacity: activeStep === i ? 1 : 0,
            transform: `translateY(${activeStep === i ? 0 : activeStep > i ? -40 : 40}px)`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "120px 48px 48px",
          }}>
            <div style={{ display: "flex", gap: 64, alignItems: "center", maxWidth: 1100, width: "100%" }}>
              {/* Left — Device Mockup */}
              <div style={{
                flex: "0 0 45%", position: "relative",
              }}>
                {/* MacBook frame */}
                <div style={{
                  background: "#1a1a1a", borderRadius: 16, padding: "12px 12px 0",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
                }}>
                  {/* Screen */}
                  <div style={{
                    background: step.gradient,
                    borderRadius: "8px 8px 0 0",
                    height: 300, display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Placeholder content inside screen */}
                    <div style={{
                      color: COLORS.accent, fontSize: 72, fontWeight: 200,
                      fontFamily: "'Cormorant Garamond', serif", opacity: 0.3,
                    }}>
                      {step.num}
                    </div>
                    {/* Scan line animation */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, transparent, ${COLORS.accent}44, transparent)`,
                      animation: "scanline 3s linear infinite",
                    }} />
                  </div>
                  {/* Bottom bar */}
                  <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 40, height: 4, background: "#333", borderRadius: 2 }} />
                  </div>
                </div>

                {/* Floating phone mockup */}
                <div style={{
                  position: "absolute", right: -30, bottom: -20,
                  width: 120, background: "#1a1a1a", borderRadius: 16,
                  padding: 6, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}>
                  <div style={{
                    background: step.gradient, borderRadius: 12,
                    height: 200, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ color: COLORS.accent, fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase", opacity: 0.5 }}>
                      Live
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 11, letterSpacing: 3, color: COLORS.accent,
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 16,
                }}>
                  Krok {step.num}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 36, fontWeight: 600, color: COLORS.navy,
                  lineHeight: 1.2, marginBottom: 20,
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 16,
                  color: COLORS.greyDark, lineHeight: 1.8, maxWidth: 400,
                }}>
                  {step.desc}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Step indicators */}
        <div style={{
          position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 24, alignItems: "center",
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: activeStep === i ? 32 : 8, height: 3,
                background: activeStep === i ? COLORS.navy : COLORS.greyLight,
                borderRadius: 2, transition: "all 0.5s ease",
              }} />
              {activeStep === i && (
                <span style={{
                  fontSize: 10, letterSpacing: 2, color: COLORS.navy,
                  fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
                }}>
                  {s.title}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Contrast lines */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: COLORS.greyLight }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: COLORS.greyLight }} />
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function ServicesSection() {
  const [ref, inView] = useInView(0.1);
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    { num: "01", title: "Fotografie", desc: "Pravidelné návštěvy staveniště, profesionální technika, fotky co zazáří na sítích.", tags: ["Stavební dokumentace", "Interiéry", "Exteriéry"] },
    { num: "02", title: "Videografie", desc: "Od krátkých videí pro sociální sítě po celovečerní dokumenty s animacemi a rozhovory.", tags: ["Krátká videa", "Dokumenty", "Rozhovory"] },
    { num: "03", title: "Letecká kinematografie", desc: "Certifikovaní piloti, nejnovější drony, vysoké rozlišení. Drone-mapping i termovize.", tags: ["Drone záběry", "Mapping", "Termovize"] },
    { num: "04", title: "Timelapse", desc: "Zachycujeme stavbu kontinuálně i několik let. Autonomní kamery v jakémkoli počasí.", tags: ["Dlouhodobé", "Autonomní", "4K"] },
    { num: "05", title: "Vizualizace", desc: "Fotorealistické 3D vizuály z architektonických plánů. Pro investory, úřady i klienty.", tags: ["3D rendery", "Animace", "Walkthroughs"] },
    { num: "06", title: "Správa sítí", desc: "Kompletní správa Instagramu, LinkedInu a Facebooku. Strategie, copywriting, konzistence.", tags: ["Instagram", "LinkedIn", "Facebook"] },
  ];

  return (
    <section id="services" ref={ref} style={{
      background: COLORS.navy, padding: "120px 48px", position: "relative",
    }}>
      {/* Contrast line top */}
      <div style={{ position: "absolute", top: 0, left: 48, right: 48, height: 1, background: COLORS.navyLight }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              (Služby)
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 48, fontWeight: 300, color: COLORS.white,
              lineHeight: 1.2,
            }}>
              Co pro vás<br /><span style={{ fontWeight: 600, color: COLORS.accent }}>děláme</span>
            </div>
          </div>
        </div>

        {/* Services list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {services.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredService(i)}
              onMouseLeave={() => setHoveredService(null)}
              style={{
                padding: "36px 0",
                borderTop: `1px solid ${COLORS.navyLight}`,
                display: "flex", alignItems: "center", gap: 40,
                cursor: "pointer", transition: "all 0.4s ease",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 0.1}s`,
              }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: hoveredService === i ? COLORS.accent : COLORS.grey,
                letterSpacing: 2, minWidth: 40, transition: "color 0.3s ease",
              }}>
                {s.num}
              </span>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32, fontWeight: 600,
                color: hoveredService === i ? COLORS.white : COLORS.greyDark,
                transition: "color 0.3s ease", minWidth: 300,
              }}>
                {s.title}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: COLORS.grey, lineHeight: 1.7, flex: 1,
                opacity: hoveredService === i ? 1 : 0.6,
                transition: "opacity 0.3s ease",
              }}>
                {s.desc}
              </span>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {s.tags.map((t, j) => (
                  <span key={j} style={{
                    fontSize: 10, letterSpacing: 1, color: COLORS.accent,
                    border: `1px solid ${COLORS.navyLight}`, padding: "4px 10px",
                    fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
                    opacity: hoveredService === i ? 1 : 0.4,
                    transition: "opacity 0.3s ease",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {/* Last border */}
          <div style={{ borderTop: `1px solid ${COLORS.navyLight}` }} />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROJECTS / REFERENCES
// ============================================================
function ProjectsSection() {
  const [ref, inView] = useInView(0.1);
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      name: "Bosch JHP Werk 5",
      desc: "Hala 40 000 m² a velký parkovací dům",
      stats: [
        { num: 12, suffix: "", label: "Kamer" },
        { num: 18, suffix: "", label: "Měsíců" },
        { num: 4200, suffix: "+", label: "Fotografií" },
        { num: 40000, suffix: " m²", label: "Plocha" },
      ],
      tags: ["Timelapse", "Drone", "Fotografie"],
      quarters: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024"],
    },
    {
      name: "Nexen Tire Žatec",
      desc: "Obrovská hala s unikátním 55m vysokým skladem pneumatik",
      stats: [
        { num: 8, suffix: "", label: "Kamer" },
        { num: 24, suffix: "", label: "Měsíců" },
        { num: 55, suffix: " m", label: "Výška skladu" },
        { num: 6800, suffix: "+", label: "Fotografií" },
      ],
      tags: ["Timelapse", "Drone", "Video"],
      quarters: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"],
    },
    {
      name: "Bauhaus Trmice",
      desc: "Velká komerční prodejna",
      stats: [
        { num: 6, suffix: "", label: "Kamer" },
        { num: 10, suffix: "", label: "Měsíců" },
        { num: 2400, suffix: "+", label: "Fotografií" },
        { num: 120, suffix: "+", label: "Drone letů" },
      ],
      tags: ["Timelapse", "Fotografie", "Social Media"],
      quarters: ["Q2 2024", "Q3 2024", "Q4 2024"],
    },
    {
      name: "FVE Trutnov",
      desc: "Výstavba velké solární elektrárny",
      stats: [
        { num: 4, suffix: "", label: "Kamer" },
        { num: 8, suffix: "", label: "Měsíců" },
        { num: 1800, suffix: "+", label: "Fotografií" },
        { num: 50, suffix: "+", label: "Drone letů" },
      ],
      tags: ["Timelapse", "Drone", "Vizualizace"],
      quarters: ["Q1 2024", "Q2 2024", "Q3 2024"],
    },
    {
      name: "Jipocar Transport",
      desc: "Hala M — Velký areál na Vysočině",
      stats: [
        { num: 8, suffix: "", label: "Kamer" },
        { num: 14, suffix: "", label: "Měsíců" },
        { num: 3100, suffix: "+", label: "Fotografií" },
        { num: 85, suffix: "+", label: "Drone letů" },
      ],
      tags: ["Timelapse", "Drone", "Fotografie", "Video"],
      quarters: ["Q3 2025", "Q4 2025", "Q1 2026"],
    },
  ];

  const proj = projects[activeProject];

  return (
    <section id="projects" ref={ref} style={{
      background: COLORS.offWhite, padding: "120px 0", position: "relative",
    }}>
      <div style={{ padding: "0 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              (Reference)
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 48, fontWeight: 300, color: COLORS.navy,
            }}>
              Vybrané <span style={{ fontWeight: 600 }}>projekty</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>
            ({String(activeProject + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")})
          </div>
        </div>

        {/* Project display */}
        <div style={{ display: "flex", gap: 0, marginBottom: 48 }}>
          {/* Left — Image area with quarter timeline */}
          <div style={{
            flex: "0 0 55%", position: "relative",
            background: COLORS.navy, minHeight: 440,
            display: "flex", overflow: "hidden",
          }}>
            {/* Main project image placeholder */}
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${COLORS.navyDark} 0%, ${COLORS.navyLight} 100%)`,
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 96,
                color: COLORS.accent, opacity: 0.15, fontWeight: 300,
              }}>
                {String(activeProject + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Quarter strips — vertical timeline on right */}
            <div style={{ display: "flex", height: "100%" }}>
              {proj.quarters.map((q, i) => (
                <div key={i} style={{
                  width: 48, height: "100%", borderLeft: `1px solid ${COLORS.navyLight}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background 0.3s ease",
                  background: "transparent",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.navyLight}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{
                    writingMode: "vertical-rl", textOrientation: "mixed",
                    fontSize: 10, letterSpacing: 2, color: COLORS.grey,
                    fontFamily: "'DM Sans', sans-serif", transform: "rotate(180deg)",
                  }}>
                    {q}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div style={{
            flex: 1, padding: "48px 48px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            border: `1px solid ${COLORS.greyLight}`, borderLeft: "none",
          }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {proj.tags.map((t, i) => (
                  <span key={i} style={{
                    fontSize: 10, letterSpacing: 1.5, color: COLORS.navy,
                    border: `1px solid ${COLORS.greyLight}`, padding: "5px 12px",
                    fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32, fontWeight: 600, color: COLORS.navy,
                lineHeight: 1.2, marginBottom: 16,
              }}>
                {proj.name}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                color: COLORS.greyDark, lineHeight: 1.7,
              }}>
                {proj.desc}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24,
              paddingTop: 32, borderTop: `1px solid ${COLORS.greyLight}`, marginTop: 32,
            }}>
              {proj.stats.map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
                    fontWeight: 700, color: COLORS.navy,
                  }}>
                    <AnimatedCounter target={s.num} suffix={s.suffix} inView={inView} />
                  </div>
                  <div style={{
                    fontSize: 11, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: 1, textTransform: "uppercase", marginTop: 4,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project selector */}
        <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${COLORS.greyLight}` }}>
          {projects.map((p, i) => (
            <div key={i}
              onClick={() => setActiveProject(i)}
              style={{
                flex: 1, padding: "24px 20px", cursor: "pointer",
                borderRight: i < projects.length - 1 ? `1px solid ${COLORS.greyLight}` : "none",
                background: activeProject === i ? COLORS.navy : "transparent",
                transition: "all 0.4s ease",
              }}>
              <div style={{
                fontSize: 10, letterSpacing: 2, color: activeProject === i ? COLORS.accent : COLORS.grey,
                fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 600, color: activeProject === i ? COLORS.white : COLORS.navy,
                fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s ease",
              }}>
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GLOBAL STATS — Numbers Don't Lie
// ============================================================
function StatsSection() {
  const [ref, inView] = useInView(0.3);

  const stats = [
    { num: 15, suffix: "+", label: "Dokončených projektů" },
    { num: 48, suffix: "+", label: "Timelapse kamer" },
    { num: 150000, suffix: "+", label: "Nasnímaných fotografií" },
    { num: 500, suffix: "+", label: "Hodin video materiálu" },
  ];

  return (
    <section ref={ref} style={{
      background: COLORS.navy, padding: "100px 48px",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              (Proč my)
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 56, fontWeight: 700, color: COLORS.white,
              lineHeight: 1.1, textTransform: "uppercase",
            }}>
              Čísla<br />mluví<br />za nás
            </div>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16,
            color: COLORS.grey, lineHeight: 1.8, maxWidth: 400, paddingTop: 40,
          }}>
            Specializujeme se výhradně na stavebnictví a development. Každý projekt dokumentujeme od prvního výkopu po slavnostní předání.
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
          borderTop: `1px solid ${COLORS.navyLight}`,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "48px 32px",
              borderRight: i < 3 ? `1px solid ${COLORS.navyLight}` : "none",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease",
              transitionDelay: `${i * 0.15}s`,
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 48,
                fontWeight: 700, color: COLORS.accent, marginBottom: 8,
              }}>
                <AnimatedCounter target={s.num} suffix={s.suffix} inView={inView} />
              </div>
              <div style={{
                fontSize: 12, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif",
                letterSpacing: 1, textTransform: "uppercase",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT — Text Reveal
// ============================================================
function AboutSection() {
  const sectionRef = useRef(null);
  const [revealPct, setRevealPct] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.5)));
      setRevealPct(pct);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const words = "Jsme marketingová agentura, která rozumí stavebnictví. Spojujeme kreativní produkci s technologiemi a přinášíme vašim projektům viditelnost, kterou si zaslouží.".split(" ");

  return (
    <section id="about" ref={sectionRef} style={{
      background: COLORS.offWhite, padding: "180px 48px",
      minHeight: "70vh", display: "flex", alignItems: "center",
      position: "relative",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 40 }}>
          (O nás)
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 40, fontWeight: 400, lineHeight: 1.6,
        }}>
          {words.map((word, i) => {
            const wordPct = i / words.length;
            const isRevealed = revealPct > wordPct;
            return (
              <span key={i} style={{
                color: isRevealed ? COLORS.navy : COLORS.greyLight,
                transition: "color 0.4s ease",
                marginRight: 10,
              }}>
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT / CTA
// ============================================================
function ContactSection() {
  const [ref, inView] = useInView(0.2);

  return (
    <section id="contact" ref={ref} style={{
      background: COLORS.navyDark, padding: "120px 48px",
      position: "relative", textAlign: "center",
    }}>
      {/* Contrast line */}
      <div style={{ position: "absolute", top: 0, left: 48, right: 48, height: 1, background: COLORS.navyLight }} />

      <div style={{
        maxWidth: 700, margin: "0 auto",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 1s ease",
      }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.grey, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
          (Kontakt)
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 52, fontWeight: 300, color: COLORS.white,
          lineHeight: 1.2, marginBottom: 24,
        }}>
          Pojďme <span style={{ fontWeight: 600, color: COLORS.accent }}>spolupracovat</span>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16,
          color: COLORS.grey, lineHeight: 1.7, marginBottom: 48,
        }}>
          Máte projekt, který si zaslouží být vidět? Ozvěte se nám a společně najdeme nejlepší způsob, jak ho představit světu.
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
          <a href="mailto:info@constructiva.cz" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2,
            textTransform: "uppercase", padding: "16px 40px",
            background: COLORS.accent, color: COLORS.navy,
            textDecoration: "none", fontWeight: 600,
            transition: "all 0.3s ease",
          }}>
            Napište nám
          </a>
          <a href="tel:+420737373430" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2,
            textTransform: "uppercase", padding: "16px 40px",
            background: "transparent", color: COLORS.accent,
            textDecoration: "none", border: `1px solid ${COLORS.accent}`,
            transition: "all 0.3s ease",
          }}>
            +420 737 373 430
          </a>
        </div>

        {/* Social links */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
          {["Instagram", "LinkedIn", "Facebook"].map((s) => (
            <span key={s} style={{
              fontSize: 11, letterSpacing: 2, color: COLORS.grey,
              fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
              cursor: "pointer", transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = COLORS.accent}
            onMouseLeave={(e) => e.target.style.color = COLORS.grey}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{
      background: COLORS.navyDark, padding: "40px 48px",
      borderTop: `1px solid ${COLORS.navyLight}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 14, letterSpacing: 6, color: COLORS.grey,
        textTransform: "uppercase",
      }}>
        Constructiva
      </div>
      <div style={{
        fontSize: 11, color: COLORS.grey, fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 1,
      }}>
        © 2026 Constructiva.cz — Všechna práva vyhrazena
      </div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function ConstructivaHomepage() {
  const [loaded, setLoaded] = useState(false);
  const scrollTo = useSmoothScroll();

  return (
    <div style={{
      background: COLORS.offWhite,
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${COLORS.navyDark}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.accent}; }
        
        /* Selection */
        ::selection { background: ${COLORS.accent}33; color: ${COLORS.navy}; }
      `}</style>

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <div style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.8s ease 0.3s",
      }}>
        <Navigation scrollTo={scrollTo} />
        <HeroSection />
        <ProcessSection />
        <ServicesSection />
        <ProjectsSection />
        <StatsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
