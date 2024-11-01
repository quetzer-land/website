"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<string | null>(null);

    // Appliquer le thème sauvegardé au chargement initial
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    useEffect(() => {
        if (theme) {
            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme: theme || "light", toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};