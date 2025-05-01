import  { Entrega, StatusEntrega } from '../types';

// Inicializar dados
const initializeData = () => {
  if (!localStorage.getItem('entregas')) {
    localStorage.setItem('entregas', JSON.stringify([]));
  }
};

initializeData();

export const listarEntregas = async (
  empresaId: number,
  filtros?: {
    status?: StatusEntrega[];
    entregadorId?: number;
  }
): Promise<Entrega[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
      let resultado = entregas.filter((e: Entrega) => e.empresaId === empresaId);
      
      if (filtros?.status) {
        resultado = resultado.filter((e: Entrega) => filtros.status?.includes(e.status));
      }
      
      if (filtros?.entregadorId) {
        resultado = resultado.filter((e: Entrega) => e.entregadorId === filtros.entregadorId);
      }
      
      resolve(resultado);
    }, 300);
  });
};

export const obterEntrega = async (id: number): Promise<Entrega> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
      const entrega = entregas.find((e: Entrega) => e.id === id);
      
      if (entrega) {
        resolve(entrega);
      } else {
        reject(new Error('Entrega não encontrada'));
      }
    }, 300);
  });
};

export const criarEntrega = async (data: Omit<Entrega, 'id'>): Promise<Entrega> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
      const novaEntrega = {
        ...data,
        id: Date.now()
      };
      
      entregas.push(novaEntrega);
      localStorage.setItem('entregas', JSON.stringify(entregas));
      
      resolve(novaEntrega);
    }, 300);
  });
};

export const atualizarEntrega = async (id: number, data: Partial<Entrega>): Promise<Entrega> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
      const index = entregas.findIndex((e: Entrega) => e.id === id);
      
      if (index !== -1) {
        entregas[index] = { ...entregas[index], ...data };
        localStorage.setItem('entregas', JSON.stringify(entregas));
        resolve(entregas[index]);
      } else {
        reject(new Error('Entrega não encontrada'));
      }
    }, 300);
  });
};

export const atualizarStatusEntrega = async (id: number, status: StatusEntrega): Promise<Entrega> => {
  return atualizarEntrega(id, { status });
};

export const excluirEntrega = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
      const index = entregas.findIndex((e: Entrega) => e.id === id);
      
      if (index !== -1) {
        entregas.splice(index, 1);
        localStorage.setItem('entregas', JSON.stringify(entregas));
        resolve();
      } else {
        reject(new Error('Entrega não encontrada'));
      }
    }, 300);
  });
};
 