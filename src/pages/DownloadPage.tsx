import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, FolderOpen } from 'lucide-react';

// لیست تمام فایل‌های پروژه با محتوایشان
const PROJECT_FILES: { path: string; content: string; lang: string }[] = [
  {
    path: 'index.html',
    lang: 'html',
    content: `<!doctype html>
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
</html>`
  },
  {
    path: 'package.json',
    lang: 'json',
    content: `{
  "name": "gym-management",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "react-toastify": "^9.1.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}`
  },
  {
    path: 'vite.config.ts',
    lang: 'typescript',
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
  },
  {
    path: 'tsconfig.json',
    lang: 'json',
    content: `{
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
}`
  },
  {
    path: 'tailwind.config.js',
    lang: 'javascript',
    content: `/** @type {import('tailwindcss').Config} */
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
}`
  },
  {
    path: 'src/index.css',
    lang: 'css',
    content: `@tailwind base;
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
::-webkit-scrollbar-thumb:hover { background: #555; }

.Toastify__toast-container { direction: rtl; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }`
  },
  {
    path: 'src/main.tsx',
    lang: 'typescript',
    content: `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`
  },
  {
    path: 'src/App.tsx',
    lang: 'typescript',
    content: `import React from 'react';
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
export default App;`
  },
];

const DownloadPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedFile, setExpandedFile] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAllAsText = () => {
    let allContent = '';
    PROJECT_FILES.forEach(file => {
      allContent += `\n${'='.repeat(60)}\n`;
      allContent += `📄 فایل: ${file.path}\n`;
      allContent += `${'='.repeat(60)}\n\n`;
      allContent += file.content;
      allContent += '\n\n';
    });

    const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gym-management-source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleFile = (file: typeof PROJECT_FILES[0]) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">📦 دانلود سورس‌کد پروژه</h1>
          <p className="text-blue-200 mb-4">سیستم مدیریت باشگاه بدنسازی - React + Vite + Tailwind</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadAllAsText}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              دانلود همه فایل‌ها (TXT)
            </button>
          </div>
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">
              💡 <strong>راهنما:</strong> روی هر فایل کلیک کنید تا محتوای آن را ببینید. سپس با دکمه کپی یا دانلود آن را دریافت کنید.
            </p>
          </div>
        </div>

        {/* Installation Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 راهنمای نصب و اجرا</h2>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto" dir="ltr">
            <p className="text-gray-400"># 1. ایجاد پروژه</p>
            <p>npm create vite@latest gym-frontend -- --template react-ts</p>
            <p>cd gym-frontend</p>
            <p className="mt-2 text-gray-400"># 2. نصب پکیج‌ها</p>
            <p>npm install react-router-dom recharts lucide-react react-toastify date-fns</p>
            <p>npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom</p>
            <p>npx tailwindcss init -p</p>
            <p className="mt-2 text-gray-400"># 3. کپی فایل‌ها از این صفحه به پروژه</p>
            <p className="mt-2 text-gray-400"># 4. اجرا</p>
            <p>npm run dev</p>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            فایل‌های پروژه ({PROJECT_FILES.length} فایل)
          </h2>

          {PROJECT_FILES.map((file, index) => (
            <div key={file.path} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* File Header */}
              <div
                className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedFile(expandedFile === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-blue-500" />
                  <span className="font-mono text-sm font-medium text-gray-700" dir="ltr">{file.path}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{file.lang}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(file.content, index); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedIndex === index ? 'کپی شد!' : 'کپی'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadSingleFile(file); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    دانلود
                  </button>
                </div>
              </div>

              {/* File Content */}
              {expandedFile === index && (
                <div className="border-t border-gray-100">
                  <pre className="p-4 overflow-x-auto text-xs leading-relaxed bg-gray-50 max-h-96 overflow-y-auto" dir="ltr">
                    <code className="text-gray-700">{file.content}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ توجه مهم</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>این صفحه شامل فایل‌های اصلی پروژه است. فایل‌های صفحات (Pages) در وب‌اپلیکیشن اصلی قابل مشاهده هستند.</li>
            <li>برای پروژه کامل، تمام فایل‌های <code className="bg-yellow-100 px-1 rounded">src/pages/</code> و <code className="bg-yellow-100 px-1 rounded">src/components/</code> و <code className="bg-yellow-100 px-1 rounded">src/context/</code> و <code className="bg-yellow-100 px-1 rounded">src/utils/</code> را از سورس‌کد اصلی کپی کنید.</li>
            <li>اطلاعات ورود: <strong>admin / admin123</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
