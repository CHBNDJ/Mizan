// "use client";
// import { useState, useEffect } from "react";
// import { Moon, Sun } from "lucide-react";

// export function ThemeToggle() {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     setIsDark(document.documentElement.classList.contains("dark"));
//   }, []);

//   const toggle = () => {
//     const next = !isDark;
//     setIsDark(next);
//     document.documentElement.classList.toggle("dark", next);
//     localStorage.setItem("mizan-theme", next ? "dark" : "light");
//   };

//   return (
//     <button
//       onClick={toggle}
//       aria-label="Basculer le mode sombre"
//       className="w-9 h-9 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:shadow-md hover:shadow-slate-400/20 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all cursor-pointer"
//     >
//       {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//     </button>
//   );
// }
