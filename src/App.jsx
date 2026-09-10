import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Sun, Moon, ArrowUp, Envelope, Link } from "reicon-react";

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
const projects = [
  { id: 1, title: "Motion Website", desc: "A front-end inspiration hub for exploring layout and animation ideas.", tags: ["HTML", "CSS", "JS"], demo: "https://motion-website-des.vercel.app", code: "https://github.com/houtaroudes/motion-website", type: "Full Stack", year: "2025" },
  { id: 2, title: "PixelPodWeb", desc: "A photobooth web app with PHP + MySQL backend — built solo as a school project.", tags: ["PHP", "MySQL", "CSS", "JS"], demo: "https://pixelpodweb.vercel.app", code: "https://github.com/houtaroudes/PixelPodWeb", type: "Full Stack", year: "2025" },
  { id: 3, title: "Houtarou Cafe", desc: "A concept cafe site with minimalist design — ordering flow and reservation system.", tags: ["HTML", "CSS", "JS"], code: "https://github.com/houtaroudes/houtarou-cafe", type: "Frontend", year: "2026" },
  { id: 4, title: "Learning WebDev Hub", desc: "My gamified learning hub with 26+ exercises, live previews, and code challenges!", tags: ["React", "Vite", "HTML", "CSS"], demo: "https://random-learning-webdev-site.vercel.app", code: "https://github.com/houtaroudes/random-learning-webdev-site", type: "Full Stack", year: "2026" },
  { id: 5, title: "Modern Filipino Homes", desc: "MONO-inspired architecture landing page with word-by-word scroll reveals, house carousel, and phase-built gallery.", tags: ["React", "Vite", "Framer Motion"], demo: "https://modern-filipino-homes.vercel.app", code: "https://github.com/houtaroudes/Modern-Filipino-Homes", type: "Frontend", year: "2026" },
];

const flagship = {
  title: "Modern Filipino Homes Platform",
  desc: "My most complete build — a secure proptech platform: property showcase, interactive financing calculator, climate resilience matrix, AI chat assistant, and secure lead capture.",
  tags: ["React", "Vite", "tRPC", "MySQL", "Tailwind"],
  demo: "https://modern-fil-homes.vercel.app",
  code: "https://github.com/houtaroudes/modern-fil-homes",
  points: [
    "Live & deployed with security headers (CSP, HSTS)",
    "Full-stack: tRPC API, MySQL database, secure lead capture",
    "Financing calculator, AI chat assistant, property showcase",
  ],
};

const skills = [
  { name: "HTML5", color: "#e34f26" }, { name: "CSS3", color: "#1572b6" },
  { name: "JavaScript", color: "#f7df1e" }, { name: "React", color: "#61dafb" },
  { name: "PHP", color: "#777bb3" }, { name: "MySQL", color: "#4479a1" },
  { name: "Git", color: "#f05032" }, { name: "Vite", color: "#a29bfe" }, { name: "C#", color: "#68217a" }, { name: "C++", color: "#00599c" },
];

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
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
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
  const size = "clamp(110px, 13vw, 170px)";
  return (
    <div className="pfp-container">
      <PixelTransition
        firstContent={
          <img
            src="/images/pfp-default.jpg"
            alt="HoutarouDes"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        }
        secondContent={
          <img
            src="/images/pfp-hover.jpg"
            alt="HoutarouDes"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        }
        gridSize={12}
        pixelColor="#ffffff"
        animationStepDuration={0.4}
        once={false}
        aspectRatio="100%"
        className="pfp-pixel-transition"
        style={{ width: size, height: size, borderRadius: "50%" }}
      />
    </div>
  );
}

