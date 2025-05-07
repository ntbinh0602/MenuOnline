import React, {createContext, useContext, useState} from 'react';

// Define theme type
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    danger: string;
    white: string;
  };
}

// Define theme
const defaultTheme: Theme = {
  colors: {
    primary: '#007AFF',
    danger: '#FF3B30',
    secondary: '#ccccccc',
    white: '#FFFFFF',
  },
};

// Create context
interface ThemeContextType {
  theme: Theme;
  updateTheme: (newColors: Partial<Theme['colors']>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
});

// Create provider component
export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const updateTheme = (newColors: Partial<Theme['colors']>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        ...newColors,
      },
    }));
  };

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create custom hook
export const useTheme = (): ThemeContextType => useContext(ThemeContext);
