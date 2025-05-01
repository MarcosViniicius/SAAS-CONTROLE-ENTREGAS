import  { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Save, ArrowLeft } from 'lucide-react';
import { Entregador, FormaPagamento, StatusEntrega } from '../../types';
import { listarEntregadores } from '../../services/entregadoresService';
import { criarEntrega, obterEntrega, atualizarEntrega } from '../../services/entregasService';

const FORMAS_PAGAMENTO: FormaPagamento[] = ['Dinheiro', 'Cartão', 'Pix', 'Outro'];
const STATUS_ENTREGA: StatusEntrega[] = ['Pendente', 'Em Rota', 'Concluída', 'Cancelada'];

export default function EntregasForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [formData, setFormData] = useState({
    endereco: '',
    valor: '',
    formaPagamento: 'Dinheiro' as FormaPagamento,
    observacoes: '',
    status: 'Pendente' as StatusEntrega,
    entregadorId: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Buscar entregadores
          const entregadoresData = await listarEntregadores(user.empresaId);
          setEntregadores(entregadoresData);
          
          // Se for edição, buscar dados da entrega
          if (isEditing && id) {
            const entregaData = await obterEntrega(parseInt(id));
            setFormData({
              endereco: entregaData.endereco,
              valor: entregaData.valor.toString(),
              formaPagamento: entregaData.formaPagamento,
              observacoes: entregaData.observacoes || '',
              status: entregaData.status,
              entregadorId: entregaData.entregadorId
            });
          } else if (entregadoresData.length > 0) {
            // Se for nova entrega, pré-selecionar o primeiro entregador
            setFormData(prev => ({
              ...prev,
              entregadorId: entregadoresData[0].id
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
          setError('Ocorreu um erro ao carregar os dados necessários.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [id, isEditing, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'valor') {
      // Permitir apenas números e um ponto decimal
      const valorLimpo = value.replace(/[^0-9.]/g, '');
      
      // Verificar se há mais de um ponto decimal
      const pontos = valorLimpo.match(/\./g);
      if (pontos && pontos.length > 1) {
        return; // Não atualizar se houver mais de um ponto
      }
      
      setFormData({ ...formData, [name]: valorLimpo });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (!formData.endereco.trim()) {
      setError('O endereço é obrigatório.');
      return;
    }
    
    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      setError('Informe um valor válido para a entrega.');
      return;
    }
    
    if (!formData.entregadorId) {
      setError('Selecione um entregador para a entrega.');
      return;
    }
    
    if (!user) {
      setError('Você precisa estar logado para realizar esta ação.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditing && id) {
        await atualizarEntrega(parseInt(id), {
          endereco: formData.endereco,
          valor,
          formaPagamento: formData.formaPagamento,
          observacoes: formData.observacoes,
          status: formData.status,
          entregadorId: formData.entregadorId
        });
      } else {
        await criarEntrega({
          endereco: formData.endereco,
          valor,
          formaPagamento: formData.formaPagamento,
          observacoes: formData.observacoes,
          status: formData.status,
          entregadorId: formData.entregadorId,
          empresaId: user.empresaId
        });
      }
      
      navigate('/app/entregas');
    } catch (error) {
      console.error('Erro ao salvar entrega:', error);
      setError('Ocorreu um erro ao salvar a entrega. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Carregando dados...</p>
      </div>
    );
  }
  
  if (entregadores.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Não é possível criar entregas
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Você precisa cadastrar pelo menos um entregador antes de criar entregas.
        </p>
        <div className="mt-6">
          <Link
            to="/app/entregadores/novo"
            className="btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cadastrar Entregador
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2 h-6 w-6" />
            {isEditing ? 'Editar Entrega' : 'Nova Entrega'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing 
              ? 'Atualize as informações da entrega.' 
              : 'Preencha as informações para cadastrar uma nova entrega.'}
          </p>
        </div>
        
        <Link
          to="/app/entregas"
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
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="form-group">
              <label htmlFor="endereco" className="form-label">
                Endereço de Entrega
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                required
                className="form-input"
                value={formData.endereco}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="valor" className="form-label">
                Valor (R$)
              </label>
              <input
                id="valor"
                name="valor"
                type="text"
                required
                className="form-input"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="formaPagamento" className="form-label">
                Forma de Pagamento
              </label>
              <select
                id="formaPagamento"
                name="formaPagamento"
                className="form-select"
                value={formData.formaPagamento}
                onChange={handleChange}
              >
                {FORMAS_PAGAMENTO.map(forma => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="entregadorId" className="form-label">
                Entregador
              </label>
              <select
                id="entregadorId"
                name="entregadorId"
                className="form-select"
                value={formData.entregadorId}
                onChange={handleChange}
              >
                {entregadores.map(entregador => (
                  <option key={entregador.id} value={entregador.id}>
                    {entregador.nome}
                  </option>
                ))}
              </select>
            </div>
            
            {isEditing && (
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_ENTREGA.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="form-group mt-4">
            <label htmlFor="observacoes" className="form-label">
              Observações (opcional)
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows={3}
              className="form-input"
              value={formData.observacoes}
              onChange={handleChange}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link
              to="/app/entregas"
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
 