import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SpotlightCard from '../common/SpotlightCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, Monitor, Globe, Loader2, RefreshCw } from 'lucide-react';

const DEVICE_COLORS = ['#4F46E5', '#7C3AED', '#10B981'];

const AnalyticsView = ({ refreshTrigger }) => {
  const [data, setData] = useState({
    totalClicks: 0,
    clicksOverTime: [],
    topReferrers: [],
    deviceDistribution: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/links/analytics');
      if (res.data.success) {
        setData(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <SpotlightCard className="p-8 text-center border-slate-200/80 shadow-corporate-card">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          <span className="text-xs font-mono">Aggregating Click Telemetry...</span>
        </div>
      </SpotlightCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Clicks Tracked
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="font-heading text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {data.totalClicks.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>●</span> Live telemetry logging active
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Top Referring Channel
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Globe className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="font-heading text-xl font-bold text-slate-900 mt-2 tracking-tight truncate">
            {data.topReferrers.length > 0 ? data.topReferrers[0].name : 'None yet'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {data.topReferrers.length > 0 ? `${data.topReferrers[0].count} clicks` : 'No referrer data'}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Primary Device
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Monitor className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="font-heading text-xl font-bold text-slate-900 mt-2 tracking-tight capitalize">
            {data.deviceDistribution.find(d => d.value > 0)?.name || 'Desktop'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Across desktop, mobile & tablet
          </p>
        </SpotlightCard>
      </div>

      {/* Main Chart: Clicks Over Time */}
      <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading text-lg font-bold text-slate-900">Click Traffic Telemetry</h3>
          </div>
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {data.clicksOverTime.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs font-medium">
            No click data recorded yet. Visit your short links to populate telemetry!
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicksCorporate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', shadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#4F46E5' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorClicksCorporate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </SpotlightCard>

      {/* Grid: Top Referrers & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrers Bar Chart */}
        <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            Top Referrers
          </h3>
          {data.topReferrers.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs font-medium">
              No referrer data recorded
            </div>
          ) : (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topReferrers} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={90} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SpotlightCard>

        {/* Device Distribution Pie Chart */}
        <SpotlightCard className="p-6 border-slate-200/80 shadow-corporate-card">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-violet-600" />
            Device Breakdown
          </h3>
          {data.deviceDistribution.every(d => d.value === 0) ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs font-medium">
              No device distribution recorded
            </div>
          ) : (
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.deviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AnalyticsView;
