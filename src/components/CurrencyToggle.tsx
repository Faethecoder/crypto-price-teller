
import React from 'react';
import { Currency } from '../types/crypto';

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  telegramTheme?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  currency, 
  onCurrencyChange,
  telegramTheme 
}) => {
  const activeButtonStyle = telegramTheme ? {
    backgroundColor: telegramTheme.button_color || undefined,
    color: telegramTheme.button_text_color || '#fff'
  } : {};

  const inactiveButtonStyle = telegramTheme ? {
    color: telegramTheme.hint_color || undefined
  } : {};

  return (
    <div className="flex items-center justify-center p-1 bg-background border rounded-full shadow-soft">
      <button
        onClick={() => onCurrencyChange('usd')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
          currency === 'usd'
            ? 'bg-primary text-white shadow-sm'
            : 'text-foreground/70 hover:text-foreground'
        }`}
        style={currency === 'usd' ? activeButtonStyle : inactiveButtonStyle}
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
        style={currency === 'eur' ? activeButtonStyle : inactiveButtonStyle}
      >
        EUR
      </button>
    </div>
  );
};
