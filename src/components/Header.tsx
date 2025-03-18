
import React from 'react';
import { ChartLine } from 'lucide-react';
import { CurrencyToggle } from './CurrencyToggle';
import { Currency } from '../types/crypto';

interface HeaderProps {
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

export const Header: React.FC<HeaderProps> = ({ currency, onCurrencyChange, telegramTheme }) => {
  const titleStyle = telegramTheme ? {
    color: telegramTheme.text_color || 'inherit'
  } : {};

  const iconStyle = telegramTheme ? {
    color: telegramTheme.link_color || 'inherit'
  } : {};

  return (
    <header className="w-full px-4 py-4 flex items-center justify-between animate-slide-down">
      <div className="flex items-center space-x-2">
        <ChartLine className="w-6 h-6 text-primary" style={iconStyle} />
        <h1 className="text-lg font-semibold tracking-tight" style={titleStyle}>
          <span className="text-primary" style={iconStyle}>Crypto</span>
          <span className="text-foreground/90">Track</span>
        </h1>
      </div>
      
      <CurrencyToggle 
        currency={currency} 
        onCurrencyChange={onCurrencyChange} 
        telegramTheme={telegramTheme}
      />
    </header>
  );
};
