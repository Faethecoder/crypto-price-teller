
import { CryptoData, Currency } from '../types/crypto';

// List of cryptocurrencies to track
const CRYPTO_IDS = [
  'bitcoin', 
  'ethereum', 
  'cardano', 
  'solana', 
  'polkadot'
];

// CoinGecko API base URL
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch cryptocurrency data from CoinGecko API
 */
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get EUR prices in a separate request
    const eurResponse = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=eur&ids=${CRYPTO_IDS.join(',')}&order=market_cap_desc&sparkline=false`
    );
    
    if (!eurResponse.ok) {
      throw new Error(`EUR API request failed with status ${eurResponse.status}`);
    }
    
    const eurData = await eurResponse.json();
    
    // Combine USD and EUR data
    return data.map((coin: any, index: number) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: {
        usd: coin.current_price,
        eur: eurData[index].current_price
      },
      market_cap: {
        usd: coin.market_cap,
        eur: eurData[index].market_cap
      },
      price_change_percentage_24h: coin.price_change_percentage_24h,
      image: coin.image,
      sparkline_in_7d: {
        price: coin.sparkline_in_7d?.price || []
      },
      last_updated: coin.last_updated
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

/**
 * Format price with appropriate currency symbol
 */
export const formatPrice = (price: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatLargeNumber = (num: number, currency: Currency): string => {
  const symbol = currency === 'usd' ? '$' : '€';
  
  if (num >= 1e9) {
    return `${symbol}${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${symbol}${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${symbol}${(num / 1e3).toFixed(2)}K`;
  }
  
  return `${symbol}${num.toFixed(2)}`;
};

/**
 * Get color for specific cryptocurrency
 */
export const getCryptoColor = (id: string): string => {
  const colors: Record<string, string> = {
    'bitcoin': '#F7931A',
    'ethereum': '#627EEA',
    'cardano': '#0033AD',
    'solana': '#00FFA3',
    'polkadot': '#E6007A',
    'default': '#7E7E7E'
  };
  
  return colors[id] || colors.default;
};

/**
 * Format percentage change with + or - sign
 */
export const formatPercentage = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};
