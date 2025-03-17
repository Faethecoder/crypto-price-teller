
import React, { useEffect, useRef } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CryptoData, Currency } from '../types/crypto';
import { formatPrice, getCryptoColor } from '../services/cryptoService';

interface PriceChartProps {
  data: CryptoData;
  currency: Currency;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency: Currency;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-2 text-xs shadow-soft">
        <p className="font-medium">{formatPrice(payload[0].value, currency)}</p>
      </div>
    );
  }

  return null;
};

export const PriceChart: React.FC<PriceChartProps> = ({ data, currency }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const prices = data.sparkline_in_7d?.price || [];
  const color = getCryptoColor(data.id);
  
  // Prepare chart data (last 24 hours from sparkline data)
  const hourlyData = prices
    .slice(-24)
    .map((price, index) => ({
      time: `${24 - index}h`,
      price
    }));
  
  // Calculate min and max for chart boundaries with fallbacks
  const minPrice = prices.length ? Math.min(...prices) * 0.995 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.005 : 0;
  const currentPrice = data.current_price[currency];
    
  useEffect(() => {
    // Animation for chart on mount
    if (chartRef.current) {
      chartRef.current.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-32 mt-2 chart-container" 
      style={{ opacity: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={hourlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[minPrice || 0, maxPrice || 100]} 
            hide 
          />
          <Tooltip 
            content={<ChartTooltip currency={currency} />} 
            cursor={false} 
          />
          {currentPrice && (
            <ReferenceLine 
              y={currentPrice} 
              stroke={color} 
              strokeDasharray="3 3" 
              strokeOpacity={0.4} 
            />
          )}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
