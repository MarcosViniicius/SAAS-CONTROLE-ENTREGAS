import  { Usuario, Empresa } from '../types';

// Simulação de usuários/empresas em localStorage
const initializeData = () => {
  if (!localStorage.getItem('empresas')) {
    localStorage.setItem('empresas', JSON.stringify([]));
  }
  if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify([]));
  }
};

initializeData();

// Hash simples para senhas (em produção usar bcrypt)
const hashSenha = (senha: string): string => {
  return btoa(senha); // Base64 encoder (apenas para demonstração)
};

// Funções de autenticação
export const loginService = async (email: string, senha: string): Promise<Usuario> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find(
        (u: any) => u.email === email && u.senhaHash === hashSenha(senha)
      );
      
      if (usuario) {
        resolve({
          id: usuario.id,
          email: usuario.email,
          empresaId: usuario.empresaId
        });
      } else {
        reject(new Error('Email ou senha incorretos'));
      }
    }, 500);
  });
};

export const registroService = async (
  nome: string,
  email: string,
  senha: string
): Promise<Usuario> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      
      // Verificar se o email já está em uso
      if (usuarios.some((u: any) => u.email === email)) {
        reject(new Error('Email já está em uso'));
        return;
      }
      
      // Criar nova empresa
      const novaEmpresa = {
        id: Date.now(),
        nome,
        email
      };
      
      // Criar novo usuário
      const novoUsuario = {
        id: Date.now() + 1,
        email,
        senhaHash: hashSenha(senha),
        empresaId: novaEmpresa.id
      };
      
      // Salvar dados
      empresas.push(novaEmpresa);
      usuarios.push(novoUsuario);
      
      localStorage.setItem('empresas', JSON.stringify(empresas));
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      resolve({
        id: novoUsuario.id,
        email: novoUsuario.email,
        empresaId: novoUsuario.empresaId
      });
    }, 500);
  });
};

export const obterEmpresaAtual = async (empresaId: number): Promise<Empresa> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
      const empresa = empresas.find((e: any) => e.id === empresaId);
      
      if (empresa) {
        resolve({
          id: empresa.id,
          nome: empresa.nome,
          email: empresa.email
        });
      } else {
        reject(new Error('Empresa não encontrada'));
      }
    }, 200);
  });
};
 