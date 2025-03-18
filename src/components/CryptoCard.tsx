
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CryptoData, Currency } from '../types/crypto';
import { formatPrice, formatPercentage, getCryptoColor } from '../services/cryptoService';

interface CryptoCardProps {
  data: CryptoData;
  currency: Currency;
  index: number;
  telegramTheme?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ data, currency, index, telegramTheme }) => {
  const { 
    name, 
    symbol, 
    current_price, 
    price_change_percentage_24h, 
    image 
  } = data;
  
  const price = current_price[currency];
  const isPositive = price_change_percentage_24h >= 0;
  const cryptoColor = getCryptoColor(data.id);
  
  // Apply Telegram theme styles if available
  const cardStyle = telegramTheme ? {
    backgroundColor: telegramTheme.bg_color ? `${telegramTheme.bg_color}80` : undefined,
    borderColor: telegramTheme.hint_color ? `${telegramTheme.hint_color}20` : undefined,
  } : {};
  
  const textStyle = telegramTheme ? {
    color: telegramTheme.text_color || undefined
  } : {};
  
  const secondaryTextStyle = telegramTheme ? {
    color: telegramTheme.hint_color || undefined
  } : {};

  return (
    <div 
      className={`glass-card rounded-2xl p-4 shadow-glass transition-all duration-300 animate-fade-in`}
      style={{ 
        ...cardStyle,
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="crypto-icon" 
            style={{ backgroundColor: `${cryptoColor}20` }}
          >
            <img 
              src={image} 
              alt={name} 
              className="w-6 h-6"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-medium" style={textStyle}>{name}</h3>
            <p className="text-xs text-muted-foreground uppercase" style={secondaryTextStyle}>{symbol}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className="font-semibold" style={textStyle}>{formatPrice(price, currency)}</p>
          <div className={`flex items-center text-xs ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            <span>{formatPercentage(price_change_percentage_24h)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
