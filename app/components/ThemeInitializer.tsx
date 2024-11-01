"use client";
import { useEffect } from "react";

const ThemeInitializer = () => {
    useEffect(() => {
        // Vérifie le thème stocké dans localStorage
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = savedTheme || (prefersDark ? "dark" : "light");

        // Applique le thème
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, []);

    return null; // Ce composant n'a pas besoin de rendre de contenu
};

export default ThemeInitializer;