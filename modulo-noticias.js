// ==================================================
// 1. IMPORTAÇÕES DE DADOS
// ==================================================
import { dadosManchetes } from './dados_de_noticias/dados-manchetes.js';
import { dadosAnalise } from './dados_de_noticias/dados-analise.js';
import { dadosEntrevistas } from './dados_de_noticias/dados-entrevistas.js';
import { dadosLancamentos } from './dados_de_noticias/dados-lancamentos.js';
import { dadosPodcast } from './dados_de_noticias/dados-podcast.js';

// ==================================================
// 2. BANCO DE DADOS CENTRALIZADO
// ==================================================
const bancoDeDados = {
  manchetes: dadosManchetes,
  analises: dadosAnalise,
  entrevistas: dadosEntrevistas,
  lancamentos: dadosLancamentos,
  podcast: dadosPodcast
};

// ==================================================
// 3. CONTROLE DE ÍNDICES
// ==================================================
const secoesPermitidas = Object.keys(bancoDeDados);

let indices = JSON.parse(localStorage.getItem('indices_secoes')) || {};
secoesPermitidas.forEach(secao => {
  if (typeof indices[secao] !== 'number') indices[secao] = 0;
});

// ==================================================
// 4. UTILITÁRIOS
// ==================================================
function normalizarTexto(texto = '') {
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function gerarSlug(titulo) {
  return normalizarTexto(titulo).replace(/[^a-z0-9]+/g, '-');
}

// ==================================================
// 5. SISTEMA DE RECOMENDAÇÃO
// ==================================================
function ordenarPorRelevancia(listaOriginal) {
  const gostos = (JSON.parse(localStorage.getItem('gostosUsuario')) || [])
    .map(g => normalizarTexto(g));

  if (!gostos.length) return [...listaOriginal];

  return listaOriginal
    .map(noticia => {
      let score = 0;
      const categoria = normalizarTexto(noticia.category || noticia.categoria);

      if (gostos.includes(categoria)) score += 5;

      gostos.forEach(gosto => {
        if (normalizarTexto(noticia.titulo).includes(gosto)) score += 2;
      });

      return { ...noticia, score };
    })
    .sort((a, b) => b.score - a.score);
}

// ==================================================
// 6. HTML DO BLOCO DE DESTAQUE
// ==================================================
function criarBlocoDestaque(noticia, index) {
  const slug = noticia.url
    ? noticia.url
    : `/anigeeknews/noticias/2026/${gerarSlug(noticia.titulo)}.html`;

  const tema = normalizarTexto(noticia.category || noticia.categoria);

  return `
  <section class="destaque-secao secao-${tema}">
    <div class="destaque-padding">

      <div class="destaque-header">
        <h2 class="destaque-titulo">${noticia.titulo}</h2>
      </div>

      <div class="destaque-categoria">
        <i class="fa-solid fa-tag"></i>
        ${noticia.category || noticia.categoria}
      </div>

      <p class="destaque-resumo">${noticia.descricao}</p>

      <a href="${slug}" class="btn-ver-artigo">
        Ler artigo <i class="fa-solid fa-arrow-right"></i>
      </a>

      <div class="destaque-info-grid">
        <div class="info-item">
          <div class="info-label">Fonte</div>
          <div class="info-valor">${noticia.meta}</div>
        </div>

        <div class="info-item">
          <div class="info-label">Leitores</div>
          <div class="info-valor">${noticia.likes || 0}</div>
        </div>
      </div>

      <div class="destaque-media">
        <iframe id="player-${index}" src="${noticia.video || ''}" allowfullscreen></iframe>
      </div>

    </div>
  </section>
  `;
}

// ==================================================
// 7. RENDERIZAR NOTÍCIAS NO CONTAINER NOVO
// ==================================================
export function renderizarDestaques() {
  const secao = localStorage.getItem('currentSection') || 'manchetes';
  const area = document.getElementById('area-de-noticias');

  if (!area || !bancoDeDados[secao]) return;

  area.innerHTML = '';

  const listaOrdenada = ordenarPorRelevancia(bancoDeDados[secao]);

  indices[secao] = indices[secao] || 0;

  for (let i = 0; i < indices[secao] + 2; i++) {
    if (listaOrdenada[i]) {
      area.insertAdjacentHTML('beforeend', criarBlocoDestaque(listaOrdenada[i], i));
    }
  }

  indices[secao] += 2;
  localStorage.setItem('indices_secoes', JSON.stringify(indices));
}

// ==================================================
// 8. TROCAR ABA
// ==================================================
export function trocarSecao(secao) {
  if (!bancoDeDados[secao]) return;

  localStorage.setItem('currentSection', secao);
  indices[secao] = 0;
  renderizarDestaques();
}

// ==================================================
// 9. AUTO START
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
  renderizarDestaques();
});
