"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ============================================================
// CONSTRUCTIVA.CZ — HOMEPAGE
// Construction Marketing Agency — Premium Website
// ============================================================

const FONT = "var(--font-montserrat), Helvetica, Arial, sans-serif";

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
} as const;

// Smooth scroll hook
function useSmoothScroll() {
  return useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);
}

// Breakpoint hook — mobile-first responsive
// isCompact = stack vertically (mobile + tablet portrait)
// isTouch   = no real hover (most tablets / phones) — disables hover-required states
function useBreakpoint() {
  const [bp, setBp] = useState({
    isMobile: false,
    isTablet: false,
    isCompact: false,
    isTouch: false,
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      setBp({
        isMobile,
        isTablet,
        isCompact: isMobile || isTablet,
        isTouch: window.matchMedia("(hover: none)").matches,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

// Intersection Observer hook
function useInView(threshold = 0.2): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Counter animation
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  inView,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return (
    <span>
      {count.toLocaleString("cs-CZ")}
      {suffix}
    </span>
  );
}

// ============================================================
// LOADING SCREEN
// ============================================================
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 1.5;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: COLORS.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: progress >= 100 ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: progress >= 100 ? "none" : "all",
      }}
    >
      <Image
        src="/images/logo.svg"
        alt="Constructiva"
        width={160}
        height={60}
        style={{
          marginBottom: 32,
          opacity: progress > 10 ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
        priority
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 28,
          letterSpacing: 12,
          fontWeight: 300,
          color: COLORS.accent,
          textTransform: "uppercase",
          opacity: progress > 30 ? 1 : 0,
          transition: "opacity 0.8s ease",
          marginBottom: 40,
        }}
      >
        Constructiva
      </div>
      <div
        style={{
          width: 200,
          height: 1,
          background: COLORS.navyLight,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: COLORS.accent,
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Navigation({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > window.innerHeight * 3);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  const links = [
    { label: "Proces", id: "process" },
    { label: "Služby", id: "services" },
    { label: "Reference", id: "projects" },
    { label: "O nás", id: "about" },
    { label: "Kontakt", id: "contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile
            ? (scrolled ? "10px 20px" : "14px 20px")
            : (scrolled ? "10px 48px" : "16px 48px"),
          background: scrolled || (isMobile && menuOpen) ? "rgba(21,42,62,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${COLORS.navyLight}`
            : "1px solid transparent",
          transition: "all 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          aria-label="Constructiva — zpět nahoru"
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", padding: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src="/images/logo.svg"
            alt="Constructiva"
            width={80}
            height={28}
            style={{}}
            priority
          />
        </button>

        {/* Mobile hamburger button */}
        {isMobile && (
          <button
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.white, transition: "transform 0.3s ease", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.white, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s ease" }} />
            <span style={{ display: "block", width: 22, height: 2, background: COLORS.white, transition: "transform 0.3s ease", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        )}

        {/* Desktop links */}
        {!isMobile && (
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => scrollTo(l.id)}
              style={{
                fontFamily: FONT,
                fontSize: 12,
                letterSpacing: 1.5,
                fontWeight: 500,
                color: COLORS.grey,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color 0.3s ease",
                background: "transparent",
                border: "none",
                padding: "8px 4px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.white)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = COLORS.grey)
              }
            >
              {l.label}
            </button>
          ))}
          <a
            href="https://constructiva-portal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT,
              fontSize: 11,
              letterSpacing: 2,
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "10px 28px",
              background: COLORS.accent,
              border: `1px solid ${COLORS.accent}`,
              color: COLORS.navy,
              cursor: "pointer",
              transition: "all 0.3s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = COLORS.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.accent;
              e.currentTarget.style.color = COLORS.navy;
            }}
          >
            Klientský portál
          </a>
        </div>
        )}
      </nav>

      {/* Mobile fullscreen menu */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(13,31,45,0.98)",
            backdropFilter: "blur(20px)",
            paddingTop: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { setMenuOpen(false); scrollTo(l.id); }}
              style={{
                fontFamily: FONT,
                fontSize: 22,
                letterSpacing: 2,
                fontWeight: 500,
                color: COLORS.white,
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "12px 20px",
                minHeight: 44,
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href="https://constructiva-portal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: FONT,
              fontSize: 13,
              letterSpacing: 2,
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "16px 36px",
              background: COLORS.accent,
              color: COLORS.navy,
              textDecoration: "none",
              marginTop: 16,
            }}
          >
            Klientský portál
          </a>
        </div>
      )}

      {/* Current Project Widget — floating, bottom-right (desktop only) */}
      {!isMobile && (
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 90,
          background: "rgba(21,42,62,0.92)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${COLORS.navyLight}`,
          borderRadius: 12,
          padding: "16px 20px",
          maxWidth: 220,
          cursor: "pointer",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: COLORS.statGreen,
            textTransform: "uppercase",
            fontFamily: FONT,
            fontWeight: 600,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: COLORS.statGreen,
              display: "inline-block",
            }}
          />
          Aktuální projekt
        </div>
        <div
          style={{
            fontSize: 14,
            color: COLORS.white,
            fontFamily: FONT,
            fontWeight: 600,
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          BESS Mírovka
        </div>
        <div
          style={{
            fontSize: 11,
            color: COLORS.grey,
            fontFamily: FONT,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Havlíčkův Brod — Vysočina
        </div>
      </div>
      )}
    </>
  );
}

// ============================================================
// HERO — Static Cover + Canvas Frame Sequence (Scroll-Driven)
// ============================================================
const TOTAL_FRAMES = 130;
const HERO_PHASES = [
  { label: "Holá zem", sub: "Začátek projektu" },
  { label: "Konstrukce", sub: "Ocelová kostra roste" },
  { label: "Opláštění", sub: "Fasáda a střecha" },
  { label: "Hotovo", sub: "Předání klientovi" },
];

function frameSrc(index: number) {
  return `/images/frames/frame-${String(index + 1).padStart(3, "0")}.jpg`;
}

function HeroSection() {
  const { isMobile } = useBreakpoint();
  const [activePhase, setActivePhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const lastFrame = useRef(-1);
  const lastPhase = useRef(0);
  const ticking = useRef(false);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      imgs.push(img);
    }
    frames.current = imgs;
  }, []);

  // Canvas resize
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (lastFrame.current >= 0) drawFrame(lastFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    const img = frames.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;

    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        if (!sectionRef.current) { ticking.current = false; return; }
        const rect = sectionRef.current.getBoundingClientRect();
        const total = sectionRef.current.offsetHeight - window.innerHeight;
        const pct = Math.min(1, Math.max(0, -rect.top / total));

        // Canvas frames run from 20%-100% of scroll
        if (pct > 0.2) {
          const framePct = Math.min(1, (pct - 0.2) / 0.8);
          const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(framePct * (TOTAL_FRAMES - 1)));
          if (frameIndex !== lastFrame.current) {
            lastFrame.current = frameIndex;
            drawFrame(frameIndex);
          }
        }

        setProgress(pct);

        // Phase labels: 4 phases spread over 20%-100%
        if (pct >= 0.2) {
          const phasePct = Math.min(1, (pct - 0.2) / 0.8);
          const newPhase = Math.min(HERO_PHASES.length - 1, Math.floor(phasePct * HERO_PHASES.length));
          if (newPhase !== lastPhase.current) {
            lastPhase.current = newPhase;
            setActivePhase(newPhase);
          }
        } else if (lastPhase.current !== 0) {
          lastPhase.current = 0;
          setActivePhase(0);
        }

        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPhase = HERO_PHASES[activePhase];

  // Derived opacities
  const coverOpacity = progress <= 0.1 ? 1 : progress >= 0.2 ? 0 : 1 - (progress - 0.1) / 0.1;
  const canvasOpacity = progress <= 0.1 ? 0 : progress >= 0.2 ? 1 : (progress - 0.1) / 0.1;
  const headlineOpacity = 1;
  const showLabels = progress >= 0.2;
  const labelsOpacity = progress <= 0.2 ? 0 : progress >= 0.25 ? 1 : (progress - 0.2) / 0.05;
  // Progress bar: maps 20%-100% scroll to 0-100% height
  const barHeight = progress < 0.2 ? 0 : Math.min(100, ((progress - 0.2) / 0.8) * 100);

  return (
    <section ref={sectionRef} style={{ height: "500vh", position: "relative", contain: "layout" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "block",
          width: "100%",
          height: "100vh",
          background: COLORS.navyDark,
        }}
      >
        {/* Static hero cover photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-cover.jpg"
          alt="Constructiva hero"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: coverOpacity,
            transition: "opacity 0.15s linear",
          }}
        />

        {/* Canvas for frame sequence */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "block",
            opacity: canvasOpacity,
            transition: "opacity 0.15s linear",
            filter: "brightness(1.15)",
          }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "linear-gradient(180deg, rgba(13,31,45,0.6) 0%, rgba(13,31,45,0.4) 50%, rgba(13,31,45,0.7) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Phase label — bottom left (visible from 20%) */}
        {showLabels && (
          <div style={{ position: "absolute", left: isMobile ? 20 : 48, right: isMobile ? 20 : "auto", bottom: isMobile ? 90 : 120, zIndex: 10, opacity: labelsOpacity, transition: "opacity 0.3s ease" }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: COLORS.accent,
                textTransform: "uppercase",
                fontFamily: FONT,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Fáze výstavby — {String(activePhase + 1).padStart(2, "0")}/{String(HERO_PHASES.length).padStart(2, "0")}
            </div>
            <div
              style={{
                fontSize: isMobile ? 30 : 48,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONT,
                lineHeight: 1.1,
                transition: "all 0.5s ease",
              }}
            >
              {currentPhase.label}
            </div>
            <div
              style={{
                fontSize: isMobile ? 14 : 16,
                color: COLORS.grey,
                fontFamily: FONT,
                fontWeight: 400,
                marginTop: 8,
              }}
            >
              {currentPhase.sub}
            </div>
          </div>
        )}

        {/* Progress bar — right side (desktop only, visible from 20%) */}
        {showLabels && !isMobile && (
          <div
            style={{
              position: "absolute",
              right: 80,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: "50vh",
              background: COLORS.navyLight,
              zIndex: 10,
              opacity: labelsOpacity,
              transition: "opacity 0.3s ease",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${barHeight}%`,
                background: `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.statGreen})`,
                transition: "height 0.1s linear",
              }}
            />
            {HERO_PHASES.map((phase, i) => {
              const isActive = activePhase === i;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: `${(i / (HERO_PHASES.length - 1)) * 100}%`,
                    transform: "translateY(-50%)",
                    fontSize: isActive ? 16 : 12,
                    color: isActive ? COLORS.white : COLORS.grey,
                    fontFamily: FONT,
                    fontWeight: isActive ? 700 : 400,
                    letterSpacing: 1,
                    transition: "color 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                    width: 100,
                  }}
                >
                  {phase.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Scroll indicator — visible < 5% */}
        {progress < 0.98 && (
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "fadeInUp 1s ease forwards",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: COLORS.white,
                textTransform: "uppercase",
                fontFamily: FONT,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              Scrollujte a stavte s námi
            </div>
            <div
              style={{
                width: 1,
                height: 40,
                background: COLORS.white,
                opacity: 0.7,
                animation: "pulse 2s ease infinite",
              }}
            />
          </div>
        )}

        {/* Hero headline overlay — visible 0-25%, fade out 20-30% */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 100 : 120,
            left: isMobile ? 20 : 48,
            right: isMobile ? 20 : "auto",
            zIndex: 10,
            opacity: headlineOpacity,
            transition: "opacity 0.15s linear",
          }}
        >
          <h1
            style={{
              fontFamily: FONT,
              fontSize: isMobile ? 36 : 64,
              fontWeight: 300,
              color: COLORS.white,
              lineHeight: 1.15,
              maxWidth: 600,
              margin: 0,
            }}
          >
            Stavíme viditelnost
            <br />
            <span style={{ color: COLORS.accent, fontWeight: 700 }}>
              vašich projektů
            </span>
          </h1>
          <div
            style={{
              fontFamily: FONT,
              fontSize: isMobile ? 14 : 19,
              fontWeight: 400,
              color: COLORS.white,
              marginTop: isMobile ? 16 : 24,
              maxWidth: 440,
              lineHeight: 1.7,
              opacity: coverOpacity,
              transition: "opacity 0.15s linear",
            }}
          >
            Marketingová agentura specializovaná na stavebnictví a development.
            Od vizualizace po hotový obsah.
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
  const { isMobile, isCompact } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
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
      gradient: "linear-gradient(135deg, #1a2a3a 0%, #2a4a5a 100%)",
      img: "/images/service-visual.jpg",
    },
    {
      num: "02",
      title: "Dokumentace",
      desc: "Pravidelné návštěvy staveniště s profesionálním týmem fotografů a kameramanů. Zachytíme každý milník.",
      gradient: "linear-gradient(135deg, #2a3a4a 0%, #1a3a5a 100%)",
      img: "/images/service-photo.jpg",
    },
    {
      num: "03",
      title: "Letecké záběry",
      desc: "Certifikovaní piloti s nejnovějšími drony. Ptačí perspektiva, drone-mapping i termovize.",
      gradient: "linear-gradient(135deg, #1a3a4a 0%, #2a5a6a 100%)",
      img: "/images/service-drone.jpg",
    },
    {
      num: "04",
      title: "Obsah & Sítě",
      desc: "Personalizované příspěvky, copywriting a kompletní správa sociálních sítí. Instagram, LinkedIn, Facebook.",
      gradient: "linear-gradient(135deg, #1a2a4a 0%, #3a4a6a 100%)",
      img: "/images/service-social.png",
    },
    {
      num: "05",
      title: "Klientský portál",
      desc: "Vše na jednom místě. Cloudové řešení pro schvalování, tracking a přístup ke všem materiálům.",
      gradient: "linear-gradient(135deg, #0a2a3a 0%, #1a4a5a 100%)",
      img: "/images/service-client.jpg",
    },
  ];

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ height: "500vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: COLORS.offWhite,
        }}
      >
        {/* Section label */}
        <div style={{ position: "absolute", top: isMobile ? 90 : 120, left: isMobile ? 20 : 48, right: isMobile ? 20 : "auto", zIndex: 10 }}>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: isMobile ? 26 : 42,
              fontWeight: 700,
              color: COLORS.navy,
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 8,
            }}
          >
            Od vize k realitě
          </h2>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: COLORS.grey,
              textTransform: "uppercase",
              fontFamily: FONT,
              fontWeight: 500,
            }}
          >
            Proces
          </div>
        </div>

        {/* Steps */}
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: activeStep === i ? 1 : 0,
              transform: `translateY(${activeStep === i ? 0 : activeStep > i ? -40 : 40}px)`,
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "150px 20px 80px" : isCompact ? "140px 40px 70px" : "120px 48px 48px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isCompact ? "column" : "row",
                gap: isMobile ? 24 : isCompact ? 36 : 64,
                alignItems: "center",
                maxWidth: 1100,
                width: "100%",
              }}
            >
              {/* Left — Device Mockup */}
              <div style={{ flex: isCompact ? "0 0 auto" : "0 0 45%", width: isCompact ? "min(100%, 480px)" : "auto", position: "relative" }}>
                <div
                  style={{
                    background: "#1a1a1a",
                    borderRadius: 16,
                    padding: "12px 12px 0",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      background: step.img
                        ? `url(${step.img}) center/cover no-repeat${step.img.endsWith(".png") ? ", #FFFFFF" : ""}`
                        : step.gradient,
                      borderRadius: "8px 8px 0 0",
                      height: isMobile ? 180 : isCompact ? 240 : 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {!step.img && (
                      <div
                        style={{
                          color: COLORS.accent,
                          fontSize: 72,
                          fontWeight: 300,
                          fontFamily: FONT,
                          opacity: 0.3,
                        }}
                      >
                        {step.num}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(90deg, transparent, ${COLORS.accent}44, transparent)`,
                        animation: "scanline 3s linear infinite",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 4,
                        background: "#333",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>

                {!isCompact && (
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    bottom: -20,
                    width: 120,
                    background: "#1a1a1a",
                    borderRadius: 16,
                    padding: 6,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      background: step.img
                        ? `url(${step.img}) center/cover no-repeat${step.img.endsWith(".png") ? ", #FFFFFF" : ""}`
                        : step.gradient,
                      borderRadius: 12,
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        color: COLORS.accent,
                        fontSize: 11,
                        fontFamily: FONT,
                        fontWeight: 500,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        opacity: step.img ? 0 : 0.5,
                      }}
                    >
                      Live
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Right — Text */}
              <div style={{ flex: 1, width: isCompact ? "100%" : "auto", maxWidth: isCompact ? 540 : "none" }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 3,
                    color: COLORS.accent,
                    textTransform: "uppercase",
                    fontFamily: FONT,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Krok {step.num}
                </div>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontSize: isMobile ? 24 : isCompact ? 30 : 36,
                    fontWeight: 700,
                    color: COLORS.navy,
                    lineHeight: 1.2,
                    margin: 0,
                    marginBottom: 20,
                  }}
                >
                  {step.title}
                </h3>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 16,
                    fontWeight: 400,
                    color: COLORS.greyDark,
                    lineHeight: 1.8,
                    maxWidth: 400,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Step indicators */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 24 : 48,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: isMobile ? 12 : 24,
            alignItems: "center",
          }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: activeStep === i ? 32 : 8,
                  height: 3,
                  background: activeStep === i ? COLORS.navy : COLORS.greyLight,
                  borderRadius: 2,
                  transition: "all 0.5s ease",
                }}
              />
              {activeStep === i && !isCompact && (
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: COLORS.navy,
                    fontFamily: FONT,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {s.title}
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 1,
            height: "100%",
            background: COLORS.greyLight,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: COLORS.greyLight,
          }}
        />
      </div>
    </section>
  );
}

