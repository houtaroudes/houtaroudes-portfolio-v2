import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
import "./components/PixelTransition.css";

/* ===== Data ===== */
const projects = [
  { id: 1, title: "Motion Website", desc: "A front-end inspiration hub for exploring layout and animation ideas.", tags: ["HTML", "CSS", "JS"], demo: "https://motion-website-des.vercel.app", code: "https://github.com/houtaroudes/motion-website", type: "Full Stack", year: "2025" },
  { id: 2, title: "PixelPodWeb", desc: "A photobooth web app with PHP + MySQL backend — built solo as a school project.", tags: ["PHP", "MySQL", "CSS", "JS"], demo: "https://pixelpodweb.vercel.app", code: "https://github.com/houtaroudes/PixelPodWeb", type: "Full Stack", year: "2025" },
  { id: 3, title: "Houtarou Cafe", desc: "A concept cafe site with minimalist design — ordering flow and reservation system.", tags: ["HTML", "CSS", "JS"], code: "https://github.com/houtaroudes/houtarou-cafe", type: "Frontend", year: "2026" },
  { id: 4, title: "Learning WebDev Hub", desc: "My gamified learning hub with 26+ exercises, live previews, and code challenges!", tags: ["React", "Vite", "HTML", "CSS"], demo: "https://random-learning-webdev-site.vercel.app", code: "https://github.com/houtaroudes/random-learning-webdev-site", type: "Full Stack", year: "2026", featured: true },
  { id: 5, title: "Modern Filipino Homes", desc: "MONO-inspired architecture landing page with word-by-word scroll reveals, house carousel, and phase-built gallery — a premium Filipino housing showcase.", tags: ["React", "Vite", "Framer Motion"], demo: "https://modern-filipino-homes.vercel.app", code: "https://github.com/houtaroudes/Modern-Filipino-Homes", type: "Full Stack", year: "2026", featured: true },
  { id: 6, title: "Modern Filipino Homes Platform", desc: "A secure proptech platform: property showcase, interactive financing calculator, climate resilience matrix, AI chat assistant, and secure lead capture — sustainable homes for the modern Filipino.", tags: ["React", "Vite", "tRPC", "MySQL", "Tailwind"], demo: "https://modern-fil-homes.vercel.app", code: "https://github.com/houtaroudes/modern-fil-homes", type: "Full Stack", year: "2026", featured: true },
];

const skills = [
  { name: "HTML5", color: "#e34f26" }, { name: "CSS3", color: "#1572b6" },
  { name: "JavaScript", color: "#f7df1e" }, { name: "React", color: "#61dafb" },
  { name: "PHP", color: "#777bb3" }, { name: "MySQL", color: "#4479a1" },
  { name: "Git", color: "#f05032" }, { name: "Vite", color: "#a29bfe" },
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
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
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

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <motion.button
      className="btn" style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
        width: "40px", height: "40px", borderRadius: "50%", padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        color: "var(--text-secondary)", cursor: "pointer",
        boxShadow: "var(--shadow-md)",
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "backOut" }}
      whileHover={{ color: "var(--accent)", borderColor: "var(--accent)" }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} weight="Outline" />
    </motion.button>
  );
}

