import React, { useState, useMemo, memo, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Routine } from '../types/index';
import { formatDate } from '../utils/dateUtils';

interface RoutineAnalyticsProps {
  routine: Routine;
}

type TimeFrame = 'weekly' | 'monthly' | 'yearly' | 'streak';

export const RoutineAnalytics: React.FC<RoutineAnalyticsProps> = memo(({ routine }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');

  const handleTimeFrameChange = useCallback((frame: TimeFrame) => {
    setTimeFrame(frame);
  }, []);

  // Weekly data
  const weeklyData = useMemo(() => {
    const data = [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = formatDate(date);
      const isCompleted = routine.completedDates.includes(dateStr);
      
      data.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        completed: isCompleted ? 1 : 0,
        date: dateStr,
      });
    }
    return data;
  }, [routine.completedDates]);

  // Monthly data (last 30 days)
  const monthlyData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = formatDate(date);
      const isCompleted = routine.completedDates.includes(dateStr);
      
      data.push({
        date: date.getDate(),
        completed: isCompleted ? 1 : 0,
        fullDate: dateStr,
      });
    }
    return data;
  }, [routine.completedDates]);

  // Yearly data (last 12 months)
  const yearlyData = useMemo(() => {
    const data = [];
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = months[date.getMonth()];
      
      // Count completions for this month
      const monthCompletions = routine.completedDates.filter(dateStr => {
        const completionDate = new Date(dateStr);
        return completionDate.getMonth() === date.getMonth() && 
               completionDate.getFullYear() === date.getFullYear();
      }).length;
      
      data.push({
        month: monthStr,
        completed: monthCompletions,
      });
    }
    return data.reverse();
  }, [routine.completedDates]);

  // Dynamic completion rate data for pie chart based on timeframe
  const completionRateData = useMemo(() => {
    let completed = 0;
    let total = 0;
    let title = '';

    switch (timeFrame) {
      case 'weekly':
        completed = weeklyData.filter(d => d.completed === 1).length;
        total = 7;
        title = 'This Week';
        break;
      case 'monthly':
        completed = monthlyData.filter(d => d.completed === 1).length;
        total = 30;
        title = 'This Month';
        break;
      case 'yearly':
        completed = yearlyData.reduce((sum, d) => sum + d.completed, 0);
        total = 365;
        title = 'This Year';
        break;
      case 'streak':
        // Calculate streak data directly without depending on streakData
        const streakCompleted = [];
        const now = new Date();
        for (let i = 0; i < 14; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          const dateStr = formatDate(date);
          const isCompleted = routine.completedDates.includes(dateStr);
          streakCompleted.push(isCompleted);
        }
        completed = streakCompleted.filter(d => d).length;
        total = 14; // Last 14 days for streak view
        title = 'Last 14 Days';
        break;
      default:
        completed = 0;
        total = 1;
        title = '';
    }

    const missed = Math.max(0, total - completed);
    
    return {
      data: [
        { name: 'Completed', value: completed, color: routine.color },
        { name: 'Missed', value: missed, color: '#6B7280' },
      ],
      title,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [timeFrame, weeklyData, monthlyData, yearlyData, routine.completedDates, routine.color]);

  // Streak data for streak chart
  const streakData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    // Calculate current streak
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = formatDate(date);
      const isCompleted = routine.completedDates.includes(dateStr);
      
      if (isCompleted) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
      
      data.push({
        day: i + 1,
        completed: isCompleted ? 1 : 0,
        streak: tempStreak,
      });
    }
    
    return { data, currentStreak, maxStreak };
  }, [routine.completedDates]);

  // Weekly completion percentage
  const weeklyStats = useMemo(() => {
    const completedThisWeek = weeklyData.filter(d => d.completed === 1).length;
    const percentage = Math.round((completedThisWeek / 7) * 100);
    return { completed: completedThisWeek, total: 7, percentage };
  }, [weeklyData]);

  const renderChart = () => {
    switch (timeFrame) {
      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                fontSize={12}
                domain={[0, 1]}
                ticks={[0, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value: number) => [value === 1 ? 'Completed' : 'Not completed', 'Status']}
              />
              <Bar 
                dataKey="completed" 
                fill={routine.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-secondary)"
                fontSize={12}
                interval={6}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                fontSize={12}
                domain={[0, 1]}
                ticks={[0, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value: number) => [value === 1 ? 'Completed' : 'Not completed', 'Status']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke={routine.color}
                strokeWidth={3}
                dot={{ fill: routine.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: routine.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'yearly':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value: number) => [value, 'Completions']}
              />
              <Bar 
                dataKey="completed" 
                fill={routine.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

              case 'streak':
          return (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={streakData.data.slice(0, 14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  reversed={true}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  domain={[0, 1]}
                  ticks={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value: number) => [value === 1 ? 'Completed' : 'Not completed', 'Status']}
                  labelFormatter={(label) => `${label} days ago`}
                />
                <Bar 
                  dataKey="completed" 
                  fill={routine.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          );

        default:
          return null;
      }
    };

  return (
    <div className="floating-card mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold drop-shadow-md" style={{ color: 'var(--text-primary)' }}>
          Analytics
        </h3>
        <div className="flex space-x-1">
          {(['weekly', 'monthly', 'yearly', 'streak'] as TimeFrame[]).map((frame) => (
            <button
              key={frame}
              onClick={() => handleTimeFrameChange(frame)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                timeFrame === frame
                  ? 'text-white shadow-lg'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: timeFrame === frame ? routine.color : 'var(--bg-secondary)',
                color: timeFrame === frame ? 'white' : 'var(--text-secondary)',
              }}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Small Stats Row */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: routine.color }}>
            {weeklyStats.percentage}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            This Week
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: routine.color }}>
            {routine.completedDates.length}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Total Days
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        {renderChart()}
      </div>

      {/* Dynamic Completion Rate Pie Chart */}
      <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
        <h4 className="text-sm font-semibold mb-3 drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
          {completionRateData.title} ({completionRateData.percentage}%)
        </h4>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={completionRateData.data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {completionRateData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              formatter={(value: number) => [value, 'Days']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-2">
          {completionRateData.data.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});