// ============================================================
// LOGO CAROUSEL — Trusted By
// ============================================================
const CLIENT_LOGOS: { file: string; name: string }[] = [
  { file: "logo-bosch.png", name: "Bosch" },
  { file: "logo-nexen.png", name: "Nexen Tire" },
  { file: "logo-skoda.png", name: "Škoda" },
  { file: "logo-jipocar.png", name: "Jipocar Transport" },
  { file: "logo-apeltauer.png", name: "Apeltauer" },
  { file: "logo-kerosin.png", name: "Kerosin" },
  { file: "logo-niersberger.png", name: "Niersberger" },
  { file: "logo-kerous.png", name: "Kerous" },
];

function LogoCarousel() {
  const { isMobile } = useBreakpoint();
  return (
    <section
      aria-label={`Klienti, kteří nám důvěřují: ${CLIENT_LOGOS.map((l) => l.name).join(", ")}`}
      style={{
        background: COLORS.navy,
        padding: isMobile ? "48px 0 40px" : "64px 0 56px",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes logoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 3,
          color: COLORS.grey,
          textTransform: "uppercase",
          fontFamily: FONT,
          fontWeight: 500,
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        (Důvěřují nám)
      </div>
      <div style={{ overflow: "hidden" }} aria-hidden="true">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 56 : 120,
            width: "max-content",
            animation: "logoScroll 25s linear infinite",
          }}
        >
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={`/images/logos/${logo.file}`}
              alt=""
              style={{
                height: isMobile ? 52 : 84,
                width: "auto",
                filter: "grayscale(1) brightness(1.5)",
                opacity: 0.6,
                transition: "opacity 0.3s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function ServicesSection() {
  const { isMobile, isCompact } = useBreakpoint();
  const [ref, inView] = useInView(0.1);

  const services = [
    {
      num: "01",
      title: "Fotografie",
      desc: "Pravidelné návštěvy staveniště, profesionální technika, fotky co zazáří na sítích.",
      tags: ["Stavební dokumentace", "Interiéry", "Exteriéry"],
    },
    {
      num: "02",
      title: "Videografie",
      desc: "Od krátkých videí pro sociální sítě po celovečerní dokumenty s animacemi a rozhovory.",
      tags: ["Krátká videa", "Dokumenty", "Rozhovory"],
    },
    {
      num: "03",
      title: "Letecká kinematografie",
      desc: "Certifikovaní piloti, nejnovější drony, vysoké rozlišení. Drone-mapping i termovize.",
      tags: ["Drone záběry", "Mapping", "Termovize"],
    },
    {
      num: "04",
      title: "Timelapse",
      desc: "Zachycujeme stavbu kontinuálně i několik let. Autonomní kamery v jakémkoli počasí.",
      tags: ["Dlouhodobé", "Autonomní", "4K"],
    },
    {
      num: "05",
      title: "Vizualizace",
      desc: "Fotorealistické 3D vizuály z architektonických plánů. Pro investory, úřady i klienty.",
      tags: ["3D rendery", "Animace", "Walkthroughs"],
    },
    {
      num: "06",
      title: "Správa sítí",
      desc: "Kompletní správa Instagramu, LinkedInu a Facebooku. Strategie, copywriting, konzistence.",
      tags: ["Instagram", "LinkedIn", "Facebook"],
    },
  ];

  return (
    <section
      id="services"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: COLORS.navy,
        padding: isMobile ? "80px 20px" : "120px 48px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isMobile ? 20 : 48,
          right: isMobile ? 20 : 48,
          height: 1,
          background: COLORS.navyLight,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: isMobile ? 48 : 80,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: COLORS.grey,
                textTransform: "uppercase",
                fontFamily: FONT,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              (Služby)
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: isMobile ? 32 : 48,
                fontWeight: 300,
                color: COLORS.white,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Co pro vás
              <br />
              <span style={{ fontWeight: 700, color: COLORS.accent }}>děláme</span>
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                padding: isMobile ? "24px 0" : isCompact ? "30px 0" : "36px 0",
                borderTop: `1px solid ${COLORS.navyLight}`,
                display: "flex",
                flexDirection: isCompact ? "column" : "row",
                alignItems: isCompact ? "flex-start" : "center",
                gap: isMobile ? 12 : isCompact ? 16 : 40,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 500,
                  color: COLORS.accent,
                  letterSpacing: 2,
                  minWidth: 40,
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  fontFamily: FONT,
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 700,
                  color: COLORS.white,
                  minWidth: isCompact ? 0 : 300,
                  margin: 0,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 400,
                  color: COLORS.greyLight,
                  lineHeight: 1.7,
                  flex: 1,
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
              <ul style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
                {s.tags.map((t, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: 10,
                      letterSpacing: 1,
                      color: COLORS.accent,
                      border: `1px solid ${COLORS.navyLight}`,
                      padding: "4px 10px",
                      fontFamily: FONT,
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
  const { isMobile, isCompact } = useBreakpoint();
  const [ref, inView] = useInView(0.1);
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      name: "Bosch JHP Werk 5",
      desc: "Hala 40 000 m² a velký parkovací dům",
      heroImg: "/images/bosch-hero.jpg",
      gallery: ["/images/bosch-02.jpg", "/images/bosch-03.jpg"],
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
      heroImg: "/images/nexen-hero.jpg",
      gallery: ["/images/nexen-02.jpg", "/images/nexen-03.jpg"],
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
      heroImg: "/images/bauhaus-hero.jpg",
      gallery: ["/images/bauhaus-02.jpg"],
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
      heroImg: "/images/fve-hero.jpg",
      gallery: ["/images/fve-02.jpg"],
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
      heroImg: "/images/jipocar-hero.jpg",
      gallery: ["/images/jipocar-02.jpg"],
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
    <section
      id="projects"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: COLORS.offWhite,
        padding: isMobile ? "80px 0" : "120px 0",
        position: "relative",
      }}
    >
      <div style={{ padding: isMobile ? "0 20px" : "0 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: isMobile ? 40 : 64,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: COLORS.grey,
                textTransform: "uppercase",
                fontFamily: FONT,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              (Reference)
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: isMobile ? 32 : 48,
                fontWeight: 300,
                color: COLORS.navy,
                margin: 0,
              }}
            >
              Vybrané <span style={{ fontWeight: 700 }}>projekty</span>
            </h2>
          </div>
          <div
            style={{
              fontSize: 12,
              color: COLORS.grey,
              fontFamily: FONT,
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            ({String(activeProject + 1).padStart(2, "0")}/
            {String(projects.length).padStart(2, "0")})
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isCompact ? "column" : "row", gap: 0, marginBottom: isMobile ? 32 : 48 }}>
          {/* Left — Hero image with quarter timeline */}
          <div
            style={{
              flex: isCompact ? "0 0 auto" : "0 0 55%",
              position: "relative",
              background: COLORS.navy,
              minHeight: isMobile ? 240 : isCompact ? 340 : 440,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Project hero image as background */}
            <div style={{ flex: 1, position: "relative" }}>
              <Image
                src={proj.heroImg}
                alt={proj.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1200px) 55vw, 660px"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(13,31,45,0.2) 0%, rgba(13,31,45,0.5) 100%)",
                }}
              />
            </div>

            {/* Quarter strips */}
            {!isCompact && (
            <div style={{ display: "flex", height: "100%", position: "relative", zIndex: 2 }}>
              {proj.quarters.map((q, i) => (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: "100%",
                    borderLeft: `1px solid ${COLORS.navyLight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                    background: "rgba(21,42,62,0.7)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(30,58,82,0.9)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(21,42,62,0.7)")
                  }
                >
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      fontSize: 10,
                      letterSpacing: 2,
                      color: COLORS.grey,
                      fontFamily: FONT,
                      fontWeight: 500,
                      transform: "rotate(180deg)",
                    }}
                  >
                    {q}
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Right — Info */}
          <div
            style={{
              flex: 1,
              padding: isMobile ? "28px 24px" : isCompact ? "36px 32px" : "48px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `1px solid ${COLORS.greyLight}`,
              borderLeft: isCompact ? `1px solid ${COLORS.greyLight}` : "none",
              borderTop: isCompact ? "none" : `1px solid ${COLORS.greyLight}`,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {proj.tags.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      letterSpacing: 1.5,
                      color: COLORS.navy,
                      border: `1px solid ${COLORS.greyLight}`,
                      padding: "5px 12px",
                      fontFamily: FONT,
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3
                style={{
                  fontFamily: FONT,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.navy,
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                {proj.name}
              </h3>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 400,
                  color: COLORS.greyDark,
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                {proj.desc}
              </div>

              {/* Gallery thumbnails */}
              <div style={{ display: "flex", gap: 8 }}>
                {proj.gallery.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: 100,
                      height: 68,
                      borderRadius: 4,
                      overflow: "hidden",
                      border: `1px solid ${COLORS.greyLight}`,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${proj.name} ${i + 2}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
                paddingTop: 32,
                borderTop: `1px solid ${COLORS.greyLight}`,
                marginTop: 32,
              }}
            >
              {proj.stats.map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.navy,
                    }}
                  >
                    <AnimatedCounter
                      target={s.num}
                      suffix={s.suffix}
                      inView={inView}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.grey,
                      fontFamily: FONT,
                      fontWeight: 500,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project selector */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderTop: `1px solid ${COLORS.greyLight}`,
            overflowX: isCompact ? "auto" : "visible",
            scrollbarWidth: "none",
          }}
        >
          {projects.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveProject(i)}
              aria-pressed={activeProject === i}
              aria-label={`Zobrazit projekt ${p.name}`}
              style={{
                flex: isCompact ? "0 0 auto" : 1,
                minWidth: isCompact ? 160 : 0,
                padding: isMobile ? "20px 16px" : "24px 20px",
                cursor: "pointer",
                borderRight:
                  i < projects.length - 1
                    ? `1px solid ${COLORS.greyLight}`
                    : "none",
                borderTop: "none",
                borderLeft: "none",
                borderBottom: "none",
                background: activeProject === i ? COLORS.navy : "transparent",
                transition: "all 0.4s ease",
                textAlign: "left",
                font: "inherit",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: activeProject === i ? COLORS.accent : COLORS.grey,
                  fontFamily: FONT,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: activeProject === i ? COLORS.white : COLORS.navy,
                  fontFamily: FONT,
                  transition: "color 0.3s ease",
                }}
              >
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GLOBAL STATS
// ============================================================
function StatsSection() {
  const { isMobile } = useBreakpoint();
  const [ref, inView] = useInView(0.3);

  const stats = [
    { num: 15, suffix: "+", label: "Dokončených projektů" },
    { num: 48, suffix: "+", label: "Timelapse kamer" },
    { num: 150000, suffix: "+", label: "Nasnímaných fotografií" },
    { num: 500, suffix: "+", label: "Hodin video materiálu" },
  ];

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: COLORS.navy,
        padding: isMobile ? "60px 20px" : "100px 48px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 24 : 80,
            alignItems: "flex-start",
            marginBottom: isMobile ? 40 : 80,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                color: COLORS.grey,
                textTransform: "uppercase",
                fontFamily: FONT,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              (Proč my)
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: isMobile ? 36 : 56,
                fontWeight: 700,
                color: COLORS.white,
                lineHeight: 1.1,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Čísla
              <br />
              mluví
              <br />
              za nás
            </h2>
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 400,
              color: COLORS.grey,
              lineHeight: 1.8,
              maxWidth: 400,
              paddingTop: isMobile ? 0 : 40,
            }}
          >
            Specializujeme se výhradně na stavebnictví a development. Každý
            projekt dokumentujeme od prvního výkopu po slavnostní předání.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 0,
            borderTop: `1px solid ${COLORS.navyLight}`,
          }}
        >
          {stats.map((s, i) => {
            const showRightBorder = isMobile ? i % 2 === 0 : i < 3;
            const showBottomBorder = isMobile && i < 2;
            return (
            <div
              key={i}
              style={{
                padding: isMobile ? "28px 16px" : "48px 32px",
                borderRight: showRightBorder ? `1px solid ${COLORS.navyLight}` : "none",
                borderBottom: showBottomBorder ? `1px solid ${COLORS.navyLight}` : "none",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: isMobile ? 32 : 48,
                  fontWeight: 700,
                  color: COLORS.accent,
                  marginBottom: 8,
                }}
              >
                <AnimatedCounter
                  target={s.num}
                  suffix={s.suffix}
                  inView={inView}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.grey,
                  fontFamily: FONT,
                  fontWeight: 500,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT — Text Reveal (Sticky Scroll)
// ============================================================
function AboutSection() {
  const { isMobile } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

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

  const words =
    "Jsme marketingová agentura, která rozumí stavebnictví. Spojujeme kreativní produkci s technologiemi a přinášíme vašim projektům viditelnost, kterou si zaslouží.".split(
      " "
    );

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ height: "300vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.offWhite,
          overflowX: "clip",
        }}
      >
        <div style={{ maxWidth: 800, padding: isMobile ? "0 20px" : "0 48px", overflowWrap: "break-word" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 3,
              color: COLORS.grey,
              textTransform: "uppercase",
              fontFamily: FONT,
              fontWeight: 500,
              marginBottom: isMobile ? 24 : 40,
            }}
          >
            (O nás)
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: isMobile ? 24 : 40,
              fontWeight: 400,
              lineHeight: 1.5,
              overflowWrap: "break-word",
              margin: 0,
            }}
          >
            {words.map((word, i) => {
              const wordPct = i / words.length;
              const isRevealed = scrollPct > wordPct;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline",
                    color: isRevealed ? COLORS.navy : COLORS.greyLight,
                    transition: "color 0.3s ease",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT / CTA
// ============================================================
function ContactSection() {
  const { isMobile } = useBreakpoint();
  const [ref, inView] = useInView(0.2);

  return (
    <section
      id="contact"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: COLORS.navyDark,
        padding: isMobile ? "80px 20px" : "120px 48px",
        position: "relative",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isMobile ? 20 : 48,
          right: isMobile ? 20 : 48,
          height: 1,
          background: COLORS.navyLight,
        }}
      />

      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 3,
            color: COLORS.grey,
            textTransform: "uppercase",
            fontFamily: FONT,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          (Kontakt)
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: isMobile ? 34 : 52,
            fontWeight: 300,
            color: COLORS.white,
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 24,
          }}
        >
          Pojďme{" "}
          <span style={{ fontWeight: 700, color: COLORS.accent }}>
            spolupracovat
          </span>
        </h2>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 400,
            color: COLORS.grey,
            lineHeight: 1.7,
            marginBottom: 48,
          }}
        >
          Máte projekt, který si zaslouží být vidět? Ozvěte se nám a společně
          najdeme nejlepší způsob, jak ho představit světu.
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 64,
          }}
        >
          <a
            href="mailto:info@constructiva.cz"
            style={{
              fontFamily: FONT,
              fontSize: 13,
              letterSpacing: 2,
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "16px 40px",
              background: COLORS.accent,
              color: COLORS.navy,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            Napište nám
          </a>
          <a
            href="tel:+420737373430"
            style={{
              fontFamily: FONT,
              fontSize: 13,
              letterSpacing: 2,
              fontWeight: 500,
              textTransform: "uppercase",
              padding: "16px 40px",
              background: "transparent",
              color: COLORS.accent,
              textDecoration: "none",
              border: `1px solid ${COLORS.accent}`,
              transition: "all 0.3s ease",
            }}
          >
            +420 737 373 430
          </a>
        </div>

        <nav aria-label="Sociální sítě" style={{ display: "flex", gap: 32, justifyContent: "center" }}>
          {[
            { label: "Instagram", href: "https://instagram.com/constructiva.cz" },
            { label: "LinkedIn", href: "https://linkedin.com/company/constructiva" },
            { label: "Facebook", href: "https://facebook.com/constructiva.cz" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: COLORS.grey,
                fontFamily: FONT,
                fontWeight: 500,
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.3s ease",
                padding: "8px 4px",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = COLORS.grey)
              }
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const { isMobile } = useBreakpoint();
  return (
    <footer
      style={{
        background: COLORS.navyDark,
        padding: isMobile ? "28px 20px" : "40px 48px",
        borderTop: `1px solid ${COLORS.navyLight}`,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 16 : 0,
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image
          src="/images/logo.svg"
          alt="Constructiva"
          width={80}
          height={28}
          style={{ opacity: 0.5 }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          color: COLORS.grey,
          fontFamily: FONT,
          fontWeight: 400,
          letterSpacing: 1,
        }}
      >
        &copy; 2026 Constructiva.cz — Všechna práva vyhrazena
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
    <div
      style={{
        background: COLORS.offWhite,
        minHeight: "100vh",
      }}
    >
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        <a
          href="#main"
          style={{
            position: "absolute",
            left: -9999,
            top: 8,
            zIndex: 200,
            padding: "10px 16px",
            background: COLORS.accent,
            color: COLORS.navy,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
            borderRadius: 4,
          }}
          onFocus={(e) => (e.currentTarget.style.left = "8px")}
          onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
        >
          Přeskočit na obsah
        </a>
        <Navigation scrollTo={scrollTo} />
        <main id="main">
          <HeroSection />
          <ProcessSection />
          <LogoCarousel />
          <ServicesSection />
          <ProjectsSection />
          <StatsSection />
          <AboutSection />
        </main>
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
