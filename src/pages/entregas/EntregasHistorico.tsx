import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Clipboard, ArrowLeft, Filter, FileText } from 'lucide-react';
import { Entrega, Entregador, StatusEntrega } from '../../types';
import { listarEntregas } from '../../services/entregasService';
import { listarEntregadores } from '../../services/entregadoresService';

export default function EntregasHistorico() {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<StatusEntrega[]>(['Concluída', 'Cancelada']);
  const [filtroEntregador, setFiltroEntregador] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [entregadoresData] = await Promise.all([
            listarEntregadores(user.empresaId)
          ]);
          
          setEntregadores(entregadoresData);
          
          // Aplicar filtros iniciais
          await aplicarFiltros(filtroStatus, filtroEntregador);
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);
  
  const aplicarFiltros = async (
    status: StatusEntrega[],
    entregadorId: number | null
  ) => {
    if (user) {
      setIsLoading(true);
      try {
        const entregasData = await listarEntregas(user.empresaId, {
          status,
          entregadorId: entregadorId || undefined
        });
        
        // Adicionar informações do entregador
        const entregasComEntregador = entregasData.map(entrega => {
          const entregador = entregadores.find(e => e.id === entrega.entregadorId);
          return {
            ...entrega,
            entregador
          };
        });
        
        setEntregas(entregasComEntregador);
      } catch (error) {
        console.error('Erro ao buscar entregas:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleFiltroStatusChange = (status: StatusEntrega) => {
    const novoFiltro = filtroStatus.includes(status)
      ? filtroStatus.filter(s => s !== status)
      : [...filtroStatus, status];
    
    setFiltroStatus(novoFiltro);
    aplicarFiltros(novoFiltro, filtroEntregador);
  };
  
  const handleFiltroEntregadorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    const entregadorId = valor === '' ? null : parseInt(valor);
    
    setFiltroEntregador(entregadorId);
    aplicarFiltros(filtroStatus, entregadorId);
  };
  
  const getStatusClass = (status: StatusEntrega) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Rota':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando histórico de entregas...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Clipboard className="mr-2 h-6 w-6" />
            Histórico de Entregas
          </h2>
          <p className="text-gray-600 mt-1">
            Consulte o histórico de entregas concluídas e canceladas.
          </p>
        </div>
        
        <Link
          to="/app/entregas"
          className="btn btn-outline flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Entregas
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-gray-700 font-medium">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroStatus.includes('Concluída') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleFiltroStatusChange('Concluída')}
              >
                Concluída
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filtroStatus.includes('Cancelada') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleFiltroStatusChange('Cancelada')}
              >
                Cancelada
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="filtroEntregador" className="block text-sm font-medium text-gray-700 mb-1">
              Entregador
            </label>
            <select
              id="filtroEntregador"
              className="form-select"
              value={filtroEntregador || ''}
              onChange={handleFiltroEntregadorChange}
            >
              <option value="">Todos os entregadores</option>
              {entregadores.map(entregador => (
                <option key={entregador.id} value={entregador.id}>
                  {entregador.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de Entregas */}
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
                  Detalhes
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
                      ${getStatusClass(entrega.status)}
                    `}>
                      {entrega.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/app/entregas/editar/${entrega.id}`}
                      className="text-primary hover:text-blue-800"
                    >
                      <FileText className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Nenhuma entrega encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Não há entregas que correspondam aos filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
 