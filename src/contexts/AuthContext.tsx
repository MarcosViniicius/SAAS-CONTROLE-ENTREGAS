import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Empresa } from '../types';
import { loginService, registroService, obterEmpresaAtual } from '../services/authService';

interface AuthContextType {
  user: Usuario | null;
  empresa: Empresa | null;
  login: (email: string, senha: string) => Promise<void>;
  registro: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      obterEmpresaAtual(parsedUser.empresaId)
        .then(empresaData => {
          setEmpresa(empresaData);
        })
        .catch(error => console.error('Erro ao buscar empresa:', error))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const userData = await loginService(email, senha);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      const empresaData = await obterEmpresaAtual(userData.empresaId);
      setEmpresa(empresaData);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registro = async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const userData = await registroService(nome, email, senha);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      const empresaData = await obterEmpresaAtual(userData.empresaId);
      setEmpresa(empresaData);
    } catch (error) {
      console.error('Erro ao realizar registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setEmpresa(null);
  };

  return (
    <AuthContext.Provider value={{ user, empresa, login, registro, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
 