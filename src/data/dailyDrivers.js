/* ===== Daily Drivers — the tools I reach for every single session =====
   `color` present  -> the file is a single-color glyph, so it is tinted
                       through a CSS mask using that brand colour.
   `color` absent   -> the file is a multi-colour brand mark, rendered as
                       a plain <img>.
   `darkColor`      -> optional dark-mode override for near-black marks
                       that would disappear on the dark card.

   Brand colours live here (not in index.css) because they are external
   brand identifiers, not part of the site palette.
*/
export const DAILY_DRIVERS = [
  { name: "VS Code", icon: "/icons/vscode.svg" },
  { name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
  { name: "TypeScript", icon: "/icons/typescript.svg", color: "#3178C6" },
  { name: "JavaScript", icon: "/icons/javascript.svg", color: "#F7DF1E" },
  { name: "Node.js", icon: "/icons/nodedotjs.svg", color: "#5FA04E" },
  { name: "PHP", icon: "/icons/php.svg", color: "#777BB4" },
  { name: "Laravel", icon: "/icons/laravel.svg", color: "#FF2D20" },
  { name: "MySQL", icon: "/icons/mysql.svg", color: "#4479A1" },
  { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg", color: "#06B6D4" },
  { name: "Vite", icon: "/icons/vite.svg", color: "#646CFF" },
  { name: "Git", icon: "/icons/git.svg", color: "#F05032" },
  { name: "GitHub", icon: "/icons/github.svg", color: "#181717", darkColor: "#E9EDF5" },
  { name: "Next.js", icon: "/icons/nextdotjs.svg", color: "#000000", darkColor: "#E9EDF5" },
  { name: "Three.js", icon: "/icons/threedotjs.svg", color: "#000000", darkColor: "#E9EDF5" },
  { name: "Python", icon: "/icons/python.svg", color: "#3776AB" },
];
