"use client";
import Image from "next/image";
import { useTheme } from "./ThemeContext";

const ThemeToggleIcon = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute transition-transform duration-500 ${theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
                    }`}
            >
                <Image src="/sun.svg" alt="Sun" height={50} width={50} />
            </div>
            <div
                className={`absolute transition-transform duration-500 ${theme === "light" ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
                    }`}
            >
                <Image src="/moon.svg" alt="Moon" height={50} width={50} />
            </div>
        </button>
    );
};

export default ThemeToggleIcon;