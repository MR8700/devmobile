import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

 const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  /* ======================
     COULEURS DYNAMIQUES
  ====================== */
  export const colors = {
    background: darkMode ? '#1f2937' : '#f7f9fc',
    card: darkMode ? '#374151' : '#fff',
    textPrimary: darkMode ? '#f3f4f6' : '#111827',
    textMuted: darkMode ? '#9ca3af' : '#374151',
    accent: '#4a90e2',
  };
