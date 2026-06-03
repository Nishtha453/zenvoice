import React from 'react';

interface CurrencySelectorProps {
  selectedCurrency: 'INR' | 'USD' | 'EUR' | 'GBP';
  onCurrencyChange: (currency: 'INR' | 'USD' | 'EUR' | 'GBP') => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange
}) => {
  const currencies = [
    { code: 'INR' as const, name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD' as const, name: 'US Dollar', symbol: '$' },
    { code: 'EUR' as const, name: 'Euro', symbol: '€' },
    { code: 'GBP' as const, name: 'British Pound', symbol: '£' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Currency
      </label>
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value as 'INR' | 'USD' | 'EUR' | 'GBP')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    </div>
  );
};
