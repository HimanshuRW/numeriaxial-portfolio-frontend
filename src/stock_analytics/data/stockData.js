// Stock data helper functions and mappings
export const STOCK_NAMES = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'NVDA': 'NVIDIA Corporation',
  'META': 'Meta Platforms Inc.',
  'NFLX': 'Netflix Inc.',
  'BRK.B': 'Berkshire Hathaway Inc.',
  'JPM': 'JPMorgan Chase & Co.',
  'V': 'Visa Inc.',
  'JNJ': 'Johnson & Johnson',
  'WMT': 'Walmart Inc.',
  'PG': 'Procter & Gamble Co.',
  'UNH': 'UnitedHealth Group Inc.',
  'HD': 'Home Depot Inc.',
  'MA': 'Mastercard Inc.',
  'DIS': 'Walt Disney Co.',
  'PYPL': 'PayPal Holdings Inc.',
  'BAC': 'Bank of America Corp.',
  'ADBE': 'Adobe Inc.',
  'CMCSA': 'Comcast Corporation',
  'KO': 'Coca-Cola Co.',
  'XOM': 'Exxon Mobil Corporation',
  'PFE': 'Pfizer Inc.',
  'VZ': 'Verizon Communications Inc.',
  'INTC': 'Intel Corporation',
  'CRM': 'Salesforce Inc.',
  'ABT': 'Abbott Laboratories',
  'ORCL': 'Oracle Corporation',
  'ACN': 'Accenture plc',
  'CVX': 'Chevron Corporation',
  'NKE': 'Nike Inc.',
  'MRK': 'Merck & Co. Inc.',
  'COST': 'Costco Wholesale Corporation',
  'DHR': 'Danaher Corporation',
  'TMO': 'Thermo Fisher Scientific Inc.',
  'PEP': 'PepsiCo Inc.',
  'AVGO': 'Broadcom Inc.',
  'AMD': 'Advanced Micro Devices Inc.',
  'QCOM': 'QUALCOMM Incorporated'
};

export const SECTOR_MAPPINGS = {
  'AAPL': 'Technology',
  'MSFT': 'Technology',
  'GOOGL': 'Technology',
  'AMZN': 'Consumer Discretionary',
  'TSLA': 'Consumer Discretionary',
  'NVDA': 'Technology',
  'META': 'Technology',
  'NFLX': 'Communication Services',
  'JPM': 'Financials',
  'V': 'Financials',
  'JNJ': 'Healthcare',
  'WMT': 'Consumer Staples',
  'PG': 'Consumer Staples',
  'UNH': 'Healthcare',
  'HD': 'Consumer Discretionary',
  'MA': 'Financials',
  'DIS': 'Communication Services',
  'PYPL': 'Financials',
  'BAC': 'Financials',
  'ADBE': 'Technology',
  'INTC': 'Technology',
  'CRM': 'Technology',
  'ORCL': 'Technology',
  'NVDA': 'Technology',
  'AMD': 'Technology',
  'QCOM': 'Technology'
};

export const getStockName = (ticker) => {
  return STOCK_NAMES[ticker] || `${ticker} Corporation`;
};

export const getStockSector = (ticker) => {
  return SECTOR_MAPPINGS[ticker] || 'Technology';
};