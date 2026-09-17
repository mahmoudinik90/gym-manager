import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Save, X } from 'lucide-react';
import { EMPLOYMENT_TYPES, GENDER_OPTIONS, SPECIALTIES } from '../utils/constants';
import { toast } from 'react-toastify';

const RegisterTrainerPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    phoneNumber: '',
    specialty: '',
    experienceYears: '',
    employmentType: '',
    baseSalary: '',
    pricePerSession: '',
    gender: '',
    email: '',
    address: '',
    certificates: '',
    bio: '',
    birthDate: '',
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
      newErrors.phoneNumber = 'فرمت شماره تلفن صحیح نیست';
    }
    if (!form.specialty) newErrors.specialty = 'تخصص الزامی است';
    if (!form.experienceYears && form.experienceYears !== '0') {
      newErrors.experienceYears = 'سابقه الزامی است';
    } else if (parseInt(form.experienceYears) < 0) {
      newErrors.experienceYears = 'سابقه نمی‌تواند منفی باشد';
    }
    if (!form.employmentType) newErrors.employmentType = 'نوع استخدام الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('مربی جدید با موفقیت ثبت شد');
    setLoading(false);
    navigate('/trainers');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-green-600 to-green-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">ثبت‌نام مربی جدید</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Right Column */}
            <div className="space-y-4">
              <InputField label="نام" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required placeholder="نام مربی" />
              <InputField label="تلفن" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} required placeholder="09123456789" dir="ltr" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تخصص <span className="text-red-500">*</span></label>
                <select name="specialty" value={form.specialty} onChange={handleChange} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.specialty ? 'border-red-400' : 'border-gray-300'}`}>
                  <option value="">انتخاب کنید</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
              </div>
              <InputField label="ایمیل" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" dir="ltr" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">جنسیت</label>
                <div className="flex gap-4">
                  {GENDER_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value={option.value} checked={form.gender === option.value} onChange={handleChange} className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="آدرس" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مدارک</label>
                <textarea name="certificates" value={form.certificates} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="مدارک و گواهینامه‌ها" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بیوگرافی</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="بیوگرافی مختصر" />
              </div>
            </div>

            {/* Left Column */}
            <div className="space-y-4">
              <InputField label="نام خانوادگی" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required placeholder="نام خانوادگی" />
              <InputField label="کد ملی" name="nationalCode" value={form.nationalCode} onChange={handleChange} error={errors.nationalCode} required placeholder="0012345678" maxLength={10} dir="ltr" />
              <InputField label="سابقه (سال)" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} error={errors.experienceYears} required placeholder="مثال: 5" dir="ltr" />
              <InputField label="تاریخ تولد" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} dir="ltr" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع استخدام <span className="text-red-500">*</span></label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.employmentType ? 'border-red-400' : 'border-gray-300'}`}>
                  <option value="">انتخاب کنید</option>
                  {EMPLOYMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType}</p>}
              </div>
              <InputField label="حقوق پایه (تومان)" name="baseSalary" type="number" value={form.baseSalary} onChange={handleChange} placeholder="مثال: 10000000" dir="ltr" />
              <InputField label="قیمت هر جلسه (تومان)" name="pricePerSession" type="number" value={form.pricePerSession} onChange={handleChange} placeholder="مثال: 500000" dir="ltr" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/trainers')} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" /> انصراف
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <Save className="w-4 h-4" />}
              ثبت مربی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; required?: boolean; type?: string;
  placeholder?: string; maxLength?: number; dir?: string;
}> = ({ label, name, value, onChange, error, required, type = 'text', placeholder, maxLength, dir }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} maxLength={maxLength} dir={dir}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-400' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default RegisterTrainerPage;
