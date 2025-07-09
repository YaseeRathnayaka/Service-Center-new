"use client"
import { FaDollarSign, FaChartLine, FaUsers, FaCarSide, FaFileInvoiceDollar, FaMoneyBillWave, FaUserTie } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { useState } from 'react';

// KPI row
const kpis = [
  { label: 'Sales (MTD)', value: '$18,200', icon: <FaDollarSign className="text-accent-500" /> },
  { label: 'Revenue (YTD)', value: '$320,500', icon: <FaChartLine className="text-primary-500" /> },
  { label: 'Profit', value: '$48,200', icon: <FaMoneyBillWave className="text-teal-500" /> },
  { label: 'Outstanding Invoices', value: '$12,800', icon: <FaFileInvoiceDollar className="text-primary-400" /> },
  { label: 'Employees', value: 24, icon: <FaUserTie className="text-primary-600" /> },
  { label: 'Active Vehicles', value: 56, icon: <FaCarSide className="text-accent-600" /> },
];

// Sales/Finance trend (area)
const salesFinanceTrend = [
  { month: 'Jan', sales: 12000, revenue: 18000 },
  { month: 'Feb', sales: 14500, revenue: 21000 },
  { month: 'Mar', sales: 17000, revenue: 25000 },
  { month: 'Apr', sales: 15500, revenue: 23000 },
  { month: 'May', sales: 21000, revenue: 32000 },
  { month: 'Jun', sales: 18500, revenue: 27000 },
  { month: 'Jul', sales: 22000, revenue: 35000 },
];

// Employee management (bar)
const employeeMgmt = [
  { role: 'Mechanic', count: 8 },
  { role: 'Advisor', count: 5 },
  { role: 'Technician', count: 7 },
  { role: 'Cleaner', count: 4 },
];

// Vehicle management (bar)
const vehicleMgmt = [
  { type: 'Sedan', count: 18 },
  { type: 'SUV', count: 14 },
  { type: 'Truck', count: 9 },
  { type: 'Other', count: 15 },
];

// Recent activity table
const recentActivity = [
  { type: 'Sale', desc: 'Invoice #1234', amount: '$1,200', date: '2024-07-01', status: 'Paid' },
  { type: 'Service', desc: 'Oil Change - Camry', amount: '$80', date: '2024-07-02', status: 'Completed' },
  { type: 'Employee', desc: 'Anna promoted to Advisor', amount: '-', date: '2024-07-03', status: 'HR' },
  { type: 'Vehicle', desc: 'New BMW X3 added', amount: '-', date: '2024-07-03', status: 'Fleet' },
  { type: 'Sale', desc: 'Invoice #1235', amount: '$2,500', date: '2024-07-04', status: 'Pending' },
];

// Heatmap data for vehicle bottlenecks
const heatmapData = [
  { area: 'Washing', stuck: 8 },
  { area: 'Vacuum', stuck: 5 },
  { area: 'Oil Change', stuck: 11 },
  { area: 'Inspection', stuck: 3 },
  { area: 'Tire', stuck: 7 },
  { area: 'Alignment', stuck: 2 },
  { area: 'AC Service', stuck: 4 },
];

const COLORS = ['#ae3ec9', '#7c4dff', '#14b8a6', '#be4bdb'];

export default function DashboardPage() {
  const [barHover, setBarHover] = useState(-1);
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-background">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map(m => (
            <div key={m.label} className="bg-white rounded-xl shadow-soft p-3 flex flex-col items-center gap-1 min-w-[110px]">
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-base font-bold text-primary-700">{m.value}</div>
              <div className="text-slate-500 text-[11px] tracking-wide uppercase">{m.label}</div>
            </div>
          ))}
        </div>
        {/* Trend and Management Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Sales/Finance Trend */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="font-semibold text-primary-700 mb-2">Sales & Revenue Trend</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={salesFinanceTrend} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#7c4dff" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ae3ec9" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#ae3ec9" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a21caf" fontSize={12} />
                <YAxis stroke="#a21caf" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#7c4dff" fill="url(#sales)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="#ae3ec9" fill="url(#revenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Employee Management Bar */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="font-semibold text-primary-700 mb-2">Employee Management</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={employeeMgmt} margin={{ left: -20, right: 10 }}>
                <XAxis dataKey="role" stroke="#a21caf" fontSize={12} />
                <YAxis stroke="#a21caf" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} onMouseOver={(_, idx) => setBarHover(idx)} onMouseOut={() => setBarHover(-1)}>
                  {employeeMgmt.map((entry, idx) => (
                    <Cell key={entry.role} fill={barHover === idx ? '#ae3ec9' : '#7c4dff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Vehicle Management Bar */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="font-semibold text-primary-700 mb-2">Vehicle Management</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={vehicleMgmt} margin={{ left: -20, right: 10 }}>
                <XAxis dataKey="type" stroke="#a21caf" fontSize={12} />
                <YAxis stroke="#a21caf" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} onMouseOver={(_, idx) => setBarHover(idx + 10)} onMouseOut={() => setBarHover(-1)}>
                  {vehicleMgmt.map((entry, idx) => (
                    <Cell key={entry.type} fill={barHover === idx + 10 ? '#ae3ec9' : '#14b8a6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Heatmap for Vehicle Bottlenecks */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="font-semibold text-primary-700 mb-2">Vehicle Bottleneck Heatmap</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {heatmapData.map((item, idx) => (
              <div key={item.area} className="flex flex-col items-center justify-center p-4 rounded-lg" style={{ background: `rgba(174,62,201,${0.08 + 0.08 * item.stuck})` }}>
                <div className="text-[13px] font-semibold text-primary-700 mb-1">{item.area}</div>
                <div className="text-2xl font-bold text-accent-700">{item.stuck}</div>
                <div className="text-xs text-slate-500">vehicles stuck</div>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Activity Table */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="font-semibold text-primary-700 mb-2">Recent Activity</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-2 px-3 text-left">Type</th>
                  <th className="py-2 px-3 text-left">Description</th>
                  <th className="py-2 px-3 text-left">Amount</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((a, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-2 px-3 font-medium text-slate-700">{a.type}</td>
                    <td className="py-2 px-3">{a.desc}</td>
                    <td className="py-2 px-3">{a.amount}</td>
                    <td className="py-2 px-3">{a.date}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${a.status === 'Paid' || a.status === 'Completed' ? 'bg-teal-100 text-teal-700' : a.status === 'Pending' ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-700'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 