function ToolsMarquee() {
  const row = [...skills, ...skills, ...skills];
  return (
    <div className="tools-marquee" aria-hidden="true">
      <div className="tools-track">
        {row.map((skill, i) => (
          <span className="tool-chip" key={`${skill.name}-${i}`}>
            <span className="skill-dot" style={{ background: skill.color }} />
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function Flagship() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section className="section flagship-section" id="flagship" ref={ref}>
      <div className="flagship-progress-wrap" aria-hidden="true">
        <motion.div className="flagship-progress" style={{ scaleX: scrollYProgress }} />
      </div>
      <div className="section-header reveal">
        <div className="section-eyebrow"><EyebrowIcon /> Flagship Build</div>
        <h2 className="section-title">{flagship.title}</h2>
      </div>
      <div className="flagship-stage reveal reveal-delay-1">
        <div className="flagship-window" aria-hidden="true">
          <div className="fw-bar">
            <span /><span /><span />
            <em>modern-fil-homes.vercel.app</em>
          </div>
          <div className="fw-body">
            <div className="fw-hero">
              <div className="fw-hero-line" />
              <div className="fw-hero-line short" />
              <div className="fw-hero-cta" />
            </div>
            <div className="fw-cards">
              <div className="fw-card"><i /><b /><u /></div>
              <div className="fw-card"><i /><b /><u /></div>
              <div className="fw-card"><i /><b /><u /></div>
            </div>
          </div>
        </div>
        <div className="flagship-info">
          <p>{flagship.desc}</p>
          <div className="card-tags">
            {flagship.tags.map((t) => (<span className="tag" key={t}>{t}</span>))}
          </div>
          <ul className="flagship-points">
            {flagship.points.map((p) => (<li key={p}>{p}</li>))}
          </ul>
          <div className="hero-actions">
            <a href={flagship.demo} target="_blank" rel="noopener" className="btn btn-primary">
              <Link size={15} weight="Outline" color="white" /> Live Demo
            </a>
            <a href={flagship.code} target="_blank" rel="noopener" className="btn btn-ghost">
              <IconGithub s={15} /> View Code
            </a>
          </div>
        </div>
      </div>
    </section>
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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme-v2");
    if (saved) return saved === "dark";
    return false;
  });
  const activeSection = useActiveSection(["home", "about", "work", "services", "contact"]);
  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme-v2", darkMode ? "dark" : "light");
  }, [darkMode]);

  const { count: projectCount, ref: projectRef } = useCountUp(6);
  const { count: skillCount, ref: skillRef } = useCountUp(10);

  return (
    <>
      {/* Navigation */}
      <nav className={mobileMenu ? "open" : ""}>
        <div className="nav-inner">
          <a href="#home" className="logo" onClick={() => setMobileMenu(false)}>
            <span>Houtarou</span>
            <span className="logo-accent">Des</span>
          </a>
          <div className="nav-links">
            {NAV_ITEMS.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={activeSection === n.id ? "active" : ""}>
                {n.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="https://houtaroudes-game-portfolio.vercel.app" className="version-btn" target="_blank" rel="noopener">
              Pixel Portfolio
            </a>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} weight="Outline" /> : <Moon size={18} weight="Outline" />}
            </button>
            <button
              className="nav-burger"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menu"
              aria-expanded={mobileMenu}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-gradient" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-eyebrow"><span>✦</span> FULL-STACK DEVELOPER — PHILIPPINES</div>
            <h1 className="hero-display">
              Building the web,<br />
              <span className="hero-outline">one commit</span> at a time.
            </h1>
            <p className="hero-sub">
              Hi, I'm HoutarouDes — a college student turning ideas into interactive experiences.
              Full-stack development with Laravel, WordPress, and React.
            </p>
            <div className="hero-actions">
              <a href="#work" className="btn btn-primary">View My Work</a>
              <a href="#contact" className="btn btn-ghost">Get in Touch</a>
            </div>
          </motion.div>
        </div>
        <ToolsMarquee />
      </section>

      {/* About */}
      <section className="section about-section" id="about">
        <div className="about-grid">
          <div className="about-media reveal">
            <ProfilePicture />
            <div className="about-stats">
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
          </div>
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

      {/* Work — bento grid with flagship */}
      <section className="section" id="work">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> Selected Work</div>
          <h2 className="section-title">Projects</h2>
        </div>
        <Flagship />
        <div className="bento-grid">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.demo || project.code}
              target="_blank"
              rel="noopener"
              className={`bento-card reveal ${i === 0 ? "bento-wide" : ""}`}
              style={{ transitionDelay: `${0.05 * i}s` }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            >
              <div className="bc-top">
                <span className="bc-type">{project.type}</span>
                <span className="bc-year">{project.year}</span>
              </div>
              <h3 className="bc-title">{project.title}</h3>
              <p className="bc-desc">{project.desc}</p>
              <div className="card-tags">
                {project.tags.map((t) => (<span className="tag" key={t}>{t}</span>))}
              </div>
              <div className="bc-links">
                {project.demo && <span className="bc-link"><Link size={12} weight="Outline" /> Demo</span>}
                <span className="bc-link"><IconGithub s={12} /> Code</span>
              </div>
            </motion.a>
          ))}
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

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} HoutarouDes — designed & built with code, not templates.</p>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
}
