
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: {
    usd: number;
    eur: number;
  };
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
  market_cap: {
    usd: number;
    eur: number;
  };
  last_updated: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    pointRadius: number;
    borderWidth: number;
    fill: boolean;
  }[];
}

export type Currency = 'usd' | 'eur';
