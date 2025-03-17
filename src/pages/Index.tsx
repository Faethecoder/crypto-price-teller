
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/Header';
import { CryptoCard } from '@/components/CryptoCard';
import { fetchCryptoData } from '@/services/cryptoService';
import { CryptoData, Currency } from '@/types/crypto';

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('usd');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const { toast } = useToast();

  const loadCryptoData = async () => {
    try {
      const data = await fetchCryptoData();
      setCryptoData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      toast({
        title: "Error loading data",
        description: "Could not fetch cryptocurrency prices. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
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

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <Header 
          currency={currency} 
          onCurrencyChange={handleCurrencyChange} 
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
