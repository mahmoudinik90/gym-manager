import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, X } from 'lucide-react';
import { MEMBERSHIP_TYPES, GENDER_OPTIONS, MOCK_TRAINERS } from '../utils/constants';
import { getTodayISO, calculateEndDate } from '../utils/formatters';
import { toast } from 'react-toastify';

const RegisterMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    phoneNumber: '',
    membershipType: '',
    startDate: getTodayISO(),
    weight: '',
    gender: '',
    email: '',
    address: '',
    trainerId: '',
    goals: '',
    medicalIssues: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!form.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!form.nationalCode.trim()) {
      newErrors.nationalCode = 'کد ملی الزامی است';
    } else if (!/^[0-9]{10}$/.test(form.nationalCode)) {
      newErrors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    }
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'شماره تلفن الزامی است';
    } else if (!/^09[0-9]{9}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'فرمت شماره تلفن صحیح نیست (مثال: 09123456789)';
    }
    if (!form.membershipType) newErrors.membershipType = 'نوع اشتراک الزامی است';
    if (!form.startDate) newErrors.startDate = 'تاریخ ثبت‌نام الزامی است';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // شبیه‌سازی ارسال به سرور
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('عضو جدید با موفقیت ثبت شد');
    setLoading(false);
    navigate('/members');
  };

  const handleCancel = () => {
    navigate('/members');
  };

  const endDate = form.membershipType && form.startDate
    ? calculateEndDate(form.startDate, form.membershipType)
    : '';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">ثبت‌نام عضو جدید</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Right Column */}
            <div className="space-y-4">
              <InputField
                label="نام"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                placeholder="نام خود را وارد کنید"
              />
              <InputField
                label="تلفن"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
                placeholder="09123456789"
                dir="ltr"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع شارژ <span className="text-red-500">*</span>
                </label>
                <select
                  name="membershipType"
                  value={form.membershipType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.membershipType ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <option value="">انتخاب کنید</option>
                  {MEMBERSHIP_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.membershipType && <p className="text-red-500 text-xs mt-1">{errors.membershipType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مربی</label>
                <select
                  name="trainerId"
                  value={form.trainerId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">بدون مربی</option>
                  {MOCK_TRAINERS.filter(t => t.isActive).map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.firstName} {trainer.lastName} - {trainer.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="ایمیل"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="example@email.com"
                dir="ltr"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="آدرس محل سکونت"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اهداف تمرینی</label>
                <textarea
                  name="goals"
                  value={form.goals}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="اهداف تمرینی خود را بنویسید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مشکلات پزشکی</label>
                <textarea
                  name="medicalIssues"
                  value={form.medicalIssues}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="در صورت وجود مشکلات پزشکی ذکر کنید"
                />
              </div>
            </div>

            {/* Left Column */}
            <div className="space-y-4">
              <InputField
                label="نام خانوادگی"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                placeholder="نام خانوادگی خود را وارد کنید"
              />
              <InputField
                label="کد ملی"
                name="nationalCode"
                value={form.nationalCode}
                onChange={handleChange}
                error={errors.nationalCode}
                required
                placeholder="0012345678"
                maxLength={10}
                dir="ltr"
              />
              <InputField
                label="تاریخ ثبت‌نام"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required
                dir="ltr"
              />
              <InputField
                label="وزن (کیلوگرم)"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="مثال: 75"
                dir="ltr"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">جنسیت</label>
                <div className="flex gap-4">
                  {GENDER_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={form.gender === option.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* End Date Preview */}
              {endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">تاریخ پایان اشتراک:</span>{' '}
                    <span className="font-bold">{new Date(endDate).toLocaleDateString('fa-IR')}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Save className="w-4 h-4" />
              )}
              ثبت عضو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Input Field Component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  dir?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label, name, value, onChange, error, required, type = 'text', placeholder, maxLength, dir
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      dir={dir}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-400' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default RegisterMemberPage;
