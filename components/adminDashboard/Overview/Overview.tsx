"use client";
import OverviewCard from '@/components/elements/OverviewCard';
import React from 'react';
import { useGetAdminDashboardStatsQuery } from '@/store/api/adminSlice/adminDashboardSlice';
import { Loader2 } from 'lucide-react';
import OverviewPieChart from './OverviewPieChart';
import ProgramPerformanceChart from './ProgramPerformanceChart';

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

const Overview: React.FC = () => {
  const { data, isLoading } = useGetAdminDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const overviewCards: OverviewCardData[] = [
    {
      title: 'Total Users',
      value: data?.total_users || 0,
      description: 'All system users',
      trend: '', // No trend data from API yet
      icon: 'users'
    },
    {
      title: 'Active Programs',
      value: data?.active_programs || 0,
      description: 'Currently running',
      trend: '',
      icon: 'programs'
    },
    {
      title: 'Pending Verifications',
      value: data?.pending_verifications || 0,
      description: 'Agencies, Employers, Trainers',
      trend: '',
      icon: 'verifications'
    },
    {
      title: 'Placement Rate',
      value: `${data?.placement_rate || 0}%`,
      description: 'Hired vs Applications',
      trend: '',
      icon: 'placement'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data?.total_revenue || 0),
      description: 'All earnings',
      trend: '',
      icon: 'revenue'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(data?.monthly_revenue || 0),
      description: 'Last 30 days',
      trend: '',
      icon: 'monthly'
    }
  ];

  // Real data for pie chart
  const pieChartData: PieChartData[] = [
    { name: 'Job Seekers', value: data?.total_job_seekers || 0, color: '#3b82f6' },
    { name: 'Trainees', value: data?.total_enrollments || 0, color: '#a855f7' }, // Using enrollments as proxy for trainees/learners
    { name: 'Trainers', value: data?.total_trainers || 0, color: '#10b981' },
    { name: 'Employers', value: data?.total_employers || 0, color: '#f59e0b' }
  ].filter(item => item.value > 0); // Only show segments with data

  return (
    <div className="w-full bg-gray-50/50 p-4 md:p-6 space-y-6">

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
        {overviewCards.map((card, index) => (
          <OverviewCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pieChartData.length > 0 ? (
          <OverviewPieChart data={pieChartData} />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-gray-500">No user data available to display distribution.</p>
          </div>
        )}

        {/* Program Performance Chart */}
        <div className="hidden lg:block">
          <ProgramPerformanceChart
            data={data?.enrollments_by_category || []}
            totalEnrollments={data?.total_enrollments || 0}
            avgCompletionRate={data?.average_completion_rate || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;