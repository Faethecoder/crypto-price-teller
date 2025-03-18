
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/Header';
import { CryptoCard } from '@/components/CryptoCard';
import { fetchCryptoData } from '@/services/cryptoService';
import { CryptoData, Currency } from '@/types/crypto';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('usd');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const { toast } = useToast();
  const { webApp, colorScheme } = useTelegramWebApp();

  const loadCryptoData = async () => {
    try {
      const data = await fetchCryptoData();
      setCryptoData(data);
      setLoading(false);
      
      // If running in Telegram, notify successful load with haptic feedback
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      toast({
        title: "Error loading data",
        description: "Could not fetch cryptocurrency prices. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
      
      // If running in Telegram, notify error with haptic feedback
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('error');
      }
    }
  };

  useEffect(() => {
    // Initial data load
    loadCryptoData();
    
    // Set up auto-refresh every 60 seconds
    const interval = window.setInterval(() => {
      loadCryptoData();
    }, 60000);
    
    setRefreshInterval(interval);
    
    // Clean up interval on component unmount
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  // Set up Telegram Main Button if we're in a Telegram mini app
  useEffect(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText('Refresh Prices');
      webApp.MainButton.show();
      
      const handleRefresh = () => {
        loadCryptoData();
        if (webApp.HapticFeedback) {
          webApp.HapticFeedback.impactOccurred('medium');
        }
      };
      
      webApp.MainButton.onClick(handleRefresh);
      
      return () => {
        webApp.MainButton.offClick(handleRefresh);
        webApp.MainButton.hide();
      };
    }
  }, [webApp]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    
    // Provide haptic feedback in Telegram
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  // Apply Telegram theme colors if available
  const themeStyle = webApp?.themeParams ? {
    backgroundColor: webApp.themeParams.bg_color || undefined,
    color: webApp.themeParams.text_color || undefined,
  } : {};

  return (
    <div className="min-h-screen bg-background" style={themeStyle}>
      <div className="max-w-md mx-auto px-4 py-6">
        <Header 
          currency={currency} 
          onCurrencyChange={handleCurrencyChange} 
          telegramTheme={webApp?.themeParams}
        />
        
        <main className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Latest Prices
            </h2>
            <p className="text-xs text-muted-foreground">
              Auto-refreshes every minute
            </p>
          </div>
          
          {loading ? (
            // Skeleton loader while data is loading
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="h-32 rounded-2xl bg-secondary/20 animate-pulse-soft"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {cryptoData && cryptoData.length > 0 ? (
                cryptoData.map((crypto, index) => (
                  <CryptoCard 
                    key={crypto.id} 
                    data={crypto} 
                    currency={currency}
                    index={index}
                    telegramTheme={webApp?.themeParams}
                  />
                ))
              ) : (
                <div className="p-4 rounded-lg bg-secondary/20 text-center">
                  <p className="text-sm text-muted-foreground">No cryptocurrency data available</p>
                </div>
              )}
            </div>
          )}
        </main>
        
        <footer className="mt-8 pt-4 text-center text-xs text-muted-foreground">
          <p>Data provided by CoinGecko API</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
