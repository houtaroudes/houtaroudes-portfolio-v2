import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowUp, Envelope, Home, User, Briefcase, MessageCircle, Gamepad } from "reicon-react";
// Decorative background — code-split so the shader stays out of the main bundle.
const ContourBackground = lazy(() => import("./components/ContourBackground"));
import ProjectsGrid from "./components/ProjectsGrid";
import TechStack from "./components/TechStack";

const IconGithub = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4 1.2-4-2.1-5.5-2.5M17 22v-3.2c0-.9-.3-1.5-.6-1.8 2.1-.2 4.3-1 4.3-4.7 0-1-.4-1.9-1-2.6.1-.3.4-1.3-.1-2.7 0 0-.9-.3-2.9 1a10 10 0 00-5.4 0c-2-1.3-2.9-1-2.9-1-.5 1.4-.2 2.4-.1 2.7-.6.7-1 1.6-1 2.6 0 3.7 2.2 4.5 4.3 4.7-.3.3-.5.7-.6 1.4V22" />
  </svg>
);
const EyebrowIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{marginRight:6}}>
    <path d="M4 0L8 4L4 8L0 4Z"/>
  </svg>
);
import PixelTransition from "./components/PixelTransition";
import GitHubHeatmap from "./components/GitHubHeatmap";
import "./components/PixelTransition.css";

/* ===== Data ===== */
const services = [
  { title: "Full-Stack Web Apps", desc: "React front-ends with real backends — APIs, databases, auth. From idea to deployed product." },
  { title: "Landing Pages", desc: "Fast, animated, pixel-perfect marketing pages that load quickly and convert visitors." },
  { title: "School & Project Help", desc: "Clean, well-documented code for capstones and school projects — built to actually work." },
];

const method = [
  { step: "01", title: "Discover", desc: "We talk about what you need — goals, features, timeline. No jargon, just clarity." },
  { step: "02", title: "Build", desc: "I ship working software in small increments so you see progress every step of the way." },
  { step: "03", title: "Launch & Support", desc: "We deploy it live, then I stick around for fixes, tweaks, and improvements." },
];

const faqs = [
  { q: "What can you build?", a: "Full-stack web apps, landing pages, and school projects — React front-ends, PHP or Node backends, MySQL databases, all deployed live." },
  { q: "How much does a project cost?", a: "It depends on scope. Student and school projects are budget-friendly; bigger apps are quoted after we talk about what you need." },
  { q: "How long does it take?", a: "A landing page can take days; a full app takes weeks. I work in increments so you see real progress early." },
  { q: "Can you maintain my existing project?", a: "Yes — fixes, new features, or deployment help on existing codebases are all fine." },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "services", label: "Services", Icon: Briefcase },
  { id: "contact", label: "FAQs / Contact", Icon: MessageCircle },
];

const SIDEBAR_SOCIALS = [
  { label: "GitHub", href: "https://github.com/houtaroudes" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Pixel Portfolio", href: "https://houtaroudes-game-portfolio.vercel.app" },
];

/* ===== Hooks ===== */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setActive(entry.target.id); break; }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime;
          const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ===== Components ===== */
function ProfilePicture() {
  return (
    <div className="pfp-container">
      <PixelTransition
        firstContent={
          <img
            src="/images/pfp-default.jpg"
            alt="Bryan Sacueza"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px" }}
          />
        }
        secondContent={
          <img
            src="/images/pfp-hover.jpg"
            alt="Bryan Sacueza"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px" }}
          />
        }
        gridSize={12}
        pixelColor="#ffffff"
        animationStepDuration={0.4}
        once={false}
        aspectRatio="100%"
        className="pfp-pixel-transition"
        style={{ width: "100%", height: "100%", borderRadius: "22px" }}
      />
    </div>
  );
}

