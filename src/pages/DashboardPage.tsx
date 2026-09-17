import React, { useState, useEffect } from 'react';
import {
  Users,
  Dumbbell,
  MapPin,
  TrendingUp,
  UserPlus,
  LogOut as LogOutIcon,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { MOCK_MEMBERS, MOCK_TRAINERS, MOCK_ATTENDANCE } from '../utils/constants';
import { toPersianNumber, formatDate, formatCurrency, getDaysLeft, formatTime } from '../utils/formatters';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // محاسبه آمار
  const totalMembers = MOCK_MEMBERS.filter(m => m.isActive).length;
  const activeTrainers = MOCK_TRAINERS.filter(t => t.isActive).length;
  const currentInside = MOCK_ATTENDANCE.filter(a => !a.checkOutTime).length;
  const monthlyRevenue = 45000000;

  // اعضای در حال انقضا (۷ روز آینده)
  const expiringMembers = MOCK_MEMBERS.filter(m => {
    if (!m.isActive) return false;
    const days = getDaysLeft(m.endDate);
    return days >= 0 && days <= 7;
  });

  // داده‌های نمودار (اعضای جدید ۷ روز اخیر)
  const chartData = [
    { day: 'شنبه', members: 3 },
    { day: 'یکشنبه', members: 5 },
    { day: 'دوشنبه', members: 2 },
    { day: 'سه‌شنبه', members: 7 },
    { day: 'چهارشنبه', members: 4 },
    { day: 'پنجشنبه', members: 6 },
    { day: 'جمعه', members: 1 },
  ];

  // افراد داخل باشگاه
  const insideMembers = MOCK_ATTENDANCE.filter(a => !a.checkOutTime);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-7 h-7" />}
          title="کل اعضا"
          value={toPersianNumber(totalMembers)}
          color="bg-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Dumbbell className="w-7 h-7" />}
          title="مربیان فعال"
          value={toPersianNumber(activeTrainers)}
          color="bg-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<MapPin className="w-7 h-7" />}
          title="افراد حاضر"
          value={toPersianNumber(currentInside)}
          color="bg-purple-500"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="w-7 h-7" />}
          title="درآمد ماه"
          value={formatCurrency(monthlyRevenue)}
          color="bg-orange-500"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">اعضای جدید (هفته اخیر)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', direction: 'rtl', fontFamily: 'Vazirmatn' }}
                  formatter={(value: number) => [toPersianNumber(value) + ' نفر', 'اعضا']}
                />
                <Bar dataKey="members" fill="#1976D2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inside Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">افراد حاضر در باشگاه</h3>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {toPersianNumber(currentInside)} نفر
            </span>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">ردیف</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">نام</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">زمان ورود</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {insideMembers.map((member, idx) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-600">{toPersianNumber(idx + 1)}</td>
                    <td className="px-3 py-2 font-medium text-gray-800">{member.memberName}</td>
                    <td className="px-3 py-2 text-gray-600">{formatTime(member.checkInTime)}</td>
                    <td className="px-3 py-2">
                      <button className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1">
                        <LogOutIcon className="w-3 h-3" />
                        خروج
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expiring Members */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-800">اشتراک‌های در حال انقضا (۷ روز آینده)</h3>
        </div>
        {expiringMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">هیچ اشتراکی در ۷ روز آینده منقضی نمی‌شود</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringMembers.map(member => {
              const days = getDaysLeft(member.endDate);
              return (
                <div key={member.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-medium text-gray-800">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-gray-500">پایان: {formatDate(member.endDate)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${days <= 2 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {toPersianNumber(days)} روز
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-xl`}>
        {icon}
      </div>
    </div>
  </div>
);

export default DashboardPage;
