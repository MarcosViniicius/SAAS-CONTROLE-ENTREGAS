import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { listarEntregadores } from '../services/entregadoresService';
import { listarEntregas } from '../services/entregasService';
import { Entregador, Entrega, StatusEntrega } from '../types';

export default function Painel() {
  const { user, empresa } = useAuth();
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const [entregadoresData, entregasData] = await Promise.all([
            listarEntregadores(user.empresaId),
            listarEntregas(user.empresaId)
          ]);
          
          setEntregadores(entregadoresData);
          setEntregas(entregasData);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando dados...</p>
      </div>
    );
  }
  
  const entregasPendentes = entregas.filter(e => e.status === 'Pendente').length;
  const entregasEmRota = entregas.filter(e => e.status === 'Em Rota').length;
  const entregasConcluidas = entregas.filter(e => e.status === 'Concluída').length;
  const entregasCanceladas = entregas.filter(e => e.status === 'Cancelada').length;
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Bem-vindo, {empresa?.nome}
        </h2>
        <p className="text-gray-600">
          Este é o painel de controle do seu sistema de entregas.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Entregadores
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {entregadores.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/app/entregadores" className="font-medium text-primary hover:text-blue-900">
                Ver todos
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendentes
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {entregasPendentes}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/app/entregas" className="font-medium text-primary hover:text-blue-900">
                Ver todas
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Rota
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {entregasEmRota}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/app/entregas" className="font-medium text-primary hover:text-blue-900">
                Ver todas
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Concluídas
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {entregasConcluidas}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/app/entregas/historico" className="font-medium text-primary hover:text-blue-900">
                Ver histórico
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Entregas recentes e imagem */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Entregas Recentes</h3>
          {entregas.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {entregas.slice(0, 5).map((entrega) => (
                  <li key={entrega.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`
                          p-2 rounded-full
                          ${entrega.status === 'Pendente' ? 'bg-yellow-100 text-yellow-600' : ''}
                          ${entrega.status === 'Em Rota' ? 'bg-orange-100 text-orange-600' : ''}
                          ${entrega.status === 'Concluída' ? 'bg-green-100 text-green-600' : ''}
                          ${entrega.status === 'Cancelada' ? 'bg-red-100 text-red-600' : ''}
                        `}>
                          <Package className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Entrega #{entrega.id}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {entrega.endereco}
                        </p>
                      </div>
                      <div>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${entrega.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${entrega.status === 'Em Rota' ? 'bg-orange-100 text-orange-800' : ''}
                          ${entrega.status === 'Concluída' ? 'bg-green-100 text-green-800' : ''}
                          ${entrega.status === 'Cancelada' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {entrega.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhuma entrega registrada ainda.
            </p>
          )}
          <div className="mt-6">
            <Link to="/app/entregas/novo" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700">
              Nova Entrega
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <img 
            className="h-full w-full object-cover" 
            src="https://images.unsplash.com/photo-1600083691960-1a52d9945594?fit=fillmax&h=600&w=800" 
            alt="Entregador verificando direções" 
          />
        </div>
      </div>
    </div>
  );
}
 