/* ===== Main Portfolio ===== */
export default function PortfolioV2() {
  const [scrolled, setScrolled] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme-v2");
    if (saved) return saved === "dark";
    return false;
  });
  const activeSection = useActiveSection(["hero", "skills", "projects", "contact"]);
  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme-v2", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const { count: projectCount, ref: projectRef } = useCountUp(4);
  const { count: skillCount, ref: skillRef } = useCountUp(8);

  return (
    <>
      {/* Navigation */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#" className="logo">
            <span>Houtarou</span>
            <span className="logo-accent">Des</span>
          </a>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="nav-links">
              {["skills", "projects", "contact"].map((id) => (
                <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-gradient" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-layout">
              {/* Profile Picture with PixelTransition grid effect */}
              <ProfilePicture />

              {/* Hero text */}
              <div className="hero-text-col">
                <div className="hero-tag">
                  <span>✦</span> Full-Stack Developer
                </div>
                <h1>
                  Hi, I'm <span className="gradient-text">HoutarouDes</span>
                </h1>
                <h2>
                  A college student passionate about web development — turning ideas into interactive experiences, one commit at a time. Based in the Philippines, specializing in full-stack development with Laravel, WordPress, and React.
                </h2>
                <div className="hero-actions">
                  <a href="#projects" className="btn btn-primary">
                    <Link size={15} weight="Outline" color="white" /> View Projects
                  </a>
                  <a href="#contact" className="btn btn-ghost">
                    <Envelope size={15} weight="Outline" /> Get in Touch
                  </a>
                  <a href="https://github.com/houtaroudes" target="_blank" rel="noopener" className="btn btn-ghost">
                    <IconGithub s={15} /> GitHub
                  </a>
                </div>

                {/* Stats */}
                <div className="hero-stats">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Skills */}
      <section className="section" id="skills">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> Technologies</div>
          <h2 className="section-title">Skills & Tools</h2>
          <p className="section-desc">Technologies I've been working with to build modern web applications.</p>
        </div>
        <div className="skills-grid reveal reveal-delay-1">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              className="skill-badge"
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span className="skill-dot" style={{ background: skill.color }} />
              {skill.name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Projects */}
      <section className="section" id="projects">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> Work</div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-desc">A collection of projects I've built — from full-stack apps to front-end experiments.</p>
        </div>

        {projects.filter((p) => p.featured).map((project) => (
          <motion.div
            key={project.id}
            className="featured-section reveal reveal-delay-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="featured-card">
              <div className="featured-badge-small">★ Featured Project</div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div className="card-tags" style={{ justifyContent: "center" }}>
                {project.tags.map((t) => (<span className="tag" key={t}>{t}</span>))}
              </div>
              <div className="hero-actions" style={{ justifyContent: "center" }}>
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener" className="btn btn-primary">
                    <Link size={15} weight="Outline" color="white" /> Live Demo
                  </a>
                )}
                <a href={project.code} target="_blank" rel="noopener" className="btn btn-ghost">
                  <IconGithub s={15} /> View Code
                </a>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="project-grid">
          {projects.filter((p) => !p.featured).map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card reveal"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="card-top">
                <span className="card-year">{project.year}</span>
                <span className={`card-badge ${project.featured ? "featured-badge" : ""}`}>{project.type}</span>
              </div>
              <h3 className="card-title">{project.title}</h3>
              <p className="card-desc">{project.desc}</p>
              <div className="card-tags">
                {project.tags.map((t) => (<span className="tag" key={t}>{t}</span>))}
              </div>
              <div className="card-actions">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener" className="card-link">
                    <Link size={13} weight="Outline" /> Live Demo
                  </a>
                )}
                <a href={project.code} target="_blank" rel="noopener" className="card-link">
                  <IconGithub s={13} /> Source
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Contact */}
      <section className="section" id="contact">
        <div className="section-header reveal">
          <div className="section-eyebrow"><EyebrowIcon /> Contact</div>
          <h2 className="section-title">Let's Build Together</h2>
          <p className="section-desc">Open for freelance gigs, school projects, or just talking shop about web dev.</p>
        </div>

        <div className="contact-card reveal reveal-delay-1">
          <h3>Get In Touch</h3>
          <p>Have a project in mind? Send me a message and I'll get back to you.</p>
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
                <textarea name="message" placeholder="Your message..." required rows={3} />
                <input type="hidden" name="_subject" value="New portfolio message!" />
                <input type="text" name="_gotcha" style={{ display: "none" }} />
                <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>
                  <Envelope size={15} weight="Outline" color="white" /> Send Message
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "20px", background: "var(--success-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--success-border)" }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "6px" }}>✓</div>
                <h4 style={{ fontWeight: "600", marginBottom: "4px", fontSize: "0.95rem" }}>Message Sent!</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Thanks for reaching out. I'll reply as soon as possible.</p>
              </motion.div>
            )}
          </form>
          <div className="contact-info">
            <span>Or reach me directly:</span>
            <a href="mailto:houtaroudes@gmail.com"><Envelope size={13} weight="Outline" /> houtaroudes@gmail.com</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <p>Designed & built by HoutarouDes</p>
          <p style={{ marginTop: "4px", fontSize: "0.75rem" }}>Built with passion, powered by curiosity — no templates, just code.</p>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
}
