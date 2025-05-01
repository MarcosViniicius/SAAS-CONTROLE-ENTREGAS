import  { Entregador } from '../types';

// Inicializar dados
const initializeData = () => {
  if (!localStorage.getItem('entregadores')) {
    localStorage.setItem('entregadores', JSON.stringify([]));
  }
};

initializeData();

export const listarEntregadores = async (empresaId: number): Promise<Entregador[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
      resolve(entregadores.filter((e: Entregador) => e.empresaId === empresaId));
    }, 300);
  });
};

export const obterEntregador = async (id: number): Promise<Entregador> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
      const entregador = entregadores.find((e: Entregador) => e.id === id);
      
      if (entregador) {
        resolve(entregador);
      } else {
        reject(new Error('Entregador não encontrado'));
      }
    }, 300);
  });
};

export const criarEntregador = async (data: Omit<Entregador, 'id'>): Promise<Entregador> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
      const novoEntregador = {
        ...data,
        id: Date.now()
      };
      
      entregadores.push(novoEntregador);
      localStorage.setItem('entregadores', JSON.stringify(entregadores));
      
      resolve(novoEntregador);
    }, 300);
  });
};

export const atualizarEntregador = async (id: number, data: Partial<Entregador>): Promise<Entregador> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
      const index = entregadores.findIndex((e: Entregador) => e.id === id);
      
      if (index !== -1) {
        entregadores[index] = { ...entregadores[index], ...data };
        localStorage.setItem('entregadores', JSON.stringify(entregadores));
        resolve(entregadores[index]);
      } else {
        reject(new Error('Entregador não encontrado'));
      }
    }, 300);
  });
};

export const excluirEntregador = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
      const index = entregadores.findIndex((e: Entregador) => e.id === id);
      
      if (index !== -1) {
        entregadores.splice(index, 1);
        localStorage.setItem('entregadores', JSON.stringify(entregadores));
        resolve();
      } else {
        reject(new Error('Entregador não encontrado'));
      }
    }, 300);
  });
};
 