import OverviewCard from '@/components/elements/OverviewCard';
import React from 'react';
import OverviewPieChart from './OverviewPieChart';
import OverviewBarChart from './OverviewBarChart';

// Types
interface OverviewCardData {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  icon: 'users' | 'programs' | 'verifications' | 'placement' | 'revenue' | 'monthly';
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartData {
  name: string;
  value: number;
}

const Overview: React.FC = () => {
  // Dummy data for overview cards
  const overviewCards: OverviewCardData[] = [
    {
      title: 'Total Users',
      value: '12,874',
      description: 'All user types',
      trend: '+12.5% from last month',
      icon: 'users'
    },
    {
      title: 'Active Programs',
      value: '48',
      description: 'Currently running',
      trend: '+15% from last month',
      icon: 'programs'
    },
    {
      title: 'Pending Verifications',
      value: '48',
      description: 'Currently running',
      trend: '+15% from last month',
      icon: 'verifications'
    },
    {
      title: 'Placement rate',
      value: '84%',
      description: 'Last 30 days',
      trend: '+15% from last month',
      icon: 'placement'
    },
    {
      title: 'Total Revenue',
      value: '$12,874',
      description: 'All earnings',
      trend: '+12.5% from last month',
      icon: 'revenue'
    },
    {
      title: 'Monthly Revenue',
      value: '$1,874',
      description: 'All earnings',
      trend: '+12.5% from last month',
      icon: 'monthly'
    }
  ];

  // Dummy data for pie chart
  const pieChartData: PieChartData[] = [
    { name: 'Trainees', value: 6420, color: '#a855f7' },
    { name: 'Job Seekers', value: 3850, color: '#3b82f6' },
    { name: 'Trainers', value: 1420, color: '#10b981' },
    { name: 'Employers', value: 650, color: '#f59e0b' }
  ];

  // Dummy data for bar chart
  const barChartData: BarChartData[] = [
  { name: 'Web', value: 450 },
  { name: 'IT', value: 300 },
  { name: 'Health', value: 280 },
  { name: 'Flutter', value: 150 },
  { name: 'Marketing', value: 200 },
  { name: 'Spoken', value: 380 },
  { name: 'Design', value: 250 },
  { name: 'Business', value: 180 }
];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {overviewCards.slice().map((card, index) => (
            <OverviewCard key={index} {...card} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <OverviewPieChart data={pieChartData} />
          <OverviewBarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Overview;