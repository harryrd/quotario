
import { createContext, useContext, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  fontSize: string;
  setFontSize: (fontSize: string) => void;
};

const initialState: ThemeProviderState = {
  fontSize: "M",
  setFontSize: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  storageKey = "ui-fontSize",
  ...props
}: ThemeProviderProps) {
  const [fontSize, setFontSize] = useState<string>(
    () => localStorage.getItem(storageKey) || "M"
  );

  // Effect to apply font size
  useEffect(() => {
    // Store fontSize in localStorage
    localStorage.setItem(storageKey, fontSize);
    
    // Apply monochrome theme to the document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("monochrome");
    
  }, [fontSize, storageKey]);

  const value = {
    fontSize,
    setFontSize: (newFontSize: string) => {
      localStorage.setItem(storageKey, newFontSize);
      setFontSize(newFontSize);
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
