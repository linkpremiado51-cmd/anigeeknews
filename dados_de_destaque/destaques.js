// =======================================================
// IMPORTA OS BANCOS DE DADOS DE CADA FRANQUIA
// =======================================================
import { onepiece } from './onepiece.js';
import { sololeveling } from './sololeveling.js';
import { eldenring } from './eldenring.js';

// =======================================================
// BANCO CENTRAL DE DESTAQUES
// =======================================================
export const destaques = [
  ...onepiece,
  ...sololeveling,
  ...eldenring
];

// =======================================================
// INJETOR AUTOMÁTICO NO HTML
// =======================================================
const container = document.getElementById('destaques-container');

if (container) {
  destaques.forEach(secao => {
    container.insertAdjacentHTML('beforeend', criarSecao(secao));
  });
}

// =======================================================
// TEMPLATE HTML COMPLETO DE CADA SEÇÃO
// =======================================================
function criarSecao(secao) {
  return `
  <article class="destaque-secao secao-${secao.secao}">
    <div class="destaque-padding">

      <div class="destaque-header">
        <h1 class="destaque-titulo">${secao.titulo}</h1>

        <div class="menu-opcoes-container">
          <button class="btn-tres-pontos">⋮</button>
          <div class="dropdown-conteudo header-dropdown">
            <a href="#"><i class="fa-solid fa-share"></i> Compartilhar</a>
            <a href="#"><i class="fa-solid fa-bookmark"></i> Salvar</a>
            <a href="#"><i class="fa-solid fa-flag"></i> Reportar</a>
          </div>
        </div>
      </div>

      <div class="destaque-categoria">
        <span>■</span> ${secao.categoria}
      </div>

      <p class="destaque-resumo">${secao.resumo}</p>

      <a class="btn-ver-artigo" href="${secao.link}">
        Ler artigo completo <i class="fa-solid fa-arrow-right"></i>
      </a>

      <div class="destaque-info-grid">
        <div class="info-item">
          <span class="info-label">Autor</span>
          <span class="info-valor">${secao.autor}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Fonte</span>
          <span class="info-valor">${secao.fonte}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Publicado</span>
          <span class="info-valor">${secao.data}</span>
        </div>
      </div>

    </div>

    <div class="destaque-media">
      <iframe id="player-${secao.secao}" src="https://www.youtube.com/embed/${secao.video}" allowfullscreen></iframe>
    </div>

    <div class="destaque-acoes">

      <div class="menu-opcoes-container">
        <button class="btn-acao">Vídeos relacionados</button>
        <div class="dropdown-conteudo acoes-dropdown">
          ${secao.temas.map(t => `
            <a href="#" onclick="pedirTroca('player-${secao.secao}','${t.id}','${t.titulo}','${secao.cor}')">
              ▶ ${t.titulo}
            </a>
          `).join('')}
        </div>
      </div>

    </div>

  </article>
  `;
}
