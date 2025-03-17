
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { CryptoData, Currency } from '../types/crypto';
import { formatPrice, formatPercentage, getCryptoColor } from '../services/cryptoService';
import { PriceChart } from './PriceChart';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CryptoCardProps {
  data: CryptoData;
  currency: Currency;
  index: number;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ data, currency, index }) => {
  const [isChartOpen, setIsChartOpen] = useState(false);
  
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
  
  return (
    <div 
      className={`glass-card rounded-2xl p-4 shadow-glass transition-all duration-300 animate-fade-in`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between mb-2">
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
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground uppercase">{symbol}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className="font-semibold">{formatPrice(price, currency)}</p>
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
      
      <Collapsible 
        open={isChartOpen} 
        onOpenChange={setIsChartOpen}
        className="mt-2"
      >
        <CollapsibleTrigger className="w-full flex items-center justify-center text-xs text-muted-foreground py-1 hover:text-foreground transition-colors">
          <span className="mr-1">
            {isChartOpen ? 'Hide Chart' : 'Show Chart'}
          </span>
          {isChartOpen ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="pt-2">
            <PriceChart data={data} currency={currency} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
