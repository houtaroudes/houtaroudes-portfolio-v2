import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Gear, Package, Game } from "reicon-react";
import { TECH_GROUPS, TOTAL_TECH_SKILLS } from "../data/techStack.js";

/* ===== Motion ===== */
const EASE = [0.22, 1, 0.36, 1];
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

const GROUP_ICONS = { "Frontend & Core": Monitor, "Backend & Databases": Gear, "Tools & Platforms": Package, "Creative & More": Game };

function TechGroup({ name, skills }) {
  const Icon = GROUP_ICONS[name] ?? Gear;
  return (
    <motion.div className="ts-group" variants={itemVariants}>
      <div className="ts-group-head">
        <span className="ts-group-icon"><Icon size={17} weight="Outline" /></span>
        <h4 className="ts-group-name">{name}</h4>
        <span className="ts-group-count">{skills.length}</span>
      </div>
      <div className="ts-chips">
        {skills.map((skill) => (
          <span className="ts-chip" key={skill}>{skill}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ===== Modal ===== */
export default function TechStackModal({ open, onClose }) {
  const closeButtonRef = useRef(null);

  // Lock page scroll while the modal is open.
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Close on Escape and focus the close button for keyboard users.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ts-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="ts-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Tech stack and skills"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ts-header">
              <div>
                <div className="section-eyebrow">Under the Hood</div>
                <h3 className="ts-title">Tech Stack &amp; Skills</h3>
                <p className="ts-sub">Every tool I reach for across front-end, back-end, and creative work.</p>
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                className="ts-close"
                onClick={onClose}
                aria-label="Close tech stack"
              >
                <X size={18} weight="Outline" />
              </button>
            </div>

            <motion.div className="ts-body" variants={listVariants} initial="hidden" animate="visible">
              {TECH_GROUPS.map((group) => (
                <TechGroup key={group.name} {...group} />
              ))}
            </motion.div>

            <div className="ts-footer">
              <span>{TOTAL_TECH_SKILLS} tools &amp; technologies — and always learning more.</span>
              <a href="https://github.com/houtaroudes" target="_blank" rel="noopener noreferrer">
                github.com/houtaroudes →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
