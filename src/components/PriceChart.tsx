
import React, { useEffect, useRef, useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PriceChartProps {
  data: CryptoData;
  currency: Currency;
}

type TimeRange = '1W' | '1M' | '1Y';

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
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }

  return null;
};

export const PriceChart: React.FC<PriceChartProps> = ({ data, currency }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');
  
  const prices = data.sparkline_in_7d?.price || [];
  const color = getCryptoColor(data.id);
  
  // Prepare chart data based on selected time range
  const getChartData = () => {
    if (!prices.length) return [];
    
    let filteredPrices: number[] = [];
    let labels: string[] = [];
    
    const currentDate = new Date();
    
    switch (timeRange) {
      case '1W':
        // Use last 7 days (24 data points)
        filteredPrices = prices.slice(-24);
        
        // Generate day labels for the week view
        labels = Array.from({length: filteredPrices.length}, (_, i) => {
          const day = new Date(currentDate);
          day.setHours(currentDate.getHours() - (filteredPrices.length - i - 1));
          return day.getHours() === 0 ? 'Midnight' : `${day.getHours()}:00`;
        });
        break;
        
      case '1M':
        // Simulate 1 month data (30 data points)
        filteredPrices = prices.length >= 30 ? prices.slice(-30) : prices;
        
        // Generate week labels for the month view
        labels = Array.from({length: filteredPrices.length}, (_, i) => {
          const day = new Date(currentDate);
          day.setDate(currentDate.getDate() - (filteredPrices.length - i - 1));
          return `${day.getDate()}/${day.getMonth() + 1}`;
        });
        break;
        
      case '1Y':
        // Simulate 1 year data (use all available data points)
        filteredPrices = prices;
        
        // Generate month labels for the year view
        labels = Array.from({length: filteredPrices.length}, (_, i) => {
          const day = new Date(currentDate);
          day.setDate(currentDate.getDate() - (filteredPrices.length - i - 1));
          
          // Show month name if it's the 1st day of the month or first data point
          const isFirstDay = day.getDate() === 1;
          const isFirstPoint = i === 0;
          
          if (isFirstDay || isFirstPoint || i % 5 === 0) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[day.getMonth()];
          }
          
          return '';
        });
        break;
    }
    
    return filteredPrices.map((price, index) => ({
      time: labels[index],
      price
    }));
  };
  
  const chartData = getChartData();
  
  // Calculate min and max for chart boundaries with fallbacks
  const filteredPrices = chartData.map(item => item.price);
  const minPrice = filteredPrices.length ? Math.min(...filteredPrices) * 0.995 : 0;
  const maxPrice = filteredPrices.length ? Math.max(...filteredPrices) * 1.005 : 0;
  const currentPrice = data.current_price[currency];
    
  useEffect(() => {
    // Animation for chart on mount
    if (chartRef.current) {
      chartRef.current.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <div className="space-y-2">
      <Tabs 
        defaultValue="1W" 
        value={timeRange} 
        onValueChange={(value) => setTimeRange(value as TimeRange)}
        className="w-full justify-center"
      >
        <TabsList className="grid grid-cols-3 h-8 w-full max-w-[200px] mx-auto bg-background/10">
          <TabsTrigger value="1W" className="text-xs">Week</TabsTrigger>
          <TabsTrigger value="1M" className="text-xs">Month</TabsTrigger>
          <TabsTrigger value="1Y" className="text-xs">Year</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div 
        ref={chartRef} 
        className="w-full h-32 chart-container" 
        style={{ opacity: 0 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value || ''}
              interval="preserveStartEnd"
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
    </div>
  );
};
