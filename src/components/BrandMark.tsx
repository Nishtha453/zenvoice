import React from 'react';
import { FileText } from 'lucide-react';

interface BrandMarkProps {
  subtitle?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm">
      <FileText size={24} className="text-white" />
    </div>
    <div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Zenvoice
      </h1>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);
