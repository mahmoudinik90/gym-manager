import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, FolderOpen, Github, ChevronDown, ChevronUp, Terminal, ExternalLink, ArrowRight } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// محتوای تمام فایل‌های پروژه
const PROJECT_FILES: { path: string; content: string }[] = [
  { path: 'index.html', content: `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>سیستم مدیریت باشگاه بدنسازی</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { font-family: 'Vazirmatn', sans-serif; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>` },
  { path: 'package.json', content: `{
  "name": "gym-management",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "react-toastify": "^9.1.3",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}` },
  { path: 'vite.config.ts', content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})` },
  { path: 'tsconfig.json', content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}` },
  { path: 'tailwind.config.js', content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}` },
  { path: 'postcss.config.js', content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}` },
  { path: '.gitignore', content: `node_modules/
dist/
.env
.env.local
.vscode/
.idea/
.DS_Store
Thumbs.db` },
  { path: 'README.md', content: `# 🏋️ سیستم مدیریت باشگاه بدنسازی

یک وب اپلیکیشن فرانت‌اند با React برای مدیریت باشگاه بدنسازی.

## 🚀 ویژگی‌ها

- ✅ احراز هویت با JWT (شبیه‌سازی شده)
- ✅ داشبورد آماری با نمودار
- ✅ مدیریت اعضا (ثبت‌نام، ویرایش، تمدید، حذف)
- ✅ مدیریت مربیان
- ✅ سیستم حضور و غیاب
- ✅ طراحی واکنش‌گرا (Responsive)
- ✅ RTL و پشتیبانی کامل از فارسی
- ✅ اعداد و تاریخ شمسی
- ✅ اعتبارسنجی فرم‌ها

## 📦 نصب و اجرا

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🔐 اطلاعات ورود

- **نام کاربری:** admin
- **رمز عبور:** admin123

## 🛠 تکنولوژی‌ها

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM v6
- Recharts
- Lucide React
- React Toastify
` },
  { path: 'src/main.tsx', content: `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
` },
  { path: 'src/index.css', content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Vazirmatn', sans-serif;
  direction: rtl;
  background-color: #f5f5f5;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }

.Toastify__toast-container { direction: rtl; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
` },
  { path: 'src/App.tsx', content: `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import MainLayout, { ProtectedRoute } from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterMemberPage from './pages/RegisterMemberPage';
import RegisterTrainerPage from './pages/RegisterTrainerPage';
import CurrentStatusPage from './pages/CurrentStatusPage';
import MemberListPage from './pages/MemberListPage';
import TrainerListPage from './pages/TrainerListPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="members/register" element={<RegisterMemberPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="trainers/register" element={<RegisterTrainerPage />} />
            <Route path="trainers" element={<TrainerListPage />} />
            <Route path="status" element={<CurrentStatusPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-left" autoClose={3000} rtl theme="light" />
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
` },
  { path: 'src/context/AuthContext.tsx', content: `import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface User { username: string; role: string; }
interface AuthState { user: User | null; token: string | null; isAuthenticated: boolean; }
type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: User; token: string } };
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
    case 'INITIALIZE':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, token: null, isAuthenticated: false });

  useEffect(() => {
    const storedToken = localStorage.getItem('gym_token');
    const storedUser = localStorage.getItem('gym_user');
    if (storedToken && storedUser) {
      try {
        dispatch({ type: 'INITIALIZE', payload: { user: JSON.parse(storedUser), token: storedToken } });
      } catch { localStorage.removeItem('gym_token'); localStorage.removeItem('gym_user'); }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (username === 'admin' && password === 'admin123') {
      const user = { username: 'admin', role: 'مدیر سیستم' };
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('gym_token', token);
      localStorage.setItem('gym_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN', payload: { user, token } });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
` },
  { path: 'src/components/Layout.tsx', content: `import React, { useState, ReactNode } from 'react';
import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UserPlus, Users, MapPin, UserCheck, Dumbbell, LogOut, Menu, X, ChevronLeft } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/members/register', label: 'ثبت‌نام عضو', icon: UserPlus },
  { path: '/trainers/register', label: 'ثبت‌نام مربی', icon: Dumbbell },
  { path: '/status', label: 'وضعیت کنونی', icon: MapPin },
  { path: '/members', label: 'لیست اعضا', icon: Users },
  { path: '/trainers', label: 'لیست مربیان', icon: UserCheck },
];

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    const current = menuItems.find(item => item.path === location.pathname);
    return current?.label || 'داشبورد';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={\`fixed lg:static inset-y-0 right-0 z-50 bg-gradient-to-b from-[#1a237e] to-[#0d47a1] text-white transition-all duration-300 flex flex-col \${sidebarOpen ? 'w-64' : 'w-20'} \${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}\`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <div className="flex items-center gap-2"><Dumbbell className="w-8 h-8 text-blue-300" /><h1 className="text-lg font-bold">مدیریت باشگاه</h1></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-1 rounded hover:bg-white/10"><ChevronLeft className={\`w-5 h-5 transition-transform \${!sidebarOpen ? 'rotate-180' : ''}\`} /></button>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={\`flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-lg transition-all \${isActive ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} \${!sidebarOpen ? 'justify-center' : ''}\`} title={!sidebarOpen ? item.label : undefined}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className={\`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-200 hover:bg-red-500/20 transition-all \${!sidebarOpen ? 'justify-center' : ''}\`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">خروج از سیستم</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block"><p className="text-sm font-medium text-gray-700">{user?.username}</p><p className="text-xs text-gray-500">{user?.role}</p></div>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center"><UserCheck className="w-5 h-5 text-blue-600" /></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><div className="animate-fadeIn"><Outlet /></div></main>
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default MainLayout;
` },
  { path: 'src/utils/constants.ts', content: `export const MEMBERSHIP_TYPES = [
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

export const SPECIALTIES = ['بدنسازی', 'فیتنس', 'کراس‌فیت', 'یوگا', 'پیلاتس', 'ایروبیک', 'وزنه‌برداری', 'TRX', 'بوکس', 'شنا'];

export const MOCK_MEMBERS = [
  { id: 1, firstName: 'علی', lastName: 'محمدی', nationalCode: '0012345678', phoneNumber: '09121234567', membershipType: 'Monthly', startDate: '2026-08-01', endDate: '2026-08-31', weight: 80, gender: 'M', email: 'ali@email.com', address: 'تهران', isActive: true, trainerId: 1 },
  { id: 2, firstName: 'رضا', lastName: 'کریمی', nationalCode: '0023456789', phoneNumber: '09132345678', membershipType: 'Weekly', startDate: '2026-08-25', endDate: '2026-09-01', weight: 75, gender: 'M', email: 'reza@email.com', address: 'تهران', isActive: true, trainerId: 2 },
  { id: 3, firstName: 'مریم', lastName: 'احمدی', nationalCode: '0034567890', phoneNumber: '09143456789', membershipType: 'SemiAnnual', startDate: '2026-03-01', endDate: '2026-08-28', weight: 60, gender: 'F', email: 'maryam@email.com', address: 'تهران', isActive: true, trainerId: 1 },
  { id: 4, firstName: 'حسین', lastName: 'رضایی', nationalCode: '0045678901', phoneNumber: '09154567890', membershipType: 'Annual', startDate: '2026-01-01', endDate: '2026-12-31', weight: 90, gender: 'M', email: '', address: 'تهران', isActive: true, trainerId: 3 },
  { id: 5, firstName: 'زهرا', lastName: 'موسوی', nationalCode: '0056789012', phoneNumber: '09165678901', membershipType: 'Monthly', startDate: '2026-07-15', endDate: '2026-08-14', weight: 55, gender: 'F', email: 'zahra@email.com', address: 'تهران', isActive: false, trainerId: null },
  { id: 6, firstName: 'محمد', lastName: 'حسینی', nationalCode: '0067890123', phoneNumber: '09176789012', membershipType: 'Monthly', startDate: '2026-08-10', endDate: '2026-09-09', weight: 85, gender: 'M', email: '', address: '', isActive: true, trainerId: 2 },
  { id: 7, firstName: 'فاطمه', lastName: 'نوری', nationalCode: '0078901234', phoneNumber: '09187890123', membershipType: 'Weekly', startDate: '2026-08-20', endDate: '2026-08-27', weight: 62, gender: 'F', email: 'fatemeh@email.com', address: 'تهران', isActive: true, trainerId: null },
  { id: 8, firstName: 'امیر', lastName: 'عباسی', nationalCode: '0089012345', phoneNumber: '09198901234', membershipType: 'SemiAnnual', startDate: '2026-05-01', endDate: '2026-10-28', weight: 78, gender: 'M', email: '', address: '', isActive: true, trainerId: 1 },
];

export const MOCK_TRAINERS = [
  { id: 1, firstName: 'سعید', lastName: 'جعفری', nationalCode: '1001234567', phoneNumber: '09121111111', specialty: 'بدنسازی', experienceYears: 8, employmentType: 'FullTime', baseSalary: 15000000, pricePerSession: 500000, gender: 'M', email: 'saeed@gym.com', address: 'تهران', bio: 'مربی بدنسازی', certificates: 'مدرک درجه ۱', isActive: true },
  { id: 2, firstName: 'نرگس', lastName: 'صادقی', nationalCode: '1002345678', phoneNumber: '09132222222', specialty: 'فیتنس', experienceYears: 5, employmentType: 'PartTime', baseSalary: 8000000, pricePerSession: 400000, gender: 'F', email: 'narges@gym.com', address: 'تهران', bio: 'مربی فیتنس', certificates: 'فیتنس بین‌المللی', isActive: true },
  { id: 3, firstName: 'مهدی', lastName: 'اکبری', nationalCode: '1003456789', phoneNumber: '09143333333', specialty: 'کراس‌فیت', experienceYears: 6, employmentType: 'Contract', baseSalary: 0, pricePerSession: 600000, gender: 'M', email: '', address: '', bio: 'مربی کراس‌فیت', certificates: 'CrossFit Level 2', isActive: true },
  { id: 4, firstName: 'سارا', lastName: 'کاظمی', nationalCode: '1004567890', phoneNumber: '09154444444', specialty: 'یوگا', experienceYears: 4, employmentType: 'PartTime', baseSalary: 6000000, pricePerSession: 350000, gender: 'F', email: 'sara@gym.com', address: 'تهران', bio: 'مربی یوگا', certificates: 'RYT-200', isActive: false },
];

export const MOCK_ATTENDANCE = [
  { id: 1, memberId: 1, memberName: 'علی محمدی', checkInTime: '2026-08-27T08:30:00', checkOutTime: null, type: 'Manual' },
  { id: 2, memberId: 4, memberName: 'حسین رضایی', checkInTime: '2026-08-27T09:00:00', checkOutTime: null, type: 'Manual' },
  { id: 3, memberId: 6, memberName: 'محمد حسینی', checkInTime: '2026-08-27T09:15:00', checkOutTime: null, type: 'Manual' },
  { id: 4, memberId: 8, memberName: 'امیر عباسی', checkInTime: '2026-08-27T07:45:00', checkOutTime: null, type: 'Manual' },
  { id: 5, memberId: 2, memberName: 'رضا کریمی', checkInTime: '2026-08-27T10:30:00', checkOutTime: null, type: 'Manual' },
];
` },
  { path: 'src/utils/formatters.ts', content: `import { MEMBERSHIP_TYPES } from './constants';

export const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  } catch { return dateStr; }
};

export const formatDateTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  } catch { return dateStr; }
};

export const formatTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(date);
  } catch { return dateStr; }
};

export const formatCurrency = (amount: number): string => {
  return toPersianNumber(amount.toLocaleString('en-US')) + ' تومان';
};

export const calculateEndDate = (startDate: string, membershipType: string): string => {
  const start = new Date(startDate);
  const type = MEMBERSHIP_TYPES.find(t => t.value === membershipType);
  if (!type) return startDate;
  const end = new Date(start);
  end.setDate(end.getDate() + type.days);
  return end.toISOString().split('T')[0];
};

export const getDaysLeft = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const getDuration = (checkInTime: string): string => {
  const checkIn = new Date(checkInTime);
  const now = new Date();
  const diff = now.getTime() - checkIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return \`\${toPersianNumber(hours)} ساعت و \${toPersianNumber(minutes)} دقیقه\`;
};

export const getTodayISO = (): string => new Date().toISOString().split('T')[0];
` },
  { path: 'src/pages/LoginPage.tsx', content: `import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Eye, EyeOff, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('لطفاً نام کاربری و رمز عبور را وارد کنید'); return; }
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) navigate('/dashboard', { replace: true });
      else setError('نام کاربری یا رمز عبور اشتباه است');
    } catch { setError('خطا در اتصال به سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#1565C0] to-[#0d47a1] p-4">
      <div className="absolute inset-0 opacity-10"><div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div></div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4"><Dumbbell className="w-10 h-10 text-white" /></div>
          <h1 className="text-3xl font-bold text-white mb-2">سیستم مدیریت باشگاه</h1>
          <p className="text-blue-200">برای ورود اطلاعات خود را وارد کنید</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="نام کاربری" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="رمز عبور" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-l from-[#1976D2] to-[#1565C0] text-white font-bold rounded-lg hover:from-[#1565C0] hover:to-[#0d47a1] disabled:opacity-50">
              {loading ? 'در حال ورود...' : 'ورود به سیستم'}
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">اطلاعات ورود: <strong>admin</strong> / <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
` },
  { path: 'src/pages/DashboardPage.tsx', content: `import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_MEMBERS, MOCK_TRAINERS, MOCK_ATTENDANCE } from '../utils/constants';
import { toPersianNumber, formatDate, formatCurrency, getDaysLeft, formatTime } from '../utils/formatters';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const totalMembers = MOCK_MEMBERS.filter(m => m.isActive).length;
  const activeTrainers = MOCK_TRAINERS.filter(t => t.isActive).length;
  const currentInside = MOCK_ATTENDANCE.filter(a => !a.checkOutTime).length;
  const monthlyRevenue = 45000000;
  const expiringMembers = MOCK_MEMBERS.filter(m => m.isActive && getDaysLeft(m.endDate) >= 0 && getDaysLeft(m.endDate) <= 7);
  const chartData = [{ day: 'شنبه', members: 3 }, { day: 'یکشنبه', members: 5 }, { day: 'دوشنبه', members: 2 }, { day: 'سه‌شنبه', members: 7 }, { day: 'چهارشنبه', members: 4 }, { day: 'پنجشنبه', members: 6 }, { day: 'جمعه', members: 1 }];
  const insideMembers = MOCK_ATTENDANCE.filter(a => !a.checkOutTime);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-7 h-7" />} title="کل اعضا" value={toPersianNumber(totalMembers)} color="bg-blue-500" bgColor="bg-blue-50" />
        <StatCard icon={<Dumbbell className="w-7 h-7" />} title="مربیان فعال" value={toPersianNumber(activeTrainers)} color="bg-green-500" bgColor="bg-green-50" />
        <StatCard icon={<MapPin className="w-7 h-7" />} title="افراد حاضر" value={toPersianNumber(currentInside)} color="bg-purple-500" bgColor="bg-purple-50" />
        <StatCard icon={<TrendingUp className="w-7 h-7" />} title="درآمد ماه" value={formatCurrency(monthlyRevenue)} color="bg-orange-500" bgColor="bg-orange-50" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">اعضای جدید (هفته اخیر)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="day" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: '8px', direction: 'rtl' }} formatter={(v: number) => [toPersianNumber(v) + ' نفر', 'اعضا']} /><Bar dataKey="members" fill="#1976D2" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-800">افراد حاضر</h3><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">{toPersianNumber(currentInside)} نفر</span></div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr><th className="px-3 py-2 text-right text-gray-600">ردیف</th><th className="px-3 py-2 text-right text-gray-600">نام</th><th className="px-3 py-2 text-right text-gray-600">زمان ورود</th></tr></thead><tbody>{insideMembers.map((m, i) => (<tr key={m.id} className="border-b border-gray-50"><td className="px-3 py-2 text-gray-600">{toPersianNumber(i + 1)}</td><td className="px-3 py-2 font-medium">{m.memberName}</td><td className="px-3 py-2 text-gray-600">{formatTime(m.checkInTime)}</td></tr>))}</tbody></table>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-orange-500" /><h3 className="text-lg font-bold text-gray-800">اشتراک‌های در حال انقضا</h3></div>
        {expiringMembers.length === 0 ? <p className="text-gray-500 text-center py-4">هیچ اشتراکی منقضی نمی‌شود</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{expiringMembers.map(m => { const d = getDaysLeft(m.endDate); return (<div key={m.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"><div><p className="font-medium text-gray-800">{m.firstName} {m.lastName}</p><p className="text-xs text-gray-500">پایان: {formatDate(m.endDate)}</p></div><span className={\`px-2 py-1 rounded-full text-xs font-bold \${d <= 2 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}\`}>{toPersianNumber(d)} روز</span></div>); })}</div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string; bgColor: string }> = ({ icon, title, value, color, bgColor }) => (
  <div className={\`\${bgColor} rounded-xl p-5 border border-gray-100 shadow-sm\`}><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 mb-1">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div><div className={\`\${color} text-white p-3 rounded-xl\`}>{icon}</div></div></div>
);
export default DashboardPage;
` },
  { path: 'src/pages/RegisterMemberPage.tsx', content: `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, X } from 'lucide-react';
import { MEMBERSHIP_TYPES, GENDER_OPTIONS, MOCK_TRAINERS } from '../utils/constants';
import { getTodayISO, calculateEndDate } from '../utils/formatters';
import { toast } from 'react-toastify';

const RegisterMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ firstName: '', lastName: '', nationalCode: '', phoneNumber: '', membershipType: '', startDate: getTodayISO(), weight: '', gender: '', email: '', address: '', trainerId: '', goals: '', medicalIssues: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'نام الزامی است';
    if (!form.lastName.trim()) e.lastName = 'نام خانوادگی الزامی است';
    if (!form.nationalCode.trim()) e.nationalCode = 'کد ملی الزامی است';
    else if (!/^[0-9]{10}$/.test(form.nationalCode)) e.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'تلفن الزامی است';
    else if (!/^09[0-9]{9}$/.test(form.phoneNumber)) e.phoneNumber = 'فرمت تلفن صحیح نیست';
    if (!form.membershipType) e.membershipType = 'نوع اشتراک الزامی است';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('عضو جدید ثبت شد');
    setLoading(false);
    navigate('/members');
  };

  const endDate = form.membershipType ? calculateEndDate(form.startDate, form.membershipType) : '';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-l from-blue-600 to-blue-800 px-6 py-4"><div className="flex items-center gap-3"><UserPlus className="w-6 h-6 text-white" /><h2 className="text-xl font-bold text-white">ثبت‌نام عضو جدید</h2></div></div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="نام" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
              <Input label="تلفن" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} required dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">نوع شارژ <span className="text-red-500">*</span></label><select name="membershipType" value={form.membershipType} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"><option value="">انتخاب کنید</option>{MEMBERSHIP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select>{errors.membershipType && <p className="text-red-500 text-xs mt-1">{errors.membershipType}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">مربی</label><select name="trainerId" value={form.trainerId} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none"><option value="">بدون مربی</option>{MOCK_TRAINERS.filter(t => t.isActive).map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}</select></div>
              <Input label="ایمیل" name="email" type="email" value={form.email} onChange={handleChange} dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label><textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none" /></div>
            </div>
            <div className="space-y-4">
              <Input label="نام خانوادگی" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
              <Input label="کد ملی" name="nationalCode" value={form.nationalCode} onChange={handleChange} error={errors.nationalCode} required maxLength={10} dir="ltr" />
              <Input label="تاریخ ثبت‌نام" name="startDate" type="date" value={form.startDate} onChange={handleChange} required dir="ltr" />
              <Input label="وزن (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-2">جنسیت</label><div className="flex gap-4">{GENDER_OPTIONS.map(o => <label key={o.value} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value={o.value} checked={form.gender === o.value} onChange={handleChange} className="w-4 h-4 text-blue-600" /><span className="text-sm">{o.label}</span></label>)}</div></div>
              {endDate && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-blue-700">تاریخ پایان: <strong>{new Date(endDate).toLocaleDateString('fa-IR')}</strong></p></div>}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t"><button type="button" onClick={() => navigate('/members')} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><X className="w-4 h-4" />انصراف</button><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? '...' : <><Save className="w-4 h-4" />ثبت عضو</>}</button></div>
        </form>
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; required?: boolean; type?: string; maxLength?: number; dir?: string }> = ({ label, name, value, onChange, error, required, type = 'text', maxLength, dir }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500"> *</span>}</label><input type={type} name={name} value={value} onChange={onChange} maxLength={maxLength} dir={dir} className={\`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 \${error ? 'border-red-400' : 'border-gray-300'}\`} />{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div>
);
export default RegisterMemberPage;
` },
  { path: 'src/pages/RegisterTrainerPage.tsx', content: `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Save, X } from 'lucide-react';
import { EMPLOYMENT_TYPES, GENDER_OPTIONS, SPECIALTIES } from '../utils/constants';
import { toast } from 'react-toastify';

const RegisterTrainerPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ firstName: '', lastName: '', nationalCode: '', phoneNumber: '', specialty: '', experienceYears: '', employmentType: '', baseSalary: '', pricePerSession: '', gender: '', email: '', address: '', certificates: '', bio: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'نام الزامی';
    if (!form.lastName.trim()) e.lastName = 'نام خانوادگی الزامی';
    if (!form.nationalCode.trim() || !/^[0-9]{10}$/.test(form.nationalCode)) e.nationalCode = 'کد ملی ۱۰ رقم';
    if (!form.phoneNumber.trim() || !/^09[0-9]{9}$/.test(form.phoneNumber)) e.phoneNumber = 'تلفن صحیح نیست';
    if (!form.specialty) e.specialty = 'تخصص الزامی';
    if (!form.experienceYears) e.experienceYears = 'سابقه الزامی';
    if (!form.employmentType) e.employmentType = 'نوع استخدام الزامی';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('مربی ثبت شد');
    setLoading(false);
    navigate('/trainers');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-l from-green-600 to-green-800 px-6 py-4"><div className="flex items-center gap-3"><Dumbbell className="w-6 h-6 text-white" /><h2 className="text-xl font-bold text-white">ثبت‌نام مربی جدید</h2></div></div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="نام" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
              <Input label="تلفن" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} required dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">تخصص <span className="text-red-500">*</span></label><select name="specialty" value={form.specialty} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"><option value="">انتخاب</option>{SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}</select>{errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}</div>
              <Input label="ایمیل" name="email" value={form.email} onChange={handleChange} dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-2">جنسیت</label><div className="flex gap-4">{GENDER_OPTIONS.map(o => <label key={o.value} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value={o.value} checked={form.gender === o.value} onChange={handleChange} className="w-4 h-4 text-green-600" /><span className="text-sm">{o.label}</span></label>)}</div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label><textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">بیوگرافی</label><textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none" /></div>
            </div>
            <div className="space-y-4">
              <Input label="نام خانوادگی" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
              <Input label="کد ملی" name="nationalCode" value={form.nationalCode} onChange={handleChange} error={errors.nationalCode} required maxLength={10} dir="ltr" />
              <Input label="سابقه (سال)" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} error={errors.experienceYears} required dir="ltr" />
              <div><label className="block text-sm font-medium text-gray-700 mb-1">نوع استخدام <span className="text-red-500">*</span></label><select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"><option value="">انتخاب</option>{EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select>{errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType}</p>}</div>
              <Input label="حقوق پایه" name="baseSalary" type="number" value={form.baseSalary} onChange={handleChange} dir="ltr" />
              <Input label="قیمت هر جلسه" name="pricePerSession" type="number" value={form.pricePerSession} onChange={handleChange} dir="ltr" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t"><button type="button" onClick={() => navigate('/trainers')} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><X className="w-4 h-4" />انصراف</button><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? '...' : <><Save className="w-4 h-4" />ثبت مربی</>}</button></div>
        </form>
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; required?: boolean; type?: string; maxLength?: number; dir?: string }> = ({ label, name, value, onChange, error, required, type = 'text', maxLength, dir }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500"> *</span>}</label><input type={type} name={name} value={value} onChange={onChange} maxLength={maxLength} dir={dir} className={\`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 \${error ? 'border-red-400' : 'border-gray-300'}\`} />{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div>
);
export default RegisterTrainerPage;
` },
  { path: 'src/pages/MemberListPage.tsx', content: `import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, RefreshCw, X } from 'lucide-react';
import { MOCK_MEMBERS, MEMBERSHIP_TYPES } from '../utils/constants';
import { toPersianNumber, formatDate, calculateEndDate } from '../utils/formatters';
import { toast } from 'react-toastify';

const MemberListPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editModal, setEditModal] = useState<any>(null);
  const [renewModal, setRenewModal] = useState<any>(null);

  const filtered = useMemo(() => members.filter(m => {
    const s = m.firstName.includes(search) || m.lastName.includes(search) || m.phoneNumber.includes(search) || m.nationalCode.includes(search);
    const f = filter === 'all' || (filter === 'active' && m.isActive) || (filter === 'inactive' && !m.isActive);
    return s && f;
  }), [members, search, filter]);

  const getLabel = (t: string) => MEMBERSHIP_TYPES.find(x => x.value === t)?.label || t;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..." className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500" /></div>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"><option value="all">همه</option><option value="active">فعال</option><option value="inactive">غیرفعال</option></select>
          </div>
          <button onClick={() => navigate('/members/register')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"><Plus className="w-4 h-4" />ثبت عضو جدید</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-right text-gray-600">#</th><th className="px-4 py-3 text-right text-gray-600">نام</th><th className="px-4 py-3 text-right text-gray-600">فامیلی</th><th className="px-4 py-3 text-right text-gray-600">تلفن</th><th className="px-4 py-3 text-right text-gray-600">اشتراک</th><th className="px-4 py-3 text-right text-gray-600">پایان</th><th className="px-4 py-3 text-right text-gray-600">وضعیت</th><th className="px-4 py-3 text-center text-gray-600">عملیات</th></tr></thead>
            <tbody>{filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">یافت نشد</td></tr> : filtered.map((m, i) => (<tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="px-4 py-3 text-gray-600">{toPersianNumber(i + 1)}</td><td className="px-4 py-3 font-medium">{m.firstName}</td><td className="px-4 py-3">{m.lastName}</td><td className="px-4 py-3">{toPersianNumber(m.phoneNumber)}</td><td className="px-4 py-3">{getLabel(m.membershipType)}</td><td className="px-4 py-3">{formatDate(m.endDate)}</td><td className="px-4 py-3">{m.isActive ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">فعال</span> : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">غیرفعال</span>}</td><td className="px-4 py-3"><div className="flex justify-center gap-1"><button onClick={() => setEditModal(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit3 className="w-4 h-4" /></button><button onClick={() => setRenewModal(m)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><RefreshCw className="w-4 h-4" /></button><button onClick={() => { setMembers(p => p.map(x => x.id === m.id ? { ...x, isActive: false } : x)); toast.success('حذف شد'); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">مجموع: {toPersianNumber(filtered.length)} عضو</div>
      </div>
      {editModal && <Modal title="ویرایش عضو" onClose={() => setEditModal(null)}><div className="space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="text-sm text-gray-600">نام</label><input value={editModal.firstName} onChange={e => setEditModal({ ...editModal, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div><div><label className="text-sm text-gray-600">فامیلی</label><input value={editModal.lastName} onChange={e => setEditModal({ ...editModal, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div><div><label className="text-sm text-gray-600">تلفن</label><input value={editModal.phoneNumber} onChange={e => setEditModal({ ...editModal, phoneNumber: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" /></div><div><label className="text-sm text-gray-600">ایمیل</label><input value={editModal.email} onChange={e => setEditModal({ ...editModal, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" /></div></div><div className="flex justify-end gap-2 pt-3 border-t"><button onClick={() => setEditModal(null)} className="px-4 py-2 border rounded-lg text-sm">انصراف</button><button onClick={() => { setMembers(p => p.map(x => x.id === editModal.id ? editModal : x)); setEditModal(null); toast.success('بروزرسانی شد'); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">ذخیره</button></div></div></Modal>}
      {renewModal && <RenewModal member={renewModal} onClose={() => setRenewModal(null)} onSave={(u) => { setMembers(p => p.map(x => x.id === u.id ? u : x)); setRenewModal(null); toast.success('تمدید شد'); }} />}
    </div>
  );
};

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={onClose} /><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fadeIn"><div className="border-b px-6 py-4 flex justify-between"><h3 className="font-bold text-lg">{title}</h3><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button></div><div className="p-6">{children}</div></div></div>
);

const RenewModal: React.FC<{ member: any; onClose: () => void; onSave: (m: any) => void }> = ({ member, onClose, onSave }) => {
  const [type, setType] = useState(member.membershipType);
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
  const end = calculateEndDate(start, type);
  return (
    <Modal title="تمدید اشتراک" onClose={onClose}>
      <div className="space-y-4">
        <div><label className="text-sm text-gray-600">نوع اشتراک</label><select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{MEMBERSHIP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
        <div><label className="text-sm text-gray-600">تاریخ شروع</label><input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" /></div>
        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">پایان: <strong>{new Date(end).toLocaleDateString('fa-IR')}</strong></div>
        <div className="flex justify-end gap-2 pt-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">انصراف</button><button onClick={() => onSave({ ...member, membershipType: type, startDate: start, endDate: end, isActive: true })} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">تمدید</button></div>
      </div>
    </Modal>
  );
};
export default MemberListPage;
` },
  { path: 'src/pages/TrainerListPage.tsx', content: `import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { MOCK_TRAINERS, EMPLOYMENT_TYPES } from '../utils/constants';
import { toPersianNumber } from '../utils/formatters';
import { toast } from 'react-toastify';

const TrainerListPage: React.FC = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState(MOCK_TRAINERS);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<any>(null);

  const filtered = useMemo(() => trainers.filter(t => t.firstName.includes(search) || t.lastName.includes(search) || t.specialty.includes(search)), [trainers, search]);
  const getLabel = (t: string) => EMPLOYMENT_TYPES.find(x => x.value === t)?.label || t;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3 items-center justify-between">
          <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..." className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" /></div>
          <button onClick={() => navigate('/trainers/register')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"><Plus className="w-4 h-4" />ثبت مربی</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-right text-gray-600">#</th><th className="px-4 py-3 text-right text-gray-600">نام</th><th className="px-4 py-3 text-right text-gray-600">فامیلی</th><th className="px-4 py-3 text-right text-gray-600">تخصص</th><th className="px-4 py-3 text-right text-gray-600">سابقه</th><th className="px-4 py-3 text-right text-gray-600">استخدام</th><th className="px-4 py-3 text-right text-gray-600">وضعیت</th><th className="px-4 py-3 text-center text-gray-600">عملیات</th></tr></thead>
            <tbody>{filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">یافت نشد</td></tr> : filtered.map((t, i) => (<tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="px-4 py-3">{toPersianNumber(i + 1)}</td><td className="px-4 py-3 font-medium">{t.firstName}</td><td className="px-4 py-3">{t.lastName}</td><td className="px-4 py-3">{t.specialty}</td><td className="px-4 py-3">{toPersianNumber(t.experienceYears)}</td><td className="px-4 py-3">{getLabel(t.employmentType)}</td><td className="px-4 py-3">{t.isActive ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">فعال</span> : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">غیرفعال</span>}</td><td className="px-4 py-3"><div className="flex justify-center gap-1"><button onClick={() => setEditModal(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit3 className="w-4 h-4" /></button><button onClick={() => { setTrainers(p => p.map(x => x.id === t.id ? { ...x, isActive: !x.isActive } : x)); toast.success('تغییر وضعیت'); }} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded">{t.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}</button><button onClick={() => { setTrainers(p => p.map(x => x.id === t.id ? { ...x, isActive: false } : x)); toast.success('حذف شد'); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">مجموع: {toPersianNumber(filtered.length)} مربی</div>
      </div>
      {editModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setEditModal(null)} /><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fadeIn"><div className="border-b px-6 py-4 flex justify-between"><h3 className="font-bold text-lg">ویرایش مربی</h3><button onClick={() => setEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="text-sm text-gray-600">نام</label><input value={editModal.firstName} onChange={e => setEditModal({ ...editModal, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div><div><label className="text-sm text-gray-600">فامیلی</label><input value={editModal.lastName} onChange={e => setEditModal({ ...editModal, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div><div><label className="text-sm text-gray-600">تلفن</label><input value={editModal.phoneNumber} onChange={e => setEditModal({ ...editModal, phoneNumber: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" /></div><div><label className="text-sm text-gray-600">تخصص</label><input value={editModal.specialty} onChange={e => setEditModal({ ...editModal, specialty: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div></div><div className="flex justify-end gap-2 pt-3 border-t"><button onClick={() => setEditModal(null)} className="px-4 py-2 border rounded-lg text-sm">انصراف</button><button onClick={() => { setTrainers(p => p.map(x => x.id === editModal.id ? editModal : x)); setEditModal(null); toast.success('بروزرسانی شد'); }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">ذخیره</button></div></div></div></div>}
    </div>
  );
};
export default TrainerListPage;
` },
  { path: 'src/pages/CurrentStatusPage.tsx', content: `import React, { useState } from 'react';
import { MapPin, Search, LogIn, LogOut, X, Clock, Users } from 'lucide-react';
import { MOCK_MEMBERS, MOCK_ATTENDANCE } from '../utils/constants';
import { toPersianNumber, formatTime, getDuration } from '../utils/formatters';
import { toast } from 'react-toastify';

const CurrentStatusPage: React.FC = () => {
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [showModal, setShowModal] = useState(false);
  const [checkoutId, setCheckoutId] = useState<number | null>(null);
  const inside = attendance.filter(a => !a.checkOutTime);

  const handleCheckOut = (id: number) => {
    setAttendance(p => p.map(a => a.id === id ? { ...a, checkOutTime: new Date().toISOString() } : a));
    setCheckoutId(null);
    toast.success('خروج ثبت شد');
  };

  const handleCheckIn = (memberId: number, name: string) => {
    setAttendance(p => [...p, { id: Date.now(), memberId, memberName: name, checkInTime: new Date().toISOString(), checkOutTime: null, type: 'Manual' }]);
    setShowModal(false);
    toast.success(\`\${name} وارد شد\`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-l from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="bg-white/20 p-3 rounded-xl"><Users className="w-8 h-8" /></div><div><h2 className="text-2xl font-bold">افراد حاضر</h2><p className="text-purple-200">وضعیت لحظه‌ای</p></div></div>
          <div className="text-center"><p className="text-4xl font-bold">{toPersianNumber(inside.length)}</p><p className="text-purple-200 text-sm">نفر</p></div>
        </div>
      </div>
      <div className="flex justify-end"><button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><LogIn className="w-4 h-4" />ثبت ورود</button></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-right text-gray-600">#</th><th className="px-4 py-3 text-right text-gray-600">نام</th><th className="px-4 py-3 text-right text-gray-600">ورود</th><th className="px-4 py-3 text-right text-gray-600">مدت</th><th className="px-4 py-3 text-center text-gray-600">عملیات</th></tr></thead>
            <tbody>{inside.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500"><MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />خالی</td></tr> : inside.map((r, i) => (<tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="px-4 py-3">{toPersianNumber(i + 1)}</td><td className="px-4 py-3 font-medium">{r.memberName}</td><td className="px-4 py-3 flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(r.checkInTime)}</td><td className="px-4 py-3">{getDuration(r.checkInTime)}</td><td className="px-4 py-3 text-center"><button onClick={() => setCheckoutId(r.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs">خروج</button></td></tr>))}</tbody>
          </table>
        </div>
      </div>
      {showModal && <CheckInModal onClose={() => setShowModal(false)} onCheckIn={handleCheckIn} existing={inside.map(m => m.memberId)} />}
      {checkoutId !== null && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setCheckoutId(null)} /><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center"><div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><LogOut className="w-8 h-8 text-orange-500" /></div><p className="mb-6">ثبت خروج تایید شود؟</p><div className="flex justify-center gap-3"><button onClick={() => setCheckoutId(null)} className="px-4 py-2 border rounded-lg">انصراف</button><button onClick={() => handleCheckOut(checkoutId)} className="px-4 py-2 bg-orange-600 text-white rounded-lg">خروج</button></div></div></div>}
    </div>
  );
};

const CheckInModal: React.FC<{ onClose: () => void; onCheckIn: (id: number, name: string) => void; existing: number[] }> = ({ onClose, onCheckIn, existing }) => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<typeof MOCK_MEMBERS>([]);
  const [searched, setSearched] = useState(false);
  const handleSearch = () => { const r = MOCK_MEMBERS.filter(m => (m.phoneNumber.includes(q) || m.nationalCode.includes(q)) && m.isActive); setResults(r); setSearched(true); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={onClose} /><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn"><div className="border-b px-6 py-4 flex justify-between"><h3 className="font-bold text-lg">ثبت ورود</h3><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-4"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="تلفن یا کد ملی..." className="w-full pr-10 pl-4 py-2 border rounded-lg text-sm" dir="ltr" /></div><button onClick={handleSearch} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">جستجو</button></div>{searched && <div className="space-y-2">{results.length === 0 ? <p className="text-center text-gray-500 py-4">یافت نشد</p> : results.map(m => (<div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{m.firstName} {m.lastName}</p><p className="text-xs text-gray-500">{m.phoneNumber}</p></div>{existing.includes(m.id) ? <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">حاضر</span> : <button onClick={() => onCheckIn(m.id, \`\${m.firstName} \${m.lastName}\`)} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs">ورود</button>}</div>))}</div>}</div></div></div>
  );
};
export default CurrentStatusPage;
` },
  { path: 'src/pages/NotFoundPage.tsx', content: `import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6"><AlertTriangle className="w-12 h-12 text-red-500" /></div>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">۴۰۴</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">صفحه یافت نشد</h2>
      <p className="text-gray-500 mb-8">صفحه مورد نظر وجود ندارد.</p>
      <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Home className="w-5 h-5" />بازگشت</Link>
    </div>
  </div>
);
export default NotFoundPage;
` },
];

const DownloadPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedFile, setExpandedFile] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      PROJECT_FILES.forEach(file => { zip.file(file.path, file.content); });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'gym-management.zip');
    } catch (err) { console.error(err); }
    setDownloading(false);
  };

  const gitCommands = `# 1. ابتدا فایل ZIP را دانلود و Extract کنید
# 2. به پوشه پروژه بروید
cd gym-management

# 3. نصب وابستگی‌ها
npm install

# 4. مقداردهی Git
git init
git add .
git commit -m "Initial commit: Gym Management System"

# 5. اتصال به ریپازیتوری (نام کاربری خود را جایگزین کنید)
git remote add origin https://github.com/YOUR-USERNAME/gym.git
git branch -M main
git push -u origin main`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-l from-[#1a237e] via-[#1565C0] to-[#0d47a1] rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Download className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">دانلود سورس‌کد پروژه</h1>
                <p className="text-blue-200 mt-2 text-lg">سیستم مدیریت باشگاه بدنسازی</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={downloadZip}
                disabled={downloading}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-700 rounded-2xl hover:bg-blue-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    در حال ساخت فایل ZIP...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    دانلود فایل ZIP (همه فایل‌ها)
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{PROJECT_FILES.length}</p>
                <p className="text-xs text-blue-200">فایل</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-blue-200">صفحه</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">React</p>
                <p className="text-xs text-blue-200">فریمورک</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">TypeScript</p>
                <p className="text-xs text-blue-200">زبان</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 w-10 h-10 rounded-xl flex items-center justify-center text-xl">📋</span>
            مراحل آپلود در GitHub
          </h2>
          
          <div className="space-y-6">
            {[
              { n: 1, icon: '📦', title: 'دانلود فایل ZIP', desc: 'روی دکمه آبی بالا کلیک کنید تا فایل ZIP دانلود شود.' },
              { n: 2, icon: '📂', title: 'Extract کردن فایل', desc: 'فایل ZIP را از حالت فشرده خارج کنید (کلیک راست → Extract).' },
              { n: 3, icon: '💻', title: 'باز کردن Terminal', desc: 'در پوشه Extract شده، Terminal یا CMD را باز کنید.' },
              { n: 4, icon: '⚡', title: 'اجرای دستورات Git', desc: 'دستورات زیر را کپی و در Terminal اجرا کنید:' },
              { n: 5, icon: '🚀', title: 'تمام!', desc: 'فایل‌ها در ریپازیتوری gym شما آپلود شدند!' },
            ].map(step => (
              <div key={step.n} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.n}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{step.desc}</p>
                  {step.n === 4 && (
                    <div className="mt-3 bg-gray-900 rounded-xl p-4 overflow-x-auto shadow-inner" dir="ltr">
                      <pre className="text-green-400 text-sm font-mono whitespace-pre">{gitCommands}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Method */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            روش ساده‌تر: آپلود مستقیم از سایت GitHub
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex gap-3 items-start">
              <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <p>به ریپازیتوری <strong className="text-green-700">gym</strong> خود در GitHub بروید</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <p>روی <strong className="text-green-700">"Add file"</strong> → <strong className="text-green-700">"Upload files"</strong> کلیک کنید</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <p>فایل‌های Extract شده را <strong className="text-green-700">Drag & Drop</strong> کنید</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <p>پیام کامیت بنویسید و <strong className="text-green-700">"Commit changes"</strong> را بزنید</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg"
          >
            <Github className="w-5 h-5" />
            باز کردن GitHub
            <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-lg">
            <span className="text-2xl">⚠️</span>
            نکات مهم
          </h3>
          <ul className="text-amber-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>به جای <code className="bg-amber-100 px-2 py-0.5 rounded font-mono" dir="ltr">YOUR-USERNAME</code> نام کاربری GitHub خود را بنویسید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>فایل <code className="bg-amber-100 px-2 py-0.5 rounded font-mono" dir="ltr">node_modules</code> را آپلود نکنید (در .gitignore هست)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>بعد از clone، دستور <code className="bg-amber-100 px-2 py-0.5 rounded font-mono" dir="ltr">npm install</code> را اجرا کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>اطلاعات ورود: <strong>admin</strong> / <strong>admin123</strong></span>
            </li>
          </ul>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-l from-gray-800 to-gray-900 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FolderOpen className="w-6 h-6" />
              فایل‌های پروژه ({PROJECT_FILES.length} فایل)
            </h2>
            <p className="text-gray-400 text-sm mt-1">روی هر فایل کلیک کنید تا محتوای آن را ببینید</p>
          </div>
          <div className="divide-y divide-gray-100">
            {PROJECT_FILES.map((file, index) => (
              <div key={file.path} className="hover:bg-gray-50 transition-colors">
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  onClick={() => setExpandedFile(expandedFile === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="font-mono text-sm font-medium text-gray-700" dir="ltr">{file.path}</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">({file.content.length} کاراکتر)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(file.content, index); }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedIndex === index ? 'کپی شد!' : 'کپی'}
                    </button>
                    {expandedFile === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {expandedFile === index && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <pre className="p-6 overflow-x-auto text-xs leading-relaxed max-h-96 overflow-y-auto" dir="ltr">
                      <code className="text-gray-700 font-mono">{file.content}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>ساخته شده با ❤️ | React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
