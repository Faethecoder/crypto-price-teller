
import React from 'react';
import { Currency } from '../types/crypto';

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  currency, 
  onCurrencyChange 
}) => {
  return (
    <div className="flex items-center justify-center p-1 bg-background border rounded-full shadow-soft">
      <button
        onClick={() => onCurrencyChange('usd')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
          currency === 'usd'
            ? 'bg-primary text-white shadow-sm'
            : 'text-foreground/70 hover:text-foreground'
        }`}
      >
        USD
      </button>
      <button
        onClick={() => onCurrencyChange('eur')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
          currency === 'eur'
            ? 'bg-primary text-white shadow-sm'
            : 'text-foreground/70 hover:text-foreground'
        }`}
      >
        EUR
      </button>
    </div>
  );
};
