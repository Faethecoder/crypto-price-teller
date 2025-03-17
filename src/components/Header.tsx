
import React from 'react';
import { ChartLine } from 'lucide-react';
import { CurrencyToggle } from './CurrencyToggle';
import { Currency } from '../types/crypto';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({ currency, onCurrencyChange }) => {
  return (
    <header className="w-full px-4 py-4 flex items-center justify-between animate-slide-down">
      <div className="flex items-center space-x-2">
        <ChartLine className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-primary">Crypto</span>
          <span>Track</span>
        </h1>
      </div>
      
      <CurrencyToggle 
        currency={currency} 
        onCurrencyChange={onCurrencyChange} 
      />
    </header>
  );
};
