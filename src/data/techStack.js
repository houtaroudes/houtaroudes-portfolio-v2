/* ===== Tech stack data (mirrors the GitHub profile README) ===== */
export const TECH_GROUPS = [
  {
    name: "Frontend & Core",
    skills: ["JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Next.js", "React Router", "React Query", "Vite", "Tailwind CSS"],
  },
  {
    name: "Backend & Databases",
    skills: ["Node.js", "tRPC", "PHP", "Laravel", "MySQL", "REST APIs", "WordPress"],
  },
  {
    name: "Tools & Platforms",
    skills: ["Git", "GitHub", "Vercel", "C#", ".NET", "Python", "PowerShell"],
  },
  {
    name: "Creative & More",
    skills: ["React Native", "Three.js", "Arduino", "Adobe Photoshop", "Adobe After Effects", "Adobe Lightroom", "Adobe Premiere Pro"],
  },
];

/* Five tags shown on the work card; the rest live inside the modal. */
export const TECH_STACK_PREVIEW = ["React", "TypeScript", "Laravel", "MySQL", "Tailwind CSS"];

export const TOTAL_TECH_SKILLS = TECH_GROUPS.reduce((sum, group) => sum + group.skills.length, 0);