function Sidebar({ active, onNavigate, open, dark, onToggleTheme }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Sidebar">
      <a href="#home" className="sidebar-pfp" aria-label="Go to top">
        <ProfilePicture />
      </a>
      <div className="sidebar-identity">
        <h2 className="sidebar-name">
          Bryan Sacueza
          <svg className="sidebar-verified" width="16" height="16" viewBox="0 0 24 24" fill="#4f8ff7" aria-label="Verified">
            <path d="M12 1.5l2.6 2 3.2-.4 1.2 3 2.9 1.5-.8 3.2.8 3.2-2.9 1.5-1.2 3-3.2-.4-2.6 2-2.6-2-3.2.4-1.2-3L3.1 14l.8-3.2-.8-3.2L6 6.1l1.2-3 3.2.4z" />
            <path d="M10.6 15.9l-3.3-3.3 1.3-1.3 2 2 4.8-4.8 1.3 1.3z" fill="#fff" stroke="none" />
          </svg>
        </h2>
        <p className="sidebar-handle">@houtaroudes · Full-Stack Dev</p>
      </div>
      <div className="sidebar-socials">
        {SIDEBAR_SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener" className="sidebar-social" title={s.label} aria-label={s.label}>
            {s.label === "GitHub" ? <IconGithub s={16} /> : s.label === "LinkedIn" ? <span className="sidebar-social-glyph">in</span> : <Gamepad size={16} weight="Outline" />}
          </a>
        ))}
        <button
          className="sidebar-social theme"
          onClick={onToggleTheme}
          title={dark ? "Light Mode" : "Dark Mode"}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} weight="Outline" /> : <Moon size={16} weight="Outline" />}
        </button>
      </div>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={`sidebar-link ${active === n.id ? "active" : ""}`} onClick={onNavigate}>
            <span className="sidebar-link-icon"><n.Icon size={19} weight="Outline" /></span>
            {n.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-copyright">
        <p>© {new Date().getFullYear()} Bryan Sacueza</p>
        <p>Built with code, not templates.</p>
      </div>
    </aside>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="section-header reveal">
        <div className="section-eyebrow"><EyebrowIcon /> FAQ</div>
        <h2 className="section-title">Questions, Answered</h2>
      </div>
      <div className="faq-list reveal reveal-delay-1">
        {faqs.map((f, i) => (
          <div className={`faq-item ${open === i ? "open" : ""}`} key={f.q}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {f.q}
              <span className="faq-chev">⌄</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className="faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <motion.button
      className="btn scrolltop" style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 90,
        width: "40px", height: "40px", borderRadius: "50%", padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "backOut" }}
      whileHover={{ color: "var(--orange)", borderColor: "var(--orange)" }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} weight="Outline" />
    </motion.button>
  );
}

