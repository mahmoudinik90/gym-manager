import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

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
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // بارگذاری اولیه از localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('gym_token');
    const storedUser = localStorage.getItem('gym_user');
    if (storedToken && storedUser) {
      try {
        dispatch({
          type: 'INITIALIZE',
          payload: { user: JSON.parse(storedUser), token: storedToken },
        });
      } catch {
        localStorage.removeItem('gym_token');
        localStorage.removeItem('gym_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // شبیه‌سازی درخواست API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // اعتبارسنجی نمونه (admin/admin123)
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

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
