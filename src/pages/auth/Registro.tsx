import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registro } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registro(nome, email, senha);
      navigate('/app');
    } catch (error: any) {
      setError(error.message || 'Erro ao registrar. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="nome" className="form-label">
            Nome da Empresa
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="form-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="senha" className="form-label">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            required
            className="form-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="confirmarSenha" className="form-label">
            Confirmar Senha
          </label>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            autoComplete="new-password"
            required
            className="form-input"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar Empresa'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Já tem uma conta?
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
 