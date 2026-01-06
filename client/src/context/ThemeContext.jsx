import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = window.document.documentElement;

        // Function to apply the correct class
        const applyTheme = (targetTheme) => {
            root.classList.remove("light", "dark", "galaxy", "sunset", "ocean");
            if (targetTheme === "system") {
                const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                root.classList.add(systemIsDark ? "dark" : "light");
            } else {
                root.classList.add(targetTheme);
            }
        };

        applyTheme(theme);

        // Listener for system changes if mode is 'system'
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
