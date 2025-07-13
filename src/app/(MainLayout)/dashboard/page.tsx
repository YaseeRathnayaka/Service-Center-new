"use client"
import { FaDollarSign, FaChartLine, FaCarSide, FaFileInvoiceDollar, FaMoneyBillWave, FaUserTie, FaArrowUp, FaUsers, FaCalendarAlt, FaClock, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { useState, useEffect } from 'react';
import { getAppointments, Appointment } from '../../../lib/api/appointments';

// KPI data with enhanced metrics
const kpis = [
  { 
    label: 'Total Revenue', 
    value: '$320,500', 
    change: '+12.5%',
    trend: 'up',
    icon: <FaDollarSign className="text-2xl" />,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    label: 'Monthly Sales', 
    value: '$18,200', 
    change: '+8.2%',
    trend: 'up',
    icon: <FaChartLine className="text-2xl" />,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    label: 'Net Profit', 
    value: '$48,200', 
    change: '+15.3%',
    trend: 'up',
    icon: <FaMoneyBillWave className="text-2xl" />,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    label: 'Pending Invoices', 
    value: '$12,800', 
    change: '-3.1%',
    trend: 'down',
    icon: <FaFileInvoiceDollar className="text-2xl" />,
    color: 'from-orange-500 to-red-600'
  },
  { 
    label: 'Active Employees', 
    value: '24', 
    change: '+2',
    trend: 'up',
    icon: <FaUserTie className="text-2xl" />,
    color: 'from-purple-500 to-pink-600'
  },
  { 
    label: 'Fleet Vehicles', 
    value: '56', 
    change: '+5',
    trend: 'up',
    icon: <FaCarSide className="text-2xl" />,
    color: 'from-cyan-500 to-blue-600'
  },
];

// Enhanced sales trend data
const salesTrend = [
  { month: 'Jan', sales: 12000, revenue: 18000, profit: 5400 },
  { month: 'Feb', sales: 14500, revenue: 21000, profit: 6300 },
  { month: 'Mar', sales: 17000, revenue: 25000, profit: 7500 },
  { month: 'Apr', sales: 15500, revenue: 23000, profit: 6900 },
  { month: 'May', sales: 21000, revenue: 32000, profit: 9600 },
  { month: 'Jun', sales: 18500, revenue: 27000, profit: 8100 },
  { month: 'Jul', sales: 22000, revenue: 35000, profit: 10500 },
];

// Employee distribution data
const employeeData = [
  { name: 'Mechanics', value: 8, color: '#3B82F6' },
  { name: 'Advisors', value: 5, color: '#10B981' },
  { name: 'Technicians', value: 7, color: '#F59E0B' },
  { name: 'Cleaners', value: 4, color: '#EF4444' },
];

// Vehicle types data
const vehicleData = [
  { type: 'Sedan', count: 18, color: '#8B5CF6' },
  { type: 'SUV', count: 14, color: '#06B6D4' },
  { type: 'Truck', count: 9, color: '#F97316' },
  { type: 'Other', count: 15, color: '#84CC16' },
];

// Service performance data
const servicePerformance = [
  { service: 'Oil Change', efficiency: 95, avgTime: 45, color: '#3B82F6' },
  { service: 'Brake Service', efficiency: 88, avgTime: 120, color: '#EF4444' },
  { service: 'Tire Rotation', efficiency: 92, avgTime: 30, color: '#10B981' },
  { service: 'AC Service', efficiency: 85, avgTime: 90, color: '#F59E0B' },
  { service: 'Inspection', efficiency: 97, avgTime: 60, color: '#8B5CF6' },
];

// Recent activity with enhanced data
const recentActivity = [
  { 
    type: 'Sale', 
    desc: 'Invoice #1234 - BMW X3 Service', 
    amount: '$1,200', 
    date: '2024-07-01', 
    status: 'Completed',
    icon: <FaDollarSign />,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  { 
    type: 'Service', 
    desc: 'Oil Change - Toyota Camry', 
    amount: '$80', 
    date: '2024-07-02', 
    status: 'Completed',
    icon: <FaCarSide />,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  { 
    type: 'Employee', 
    desc: 'Anna promoted to Senior Advisor', 
    amount: '-', 
    date: '2024-07-03', 
    status: 'HR Update',
    icon: <FaUsers />,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  { 
    type: 'Vehicle', 
    desc: 'New Mercedes C-Class added to fleet', 
    amount: '-', 
    date: '2024-07-03', 
    status: 'Fleet',
    icon: <FaCarSide />,
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  },
  { 
    type: 'Sale', 
    desc: 'Invoice #1235 - Audi A4 Repair', 
    amount: '$2,500', 
    date: '2024-07-04', 
    status: 'Pending',
    icon: <FaDollarSign />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export default function DashboardPage() {
  const [animateCards, setAnimateCards] = useState(false);
  const [barHover, setBarHover] = useState(-1);
  const [todayStatus, setTodayStatus] = useState<{ [status: string]: number }>({});
  const [loadingToday, setLoadingToday] = useState(true);

  useEffect(() => {
    setAnimateCards(true);
    // Fetch today's appointments
    (async () => {
      setLoadingToday(true);
      const appts = await getAppointments();
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const statusCount: { [status: string]: number } = {};
      appts.forEach((appt: Appointment) => {
        let apptDate: string;
        if (typeof appt.date === 'object' && 'toDate' in appt.date) {
          apptDate = appt.date.toDate().toISOString().slice(0, 10);
        } else {
          apptDate = String(appt.date).slice(0, 10);
        }
        if (apptDate === todayStr) {
          statusCount[appt.status] = (statusCount[appt.status] || 0) + 1;
        }
      });
      setTodayStatus(statusCount);
      setLoadingToday(false);
    })();
  }, []);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your service center.</p>
        </div>

        {/* Today's Appointments by Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Today's Appointments by Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingToday ? (
              <div className="col-span-6 flex justify-center items-center py-8">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : (
              [
                { label: 'Scheduled', icon: <FaClock className="text-blue-600 text-lg" />, color: 'from-blue-400 to-blue-600' },
                { label: 'In Progress', icon: <FaHourglassHalf className="text-orange-600 text-lg" />, color: 'from-orange-400 to-orange-600' },
                { label: 'Completed', icon: <FaCheckCircle className="text-green-600 text-lg" />, color: 'from-green-400 to-green-600' },
                { label: 'Cancelled', icon: <FaTimesCircle className="text-red-600 text-lg" />, color: 'from-red-400 to-red-600' },
              ].map((status, idx) => (
                <div
                  key={status.label}
                  className={`rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col items-center bg-gradient-to-r ${status.color} text-white transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-2">
                    {status.icon}
                  </div>
                  <div className="text-2xl font-bold">{todayStatus[status.label] || 0}</div>
                  <div className="text-sm font-medium">{status.label}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div 
              key={kpi.label} 
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform transition-all duration-700 ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                  {kpi.icon}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <FaArrowUp className={`mr-1 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600 font-medium">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="mr-2" />
                Last 7 months
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="url(#revenueGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  fill="url(#profitGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Employee Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Employee Distribution</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FaUsers className="mr-2" />
                Total: 24
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {employeeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {employeeData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Performance & Vehicle Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Service Performance */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Service Performance</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="mr-2" />
                Efficiency %
              </div>
            </div>
            <div className="space-y-4">
              {servicePerformance.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: service.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{service.service}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{service.avgTime}min</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${service.efficiency}%`, 
                            backgroundColor: service.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{service.efficiency}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Management */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Fleet Distribution</h3>
              <div className="flex items-center text-sm text-gray-600">
                <FaCarSide className="mr-2" />
                Total: 56
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="type" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]}
                  onMouseOver={(_, idx) => setBarHover(idx)}
                  onMouseOut={() => setBarHover(-1)}
                >
                  {vehicleData.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={barHover === idx ? entry.color + '80' : entry.color}
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.date + activity.type}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                  activity.color
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.desc}</div>
                    <div className="text-sm text-gray-600">{activity.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">{activity.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${activity.color}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 