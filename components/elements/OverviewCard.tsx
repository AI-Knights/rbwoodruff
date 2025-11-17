import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Clock, TrendingUp, DollarSign, Wallet } from 'lucide-react';

// Types
export interface OverviewCardData {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  icon: 'users' | 'programs' | 'verifications' | 'placement' | 'revenue' | 'monthly';
}

// OverviewCard Component
const OverviewCard: React.FC<OverviewCardData> = ({ title, value, description, trend, icon }) => {
  const getIcon = () => {
    const iconProps = { className: "h-5 w-5 text-white" };
    switch (icon) {
      case 'users':
        return <Users {...iconProps} />;
      case 'programs':
        return <BookOpen {...iconProps} />;
      case 'verifications':
        return <Clock {...iconProps} />;
      case 'placement':
        return <TrendingUp {...iconProps} />;
      case 'revenue':
        return <DollarSign {...iconProps} />;
      case 'monthly':
        return <Wallet {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const getIconBgColor = () => {
    switch (icon) {
      case 'users':
        return 'bg-blue-500';
      case 'programs':
        return 'bg-green-500';
      case 'verifications':
        return 'bg-green-600';
      case 'placement':
        return 'bg-green-500';
      case 'revenue':
        return 'bg-blue-400';
      case 'monthly':
        return 'bg-green-600';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className="text-2xl md:text-3xl font-bold mt-2">{value}</div>
          <CardDescription className="text-xs mt-1">{description}</CardDescription>
          <p className="text-xs text-gray-500 mt-1">{trend}</p>
        </div>
        <div className={`${getIconBgColor()} rounded-lg p-3`}>
          {getIcon()}
        </div>
      </CardHeader>
    </Card>
  );
};

export default OverviewCard;