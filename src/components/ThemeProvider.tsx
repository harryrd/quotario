
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light"; // Tracks actual applied theme (light/dark)
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light"
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  // Effect to apply theme class and track resolved theme
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Function to apply theme to DOM
    const applyTheme = (newTheme: "dark" | "light") => {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };

    // Determine and apply the effective theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light";
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        const newSystemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(newSystemTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
