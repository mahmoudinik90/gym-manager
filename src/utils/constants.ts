// ثابت‌های سیستم مدیریت باشگاه

export const MEMBERSHIP_TYPES = [
  { value: 'Weekly', label: 'هفتگی', days: 7 },
  { value: 'Monthly', label: 'ماهانه', days: 30 },
  { value: 'SemiAnnual', label: '۶ ماهه', days: 180 },
  { value: 'Annual', label: 'سالانه', days: 365 },
];

export const EMPLOYMENT_TYPES = [
  { value: 'FullTime', label: 'تمام وقت' },
  { value: 'PartTime', label: 'پاره وقت' },
  { value: 'Contract', label: 'قراردادی' },
];

export const GENDER_OPTIONS = [
  { value: 'M', label: 'مرد' },
  { value: 'F', label: 'زن' },
];

export const SPECIALTIES = [
  'بدنسازی',
  'فیتنس',
  'کراس‌فیت',
  'یوگا',
  'پیلاتس',
  'ایروبیک',
  'وزنه‌برداری',
  'TRX',
  'بوکس',
  'شنا',
];

// داده‌های نمونه اعضا
export const MOCK_MEMBERS = [
  { id: 1, firstName: 'علی', lastName: 'محمدی', nationalCode: '0012345678', phoneNumber: '09121234567', membershipType: 'Monthly', startDate: '2026-08-01', endDate: '2026-08-31', weight: 80, gender: 'M', email: 'ali@email.com', address: 'تهران، خیابان ولیعصر', isActive: true, trainerId: 1 },
  { id: 2, firstName: 'رضا', lastName: 'کریمی', nationalCode: '0023456789', phoneNumber: '09132345678', membershipType: 'Weekly', startDate: '2026-08-25', endDate: '2026-09-01', weight: 75, gender: 'M', email: 'reza@email.com', address: 'تهران، خیابان آزادی', isActive: true, trainerId: 2 },
  { id: 3, firstName: 'مریم', lastName: 'احمدی', nationalCode: '0034567890', phoneNumber: '09143456789', membershipType: 'SemiAnnual', startDate: '2026-03-01', endDate: '2026-08-28', weight: 60, gender: 'F', email: 'maryam@email.com', address: 'تهران، خیابان شریعتی', isActive: true, trainerId: 1 },
  { id: 4, firstName: 'حسین', lastName: 'رضایی', nationalCode: '0045678901', phoneNumber: '09154567890', membershipType: 'Annual', startDate: '2026-01-01', endDate: '2026-12-31', weight: 90, gender: 'M', email: '', address: 'تهران، خیابان انقلاب', isActive: true, trainerId: 3 },
  { id: 5, firstName: 'زهرا', lastName: 'موسوی', nationalCode: '0056789012', phoneNumber: '09165678901', membershipType: 'Monthly', startDate: '2026-07-15', endDate: '2026-08-14', weight: 55, gender: 'F', email: 'zahra@email.com', address: 'تهران، خیابان نیاوران', isActive: false, trainerId: null },
  { id: 6, firstName: 'محمد', lastName: 'حسینی', nationalCode: '0067890123', phoneNumber: '09176789012', membershipType: 'Monthly', startDate: '2026-08-10', endDate: '2026-09-09', weight: 85, gender: 'M', email: '', address: '', isActive: true, trainerId: 2 },
  { id: 7, firstName: 'فاطمه', lastName: 'نوری', nationalCode: '0078901234', phoneNumber: '09187890123', membershipType: 'Weekly', startDate: '2026-08-20', endDate: '2026-08-27', weight: 62, gender: 'F', email: 'fatemeh@email.com', address: 'تهران، میدان ونک', isActive: true, trainerId: null },
  { id: 8, firstName: 'امیر', lastName: 'عباسی', nationalCode: '0089012345', phoneNumber: '09198901234', membershipType: 'SemiAnnual', startDate: '2026-05-01', endDate: '2026-10-28', weight: 78, gender: 'M', email: '', address: '', isActive: true, trainerId: 1 },
];

// داده‌های نمونه مربیان
export const MOCK_TRAINERS = [
  { id: 1, firstName: 'سعید', lastName: 'جعفری', nationalCode: '1001234567', phoneNumber: '09121111111', specialty: 'بدنسازی', experienceYears: 8, employmentType: 'FullTime', baseSalary: 15000000, pricePerSession: 500000, gender: 'M', email: 'saeed@gym.com', address: 'تهران', bio: 'مربی با سابقه بدنسازی و پرورش اندام', certificates: 'مدرک مربیگری درجه ۱', isActive: true },
  { id: 2, firstName: 'نرگس', lastName: 'صادقی', nationalCode: '1002345678', phoneNumber: '09132222222', specialty: 'فیتنس', experienceYears: 5, employmentType: 'PartTime', baseSalary: 8000000, pricePerSession: 400000, gender: 'F', email: 'narges@gym.com', address: 'تهران', bio: 'مربی فیتنس و تغذیه', certificates: 'مدرک فیتنس بین‌المللی', isActive: true },
  { id: 3, firstName: 'مهدی', lastName: 'اکبری', nationalCode: '1003456789', phoneNumber: '09143333333', specialty: 'کراس‌فیت', experienceYears: 6, employmentType: 'Contract', baseSalary: 0, pricePerSession: 600000, gender: 'M', email: '', address: '', bio: 'مربی کراس‌فیت', certificates: 'مدرک CrossFit Level 2', isActive: true },
  { id: 4, firstName: 'سارا', lastName: 'کاظمی', nationalCode: '1004567890', phoneNumber: '09154444444', specialty: 'یوگا', experienceYears: 4, employmentType: 'PartTime', baseSalary: 6000000, pricePerSession: 350000, gender: 'F', email: 'sara@gym.com', address: 'تهران', bio: 'مربی یوگا و مدیتیشن', certificates: 'مدرک RYT-200', isActive: false },
];

// داده‌های حضور و غیاب
export const MOCK_ATTENDANCE = [
  { id: 1, memberId: 1, memberName: 'علی محمدی', checkInTime: '2026-08-27T08:30:00', checkOutTime: null, type: 'Manual' },
  { id: 2, memberId: 4, memberName: 'حسین رضایی', checkInTime: '2026-08-27T09:00:00', checkOutTime: null, type: 'Manual' },
  { id: 3, memberId: 6, memberName: 'محمد حسینی', checkInTime: '2026-08-27T09:15:00', checkOutTime: null, type: 'Manual' },
  { id: 4, memberId: 8, memberName: 'امیر عباسی', checkInTime: '2026-08-27T07:45:00', checkOutTime: null, type: 'Manual' },
  { id: 5, memberId: 2, memberName: 'رضا کریمی', checkInTime: '2026-08-27T10:30:00', checkOutTime: null, type: 'Manual' },
];
