import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Users,
} from 'lucide-react';
import { MOCK_TRAINERS, EMPLOYMENT_TYPES } from '../utils/constants';
import { toPersianNumber } from '../utils/formatters';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  specialty: string;
  experienceYears: number;
  employmentType: string;
  baseSalary: number;
  pricePerSession: number;
  gender: string;
  email: string;
  address: string;
  bio: string;
  certificates: string;
  isActive: boolean;
}

const TrainerListPage: React.FC = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<Trainer[]>(MOCK_TRAINERS as Trainer[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState<Trainer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer =>
      trainer.firstName.includes(searchTerm) ||
      trainer.lastName.includes(searchTerm) ||
      trainer.specialty.includes(searchTerm)
    );
  }, [trainers, searchTerm]);

  const handleToggleStatus = (id: number) => {
    setTrainers(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    toast.success('وضعیت مربی تغییر کرد');
  };

  const handleDelete = async (id: number) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, isActive: false } : t));
    setDeleteConfirm(null);
    toast.success('مربی حذف شد');
  };

  const getEmploymentLabel = (type: string) => {
    return EMPLOYMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو (نام، تخصص)..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <button
            onClick={() => navigate('/trainers/register')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            ثبت مربی جدید
          </button>
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
                <th className="px-4 py-3 text-right font-medium text-gray-600">تخصص</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">سابقه (سال)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">نوع استخدام</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">وضعیت</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    هیچ مربی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredTrainers.map((trainer, idx) => (
                  <tr key={trainer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{toPersianNumber(idx + 1)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{trainer.firstName}</td>
                    <td className="px-4 py-3 text-gray-700">{trainer.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{trainer.specialty}</td>
                    <td className="px-4 py-3 text-gray-600">{toPersianNumber(trainer.experienceYears)}</td>
                    <td className="px-4 py-3 text-gray-600">{getEmploymentLabel(trainer.employmentType)}</td>
                    <td className="px-4 py-3">
                      {trainer.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">فعال</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">غیرفعال</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditModal(trainer)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ویرایش"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(trainer.id)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="تغییر وضعیت"
                        >
                          {trainer.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(trainer.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-600">مجموع: {toPersianNumber(filteredTrainers.length)} مربی</span>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditModal(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-800">ویرایش مربی</h3>
              <button onClick={() => setEditModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <TrainerEditForm
                trainer={editModal}
                onSave={(updated) => {
                  setTrainers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  setEditModal(null);
                  toast.success('اطلاعات مربی بروزرسانی شد');
                }}
                onCancel={() => setEditModal(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-700 mb-6">آیا از حذف این مربی اطمینان دارید؟</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">انصراف</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">حذف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Trainer Edit Form
const TrainerEditForm: React.FC<{ trainer: Trainer; onSave: (t: Trainer) => void; onCancel: () => void }> = ({ trainer, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...trainer });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'experienceYears' || name === 'baseSalary' || name === 'pricePerSession' ? Number(value) : value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تخصص</label>
          <input name="specialty" value={form.specialty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">سابقه (سال)</label>
          <input name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" dir="ltr" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">بیوگرافی</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">انصراف</button>
        <button onClick={() => onSave(form)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
    </div>
  );
};

export default TrainerListPage;
