
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date?: string;
    hash?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  onEvent: (eventType: string, eventHandler: Function) => void;
  offEvent: (eventType: string, eventHandler: Function) => void;
  sendData: (data: any) => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: Function) => void;
    offClick: (callback: Function) => void;
    isVisible: boolean;
    isActive: boolean;
    text: string;
    enable: () => void;
    disable: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: Function) => void;
    offClick: (callback: Function) => void;
    isVisible: boolean;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramWebApp['initDataUnsafe']['user'] | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgApp = window.Telegram.WebApp;
      
      // Signal to Telegram that the WebApp is ready
      tgApp.ready();
      
      // Expand the WebApp to its maximum allowed height
      tgApp.expand();
      
      setWebApp(tgApp);
      setUser(tgApp.initDataUnsafe.user || null);
      setColorScheme(tgApp.colorScheme);
      
      // Listen for theme changes
      const themeChangeHandler = () => {
        setColorScheme(tgApp.colorScheme);
      };
      
      tgApp.onEvent('themeChanged', themeChangeHandler);
      
      return () => {
        tgApp.offEvent('themeChanged', themeChangeHandler);
      };
    }
  }, []);
  
  return { webApp, user, colorScheme };
};
