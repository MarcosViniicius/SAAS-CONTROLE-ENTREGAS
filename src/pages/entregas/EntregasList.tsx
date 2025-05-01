import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus, Edit, Clipboard, CheckCircle, X } from 'lucide-react';
import { Entrega, Entregador, StatusEntrega } from '../../types';
import { listarEntregas, atualizarStatusEntrega } from '../../services/entregasService';
import { listarEntregadores } from '../../services/entregadoresService';

export default function EntregasList() {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [entregasData, entregadoresData] = await Promise.all([
            listarEntregas(user.empresaId, {
              status: ['Pendente', 'Em Rota']
            }),
            listarEntregadores(user.empresaId)
          ]);
          
          // Adicionar nome do entregador às entregas
          const entregasComEntregador = entregasData.map(entrega => {
            const entregador = entregadoresData.find(e => e.id === entrega.entregadorId);
            return {
              ...entrega,
              entregador
            };
          });
          
          setEntregas(entregasComEntregador);
          setEntregadores(entregadoresData);
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleStatusChange = async (id: number, novoStatus: StatusEntrega) => {
    try {
      await atualizarStatusEntrega(id, novoStatus);
      
      if (novoStatus === 'Concluída' || novoStatus === 'Cancelada') {
        // Remover da lista se concluída ou cancelada
        setEntregas(entregas.filter(e => e.id !== id));
      } else {
        // Atualizar status na lista
        setEntregas(entregas.map(e => 
          e.id === id ? { ...e, status: novoStatus } : e
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
  
  const getEntregadorNome = (entregadorId: number) => {
    const entregador = entregadores.find(e => e.id === entregadorId);
    return entregador ? entregador.nome : 'Desconhecido';
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando entregas...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2 h-6 w-6" />
            Entregas Ativas
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie as entregas pendentes e em rota.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to="/app/entregas/historico"
            className="btn btn-outline flex items-center"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Histórico
          </Link>
          <Link
            to="/app/entregas/novo"
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Entrega
          </Link>
        </div>
      </div>
      
      {entregas.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entregador
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entregas.map((entrega) => (
                <tr key={entrega.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{entrega.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entrega.endereco}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {entrega.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entrega.formaPagamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entrega.entregador?.nome || 'Não atribuído'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${entrega.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${entrega.status === 'Em Rota' ? 'bg-orange-100 text-orange-800' : ''}
                      ${entrega.status === 'Concluída' ? 'bg-green-100 text-green-800' : ''}
                      ${entrega.status === 'Cancelada' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {entrega.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/app/entregas/editar/${entrega.id}`}
                        className="text-primary hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      
                      {entrega.status === 'Pendente' && (
                        <button
                          onClick={() => handleStatusChange(entrega.id, 'Em Rota')}
                          className="text-orange-600 hover:text-orange-800"
                          title="Marcar como Em Rota"
                        >
                          <Package className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleStatusChange(entrega.id, 'Concluída')}
                        className="text-green-600 hover:text-green-800"
                        title="Marcar como Concluída"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleStatusChange(entrega.id, 'Cancelada')}
                        className="text-red-600 hover:text-red-800"
                        title="Marcar como Cancelada"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Nenhuma entrega pendente
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há entregas pendentes ou em rota no momento.
          </p>
          <div className="mt-6">
            <Link
              to="/app/entregas/novo"
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Entrega
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
 