/* ===== Main Portfolio — BrewedOps-style rebuild ===== */
export default function PortfolioV2() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme-v2");
    if (saved) return saved === "dark";
    return false;
  });
  const activeSection = useActiveSection(["home", "about", "services", "contact"]);
  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme-v2", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleNavClick = () => setSidebarOpen(false);

  const { count: projectCount, ref: projectRef } = useCountUp(6);
  const { count: skillCount, ref: skillRef } = useCountUp(10);

  return (
    <>
      {/* Animated background */}
      <Suspense fallback={null}>
        <ContourBackground />
      </Suspense>

      {/* Mobile top bar */}
      <header className={`mobile-bar ${sidebarOpen ? "open" : ""}`}>
        <a href="#home" className="logo" onClick={handleNavClick}>
          <span>Bryan</span>{" "}
          <span className="logo-accent">Sacueza</span>
        </a>
        <button
          className="nav-burger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
          aria-expanded={sidebarOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Sidebar backdrop (mobile) */}
      <div className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        active={activeSection}
        onNavigate={handleNavClick}
        open={sidebarOpen}
        dark={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      {/* Main column (right of sidebar) */}
      <div className="main-col">

      {/* Home — Projects showcase (BrewedOps style) */}
      <section className="hero" id="home">
        <svg className="hero-doodles" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1200 800">
          <path d="M-80 620 C 260 300, 620 760, 1280 320" />
          <path d="M300 -60 C 520 240, 980 120, 1300 420" />
        </svg>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectsGrid />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack — the card that opens the full breakdown. The Daily
          Drivers strip now lives inside the Projects head above. */}
      <TechStack />

      {/* About */}
      <section className="section about-section" id="about">
        <div className="about-grid">
          <div className="about-body">
            <div className="section-eyebrow reveal"><EyebrowIcon /> About Me</div>
            <h2 className="section-title reveal reveal-delay-1">Code, coffee, and curiosity.</h2>
            <p className="about-lede reveal reveal-delay-2">
              I'm a college student from the Philippines who fell in love with web development —
              turning ideas into interactive experiences, one commit at a time.
            </p>
            <p className="about-text reveal reveal-delay-2">
              I specialize in full-stack development with Laravel, WordPress, and React. I love the
              whole journey: sketching the idea, building it out, and shipping it live. When I'm not
              coding, I'm probably tweaking this portfolio or pushing commits at 2 AM.
            </p>
            <div className="about-stats reveal reveal-delay-3">
              <div>
                <div className="stat-value"><span ref={projectRef}>{projectCount}</span>+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div>
                <div className="stat-value"><span ref={skillRef}>{skillCount}</span></div>
                <div className="stat-label">Technologies</div>
              </div>
              <div>
                <div className="stat-value">2025</div>
                <div className="stat-label">Started Coding</div>
              </div>
            </div>
            <a href="https://github.com/houtaroudes" target="_blank" rel="noopener" className="btn btn-ghost reveal reveal-delay-3">
              <IconGithub s={15} /> github.com/houtaroudes
            </a>
          </div>
        </div>
        <div className="about-heatmap reveal">
          <div className="section-eyebrow"><EyebrowIcon /> GitHub Activity</div>
          <GitHubHeatmap compact />
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> What I Do</div>
          <h2 className="section-title">Services</h2>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="service-card reveal"
              style={{ transitionDelay: `${0.08 * i}s` }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            >
              <div className="sc-num">0{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="section method-section">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> How It Works</div>
          <h2 className="section-title">From idea to live, in three steps</h2>
        </div>
        <div className="method-grid">
          {method.map((m, i) => (
            <div className="method-step reveal" style={{ transitionDelay: `${0.1 * i}s` }} key={m.step}>
              <div className="ms-step">{m.step}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <Faq />

      {/* Contact */}
      <section className="section" id="contact">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> Contact</div>
          <h2 className="section-title">Let's build something together</h2>
          <p className="section-desc">Open for freelance gigs, school projects, or just talking shop about web dev.</p>
        </div>
        <div className="contact-split reveal reveal-delay-1">
          <div className="contact-info-col">
            <p className="contact-lede">
              Have a project in mind? Send me a message and I'll get back to you as soon as I can.
            </p>
            <a href="mailto:houtaroudes@gmail.com" className="contact-email">
              <Envelope size={15} weight="Outline" /> houtaroudes@gmail.com
            </a>
            <div className="contact-socials">
              <a href="https://github.com/houtaroudes" target="_blank" rel="noopener"><IconGithub s={14} /> GitHub</a>
              <a href="https://houtaroudes-game-portfolio.vercel.app" target="_blank" rel="noopener">Pixel Portfolio →</a>
            </div>
          </div>
          <form
            className="contact-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              try {
                await fetch("https://formspree.io/f/xzdnjdbd", {
                  method: "POST", body: data,
                  headers: { Accept: "application/json" },
                });
                setFormSent(true);
              } catch { e.target.submit(); }
            }}
          >
            {!formSent ? (
              <>
                <input type="text" name="name" placeholder="Your name" required />
                <input type="email" name="email" placeholder="Your email" required />
                <textarea name="message" placeholder="Tell me about your project..." required rows={4} />
                <input type="hidden" name="_subject" value="New portfolio message!" />
                <input type="text" name="_gotcha" style={{ display: "none" }} />
                <button type="submit" className="btn btn-primary">Send Message</button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="form-success"
              >
                <div>✓</div>
                <h4>Message Sent!</h4>
                <p>Thanks for reaching out. I'll reply as soon as possible.</p>
              </motion.div>
            )}
          </form>
        </div>
      </section>

      {/* Footer — mobile only; desktop shows copyright in the sidebar */}
      <footer className="footer-mobile">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Bryan Sacueza — designed & built with code, not templates.</p>
        </div>
      </footer>

      </div>{/* /main-col */}

      <ScrollToTop />
    </>
  );
}
