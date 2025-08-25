export interface Igreja {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  responsavel: string;
  latitude?: number;
  longitude?: number;
  imagem?: string;
  criadaEm: string;
  ativa: boolean;
}

export interface Evento {
  id: string;
  igrejaId: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  local: string;
  tipo: 'missa' | 'novena' | 'terco' | 'retiro' | 'festa' | 'encontro';
  recorrente: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Transmissao {
  id: string;
  igrejaId: string;
  titulo: string;
  descricao: string;
  tipo: 'ao-vivo' | 'gravada';
  url: string;
  thumbnail?: string;
  visualizacoes: number;
  dataInicio: string;
  dataFim?: string;
  ativa: boolean;
}

export interface PedidoOracao {
  id: string;
  igrejaId: string;
  nome: string;
  intencao: string;
  comentario?: string;
  data: string;
  status: 'pendente' | 'orando' | 'atendido';
  anonimo: boolean;
}

export interface Doacao {
  id: string;
  igrejaId: string;
  valor: number;
  metodo: 'pix' | 'cartao';
  status: 'pendente' | 'aprovada' | 'rejeitada';
  campanhaId?: string;
  doadorNome?: string;
  doadorEmail?: string;
  data: string;
  transacaoId?: string;
}

export interface Campanha {
  id: string;
  igrejaId: string;
  titulo: string;
  descricao: string;
  meta: number;
  arrecadado: number;
  imagem?: string;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
}

export interface Rifa {
  id: string;
  igrejaId: string;
  titulo: string;
  descricao: string;
  premio: string;
  valorNumero: number;
  totalNumeros: number;
  numerosVendidos: number[];
  dataInicio: string;
  dataFim: string;
  dataSorteio: string;
  status: 'ativa' | 'finalizada' | 'em-breve';
  numeroSorteado?: number;
  ganhador?: string;
}

export interface Aviso {
  id: string;
  igrejaId: string;
  titulo: string;
  conteudo: string;
  tipo: 'urgente' | 'informativo' | 'evento';
  autor: string;
  data: string;
  fixado: boolean;
  visualizacoes: number;
  imagem?: string;
}

export interface MensagemMural {
  id: string;
  igrejaId: string;
  autor: string;
  conteudo: string;
  data: string;
  hora: string;
  curtidas: number;
  moderado: boolean;
  aprovado: boolean;
}

export interface Membro {
  id: string;
  igrejaId: string;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  aniversario: string;
  ministerio?: string;
  sacramentos: string[];
  ativo: boolean;
  criadoEm: string;
}

export interface Usuario {
  id: string;
  email: string;
  tipo: 'admin' | 'responsavel' | 'colaborador';
  igrejaId: string;
  nome: string;
  criadoEm: string;
  ultimoAcesso: string;
}