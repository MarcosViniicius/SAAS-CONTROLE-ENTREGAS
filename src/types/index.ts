export  type Usuario = {
  id: number;
  email: string;
  empresaId: number;
};

export type Empresa = {
  id: number;
  nome: string;
  email: string;
};

export type Entregador = {
  id: number;
  nome: string;
  empresaId: number;
};

export type FormaPagamento = 'Dinheiro' | 'Cartão' | 'Pix' | 'Outro';

export type StatusEntrega = 'Pendente' | 'Em Rota' | 'Concluída' | 'Cancelada';

export type Entrega = {
  id: number;
  endereco: string;
  valor: number;
  formaPagamento: FormaPagamento;
  observacoes?: string;
  status: StatusEntrega;
  entregadorId: number;
  empresaId: number;
  entregador?: Entregador;
};
 