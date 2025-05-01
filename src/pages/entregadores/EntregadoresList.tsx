import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Plus, Edit, Trash, AlertTriangle } from 'lucide-react';
import { Entregador } from '../../types';
import { listarEntregadores, excluirEntregador } from '../../services/entregadoresService';

export default function EntregadoresList() {
  const { user } = useAuth();
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entregadorToDelete, setEntregadorToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchEntregadores = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await listarEntregadores(user.empresaId);
          setEntregadores(data);
        } catch (error) {
          console.error('Erro ao buscar entregadores:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchEntregadores();
  }, [user]);
  
  const handleDeleteClick = (id: number) => {
    setEntregadorToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (entregadorToDelete) {
      try {
        await excluirEntregador(entregadorToDelete);
        setEntregadores(entregadores.filter(e => e.id !== entregadorToDelete));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Erro ao excluir entregador:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando entregadores...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Entregadores
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie sua equipe de entregadores.
          </p>
        </div>
        
        <Link
          to="/app/entregadores/novo"
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Link>
      </div>
      
      {entregadores.length > 0 ? (
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {entregadores.map((entregador) => (
              <li key={entregador.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-medium text-primary truncate">
                        {entregador.nome}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        ID: {entregador.id}
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex gap-2">
                    <Link
                      to={`/app/entregadores/editar/${entregador.id}`}
                      className="btn btn-outline flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(entregador.id)}
                      className="btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Nenhum entregador cadastrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando seu primeiro entregador ao sistema.
          </p>
          <div className="mt-6">
            <Link
              to="/app/entregadores/novo"
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Entregador
            </Link>
          </div>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Excluir entregador
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir este entregador? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 