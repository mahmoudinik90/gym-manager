import { MEMBERSHIP_TYPES } from './constants';

// تبدیل اعداد انگلیسی به فارسی
export const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

// قالب‌بندی تاریخ به شمسی
export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return dateStr;
  }
};

// قالب‌بندی تاریخ و ساعت
export const formatDateTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return dateStr;
  }
};

// قالب‌بندی ساعت
export const formatTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return dateStr;
  }
};

// قالب‌بندی مبلغ
export const formatCurrency = (amount: number): string => {
  return toPersianNumber(amount.toLocaleString('en-US')) + ' تومان';
};

// قالب‌بندی شماره تلفن
export const formatPhone = (phone: string): string => {
  if (phone.length === 11) {
    return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`;
  }
  return phone;
};

// محاسبه تاریخ پایان بر اساس نوع اشتراک
export const calculateEndDate = (startDate: string, membershipType: string): string => {
  const start = new Date(startDate);
  const type = MEMBERSHIP_TYPES.find(t => t.value === membershipType);
  if (!type) return startDate;
  
  const end = new Date(start);
  end.setDate(end.getDate() + type.days);
  return end.toISOString().split('T')[0];
};

// محاسبه روزهای باقی‌مانده
export const getDaysLeft = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// محاسبه مدت زمان حضور
export const getDuration = (checkInTime: string): string => {
  const checkIn = new Date(checkInTime);
  const now = new Date();
  const diff = now.getTime() - checkIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${toPersianNumber(hours)} ساعت و ${toPersianNumber(minutes)} دقیقه`;
};

// تاریخ امروز به فرمت ISO
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

// تاریخ فردا
export const getTomorrowISO = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};
