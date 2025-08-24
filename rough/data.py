import pandas as pd
import json

# Load your CSVs
msft = pd.read_csv("MSFT_10y.csv")
sp500 = pd.read_csv("SP500_10y.csv")

# Ensure sorted by date
msft['date'] = pd.to_datetime(msft['date'])
sp500['date'] = pd.to_datetime(sp500['date'])

msft = msft.sort_values('date')
sp500 = sp500.sort_values('date')

# Round to 2 decimals
msft = msft.round(2)
sp500 = sp500.round(2)

# Convert MSFT candles
time_series = [
    {
        "date": row['date'].strftime("%Y-%m-%d"),
        "open": float(row['open']),
        "high": float(row['high']),
        "low": float(row['low']),
        "close": float(row['close']),
        "volume": int(row['volume'])
    }
    for _, row in msft.iterrows()
]

# Convert SP500 (only close → value)
sp500_series = [
    {
        "date": row['date'].strftime("%Y-%m-%d"),
        "value": float(row['close'])
    }
    for _, row in sp500.iterrows()
]

# Final JSON
final_json = {
    "time_series": time_series,
    "sp500_series": sp500_series
}

# Save to file
with open("stock_and_sp500.json", "w") as f:
    json.dump(final_json, f)

print("✅ Saved stock_and_sp500.json")
