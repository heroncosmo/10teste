import { getRandomInt } from '@/lib/utils';

interface Variacoes {
  [key: string]: string[];
}

const SAUDACOES: Variacoes = {
  'oi': ['olá', 'opa', 'ei'],
  'bom dia': ['bom diaa', 'bom dia!', 'bom dia 😊'],
  'boa tarde': ['boa tardee', 'boa tarde!', 'boa tarde 😊'],
  'boa noite': ['boa noitee', 'boa noite!', 'boa noite 😊'],
  'tudo bem': ['tudo bem?', 'como vai?', 'como está?'],
  'olá': ['oi', 'hey', 'opa'],
};

const SUFIXOS = ['👋', '😊', '!', '...', ' 🙂'];
const PREFIXOS = ['Olá!', 'Oi!', 'Hey!'];

export function variarMensagem(mensagem: string): string {
  let mensagemVariada = mensagem;

  // Substituir saudações
  Object.entries(SAUDACOES).forEach(([original, variacoes]) => {
    if (mensagem.toLowerCase().includes(original)) {
      const aleatoria = variacoes[getRandomInt(0, variacoes.length - 1)];
      mensagemVariada = mensagemVariada.replace(new RegExp(original, 'i'), aleatoria);
    }
  });

  // Adicionar sufixo/prefixo aleatório (30% de chance cada)
  const chance = Math.random();
  if (chance < 0.3) {
    mensagemVariada += ' ' + SUFIXOS[getRandomInt(0, SUFIXOS.length - 1)];
  } else if (chance < 0.6) {
    mensagemVariada = PREFIXOS[getRandomInt(0, PREFIXOS.length - 1)] + ' ' + mensagemVariada;
  }

  // Adicionar número aleatório no final (10% de chance)
  if (Math.random() < 0.1) {
    mensagemVariada += ' ' + getRandomInt(1, 999);
  }

  return mensagemVariada;
}

export function gerarDelayHumano(mensagem: string): number {
  // Gera um delay entre 1 e 3 segundos para cada palavra
  const palavras = mensagem.split(' ').length;
  const delayBase = palavras * getRandomInt(1000, 3000);
  
  // Adiciona um delay aleatório extra (0-5 segundos)
  const delayExtra = getRandomInt(0, 5000);
  
  return delayBase + delayExtra;
} 