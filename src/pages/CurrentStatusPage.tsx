import React, { useState } from 'react';
import {
  MapPin,
  Search,
  LogIn,
  LogOut,
  X,
  UserPlus,
  Clock,
  Users,
} from 'lucide-react';
import { MOCK_MEMBERS, MOCK_ATTENDANCE } from '../utils/constants';
import { toPersianNumber, formatTime, getDuration } from '../utils/formatters';
import { toast } from 'react-toastify';

interface AttendanceRecord {
  id: number;
  memberId: number;
  memberName: string;
  checkInTime: string;
  checkOutTime: string | null;
  type: string;
}

const CurrentStatusPage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const insideMembers = attendance.filter(a => !a.checkOutTime);

  const handleCheckOut = (id: number) => {
    setAttendance(prev => prev.map(a =>
      a.id === id ? { ...a, checkOutTime: new Date().toISOString() } : a
    ));
    setDeleteConfirm(null);
    toast.success('خروج عضو ثبت شد');
  };

  const handleCheckIn = (memberId: number, memberName: string) => {
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      memberId,
      memberName,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      type: 'Manual',
    };
    setAttendance(prev => [...prev, newRecord]);
    setShowCheckInModal(false);
    toast.success(`${memberName} وارد باشگاه شد`);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-l from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">افراد حاضر در باشگاه</h2>
              <p className="text-purple-200 mt-1">وضعیت لحظه‌ای حضور اعضا</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{toPersianNumber(insideMembers.length)}</p>
            <p className="text-purple-200 text-sm">نفر</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          ثبت ورود عضو
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">ردیف</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نام و نام خانوادگی</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">زمان ورود</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">مدت حضور</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {insideMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="w-10 h-10 text-gray-300" />
                      <p>هیچ کسی در باشگاه نیست</p>
                    </div>
                  </td>
                </tr>
              ) : (
                insideMembers.map((record, idx) => (
                  <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{toPersianNumber(idx + 1)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{record.memberName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(record.checkInTime)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getDuration(record.checkInTime)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setDeleteConfirm(record.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium mx-auto"
                      >
                        <LogOut className="w-3 h-3" />
                        خروج
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <CheckInModal
          onClose={() => setShowCheckInModal(false)}
          onCheckIn={handleCheckIn}
          existingMemberIds={insideMembers.map(m => m.memberId)}
        />
      )}

      {/* Checkout Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-700 mb-6">آیا از ثبت خروج این عضو اطمینان دارید؟</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">انصراف</button>
                <button onClick={() => handleCheckOut(deleteConfirm)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">ثبت خروج</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Check-In Modal Component
const CheckInModal: React.FC<{
  onClose: () => void;
  onCheckIn: (memberId: number, memberName: string) => void;
  existingMemberIds: number[];
}> = ({ onClose, onCheckIn, existingMemberIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_MEMBERS>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const results = MOCK_MEMBERS.filter(m =>
      (m.phoneNumber.includes(searchQuery) || m.nationalCode.includes(searchQuery)) && m.isActive
    );
    setSearchResults(results);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">ثبت ورود عضو</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="شماره تلفن یا کد ملی..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                dir="ltr"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              جستجو
            </button>
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">عضوی یافت نشد</p>
                  <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium mx-auto">
                    <UserPlus className="w-4 h-4" />
                    ثبت عضو جدید
                  </button>
                </div>
              ) : (
                searchResults.map(member => {
                  const isInside = existingMemberIds.includes(member.id);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-gray-500">{member.phoneNumber}</p>
                      </div>
                      {isInside ? (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">قبلاً وارد شده</span>
                      ) : (
                        <button
                          onClick={() => onCheckIn(member.id, `${member.firstName} ${member.lastName}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs"
                        >
                          <LogIn className="w-3 h-3" />
                          ثبت ورود
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentStatusPage;
