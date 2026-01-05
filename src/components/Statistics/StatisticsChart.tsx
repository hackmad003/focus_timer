/**
 * Statistics Chart Component
 * Displays focus time chart using recharts
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStatisticsStore } from '@/store/useStatisticsStore';
import { formatDuration, getCurrentDate } from '@/utils/time';
import { format, subDays } from 'date-fns';
import { CHART_COLORS } from '@/utils/constants';

export const StatisticsChart: React.FC = () => {
  const statistics = useStatisticsStore();

  // Get last 7 days of data
  const today = new Date();
  const chartData = Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(today, 6 - index);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayStats = statistics.dailyStats[dateKey];

    return {
      date: format(date, 'EEE'),
      fullDate: format(date, 'MMM dd'),
      focusTime: dayStats ? dayStats.totalFocusTime / 60 : 0, // Convert to minutes
      sessions: dayStats ? dayStats.focusSessions : 0,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: 'var(--color-surface-elevated)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
            {data.fullDate}
          </p>
          <p style={{ color: 'var(--color-primary)' }}>
            {Math.round(data.focusTime)} minutes
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
            {data.sessions} sessions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />
        <XAxis dataKey="date" stroke={CHART_COLORS.GRID} />
        <YAxis stroke={CHART_COLORS.GRID} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="focusTime" fill={CHART_COLORS.PRIMARY} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
