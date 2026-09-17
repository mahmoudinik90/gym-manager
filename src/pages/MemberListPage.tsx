import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  LogIn,
  LogOut,
  X,
  Save,
  Download,
  Filter,
} from 'lucide-react';
import { MOCK_MEMBERS, MEMBERSHIP_TYPES } from '../utils/constants';
import { toPersianNumber, formatDate, getDaysLeft, calculateEndDate } from '../utils/formatters';
import { toast } from 'react-toastify';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  weight: number | string;
  gender: string;
  email: string;
  address: string;
  trainerId: number | null;
  isActive: boolean;
}

const MemberListPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS as Member[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModal, setEditModal] = useState<Member | null>(null);
  const [renewModal, setRenewModal] = useState<Member | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // فیلتر اعضا
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.firstName.includes(searchTerm) ||
        member.lastName.includes(searchTerm) ||
        member.phoneNumber.includes(searchTerm) ||
        member.nationalCode.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && member.isActive) ||
        (statusFilter === 'inactive' && !member.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  const handleDelete = async (id: number) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isActive: false } : m));
    setDeleteConfirm(null);
    toast.success('عضو با موفقیت حذف شد');
    setLoading(false);
  };

  const handleCheckIn = (id: number) => {
    toast.success('ورود عضو ثبت شد');
  };

  const handleCheckOut = (id: number) => {
    toast.success('خروج عضو ثبت شد');
  };

  const getMembershipLabel = (type: string) => {
    return MEMBERSHIP_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو (نام، تلفن، کد ملی)..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="all">همه</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/members/register')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              ثبت عضو جدید
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-gray-600">ردیف</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نام</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نام خانوادگی</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تلفن</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نوع اشتراک</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">تاریخ پایان</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">وضعیت</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    هیچ عضوی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => {
                  const daysLeft = getDaysLeft(member.endDate);
                  return (
                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{toPersianNumber(idx + 1)}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{member.firstName}</td>
                      <td className="px-4 py-3 text-gray-700">{member.lastName}</td>
                      <td className="px-4 py-3 text-gray-600 dir-ltr">{toPersianNumber(member.phoneNumber)}</td>
                      <td className="px-4 py-3 text-gray-600">{getMembershipLabel(member.membershipType)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(member.endDate)}</td>
                      <td className="px-4 py-3">
                        {member.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            غیرفعال
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditModal(member)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRenewModal(member)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تمدید"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCheckIn(member.id)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="ورود"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCheckOut(member.id)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="خروج"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(member.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            مجموع: {toPersianNumber(filteredMembers.length)} عضو
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <Modal title="ویرایش عضو" onClose={() => setEditModal(null)}>
          <EditMemberForm
            member={editModal}
            onSave={(updated) => {
              setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
              setEditModal(null);
              toast.success('اطلاعات عضو بروزرسانی شد');
            }}
            onCancel={() => setEditModal(null)}
          />
        </Modal>
      )}

      {/* Renew Modal */}
      {renewModal && (
        <Modal title="تمدید اشتراک" onClose={() => setRenewModal(null)}>
          <RenewForm
            member={renewModal}
            onSave={(updated) => {
              setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
              setRenewModal(null);
              toast.success('اشتراک عضو تمدید شد');
            }}
            onCancel={() => setRenewModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <Modal title="تایید حذف" onClose={() => setDeleteConfirm(null)}>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-700 mb-6">آیا از حذف این عضو اطمینان دارید؟</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'در حال حذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Modal Component
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// Edit Form
const EditMemberForm: React.FC<{ member: Member; onSave: (m: Member) => void; onCancel: () => void }> = ({ member, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...member });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
          <input name="nationalCode" value={form.nationalCode} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وزن</label>
          <input name="weight" value={form.weight} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" dir="ltr" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
        <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">انصراف</button>
        <button onClick={() => onSave(form)} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
    </div>
  );
};

// Renew Form
const RenewForm: React.FC<{ member: Member; onSave: (m: Member) => void; onCancel: () => void }> = ({ member, onSave, onCancel }) => {
  const [newType, setNewType] = useState(member.membershipType);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);

  const newEndDate = calculateEndDate(newStartDate, newType);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">نوع اشتراک جدید</label>
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {MEMBERSHIP_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          dir="ltr"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          تاریخ پایان جدید: <span className="font-bold">{new Date(newEndDate).toLocaleDateString('fa-IR')}</span>
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">انصراف</button>
        <button
          onClick={() => onSave({ ...member, membershipType: newType, startDate: newStartDate, endDate: newEndDate, isActive: true })}
          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <RefreshCw className="w-4 h-4" /> تمدید
        </button>
      </div>
    </div>
  );
};

export default MemberListPage;
