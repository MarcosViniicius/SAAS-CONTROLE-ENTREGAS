import  { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Save, ArrowLeft } from 'lucide-react';
import { 
  criarEntregador, 
  obterEntregador, 
  atualizarEntregador 
} from '../../services/entregadoresService';

export default function EntregadoresForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEntregador = async () => {
      if (isEditing && id) {
        setIsLoading(true);
        try {
          const data = await obterEntregador(parseInt(id));
          setNome(data.nome);
        } catch (error) {
          console.error('Erro ao buscar entregador:', error);
          setError('Não foi possível carregar os dados do entregador.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchEntregador();
  }, [id, isEditing]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nome.trim()) {
      setError('O nome do entregador é obrigatório.');
      return;
    }
    
    if (!user) {
      setError('Você precisa estar logado para realizar esta ação.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditing && id) {
        await atualizarEntregador(parseInt(id), { nome });
      } else {
        await criarEntregador({
          nome,
          empresaId: user.empresaId
        });
      }
      
      navigate('/app/entregadores');
    } catch (error) {
      console.error('Erro ao salvar entregador:', error);
      setError('Ocorreu um erro ao salvar o entregador. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando dados do entregador...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="mr-2 h-6 w-6" />
            {isEditing ? 'Editar Entregador' : 'Novo Entregador'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing 
              ? 'Atualize as informações do entregador.' 
              : 'Preencha as informações para cadastrar um novo entregador.'}
          </p>
        </div>
        
        <Link
          to="/app/entregadores"
          className="btn btn-outline flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome do Entregador
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
          
          <div className="mt-6 flex justify-end">
            <Link
              to="/app/entregadores"
              className="btn btn-outline mr-3"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 