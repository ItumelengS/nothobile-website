'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getWeatherCondition, getThemeForWeather, applyWeatherTheme } from '@/lib/weather';

interface WeatherContextType {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'stormy';
  themeName: string;
  isLoading: boolean;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [condition, setCondition] = useState<WeatherContextType['condition']>('sunny');
  const [themeName, setThemeName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshWeather = async () => {
    try {
      setIsLoading(true);
      const newCondition = await getWeatherCondition();
      const theme = getThemeForWeather(newCondition);
      
      setCondition(newCondition);
      setThemeName(theme.name);
      
      // Apply theme with a smooth transition
      if (typeof window !== 'undefined') {
        document.body.style.transition = 'background-image 0.8s ease-in-out';
        applyWeatherTheme(theme);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial weather fetch
  useEffect(() => {
    refreshWeather();
  }, []);

  // Refresh weather every 30 minutes
  useEffect(() => {
    const interval = setInterval(refreshWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value: WeatherContextType = {
    condition,
    themeName,
    isLoading,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}