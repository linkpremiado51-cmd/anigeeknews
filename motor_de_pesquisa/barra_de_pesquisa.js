// ===============================
// MOTOR DE PESQUISA — CAMADA LÓGICA
// ===============================

let bancoDeNoticias = [];

// ----------- UTILIDADES -----------

function normalizarTexto(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function diasDesde(dataISO) {
    const hoje = new Date();
    const data = new Date(dataISO);
    const diff = hoje - data;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ----------- CARGA DO ÍNDICE -----------

async function carregarNoticias() {
    try {
        const resposta = await fetch('./motor_de_pesquisa/noticias.json');
        if (!resposta.ok) throw new Error('Falha ao carregar noticias.json');
        bancoDeNoticias = await resposta.json();
        console.log('✅ Índice carregado:', bancoDeNoticias.length, 'itens');
    } catch (erro) {
        console.error('❌ Erro ao carregar índice:', erro);
    }
}

// ----------- SCORE DE RELEVÂNCIA -----------

function calcularScore(item, termoNorm) {
    let score = 0;

    const { conteudo, indexacao, temporal, sinais } = item;

    // 1. MATCH SEMÂNTICO
    const titulo = normalizarTexto(conteudo.titulo);
    const descricao = normalizarTexto(conteudo.descricao);
    const snippet = normalizarTexto(conteudo.snippet_feed);

    const tags = indexacao.tags.map(normalizarTexto);
    const topicos = indexacao.topicos.map(normalizarTexto);
    const palavrasChave = indexacao.palavras_chave.map(normalizarTexto);

    if (titulo.includes(termoNorm)) score += 5;
    if (descricao.includes(termoNorm)) score += 3;
    if (snippet.includes(termoNorm)) score += 2;
    if (tags.some(t => t.includes(termoNorm))) score += 2;
    if (topicos.some(t => t.includes(termoNorm))) score += 2;
    if (palavrasChave.some(p => p.includes(termoNorm))) score += 4;

    if (score === 0) return 0;

    // 2. PESO EDITORIAL
    score *= sinais.peso_base;
    score *= sinais.prioridade_editorial;

    // 3. DECAY TEMPORAL
    const idade = diasDesde(temporal.data_publicacao);
    if (idade > temporal.decai_em_dias) {
        score *= 0.6;
    } else if (idade > temporal.decai_em_dias / 2) {
        score *= 0.8;
    }

    // 4. ENGAJAMENTO (futuro-proof)
    const eng = sinais.engajamento;
    const bonusEngajamento =
        (eng.cliques * 0.02) +
        (eng.likes * 0.05) +
        (eng.compartilhamentos * 0.1);

    score += bonusEngajamento;

    return Number(score.toFixed(3));
}

// ----------- BUSCA PRINCIPAL -----------

function buscarNoticias(termo) {
    const termoNorm = normalizarTexto(termo);
    if (!termoNorm) return [];

    return bancoDeNoticias
        .map(item => ({
            item,
            score: calcularScore(item, termoNorm)
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => ({
            id: r.item.id,
            tipo: r.item.tipo_conteudo,
            score: r.score,
            categoria: r.item.indexacao.categoria,
            data: r.item.temporal.data_publicacao,
            conteudo: r.item.conteudo
        }));
}

// ===============================
// CAMADA DE APRESENTAÇÃO (ISOLADA)
// ===============================

function exibirResultados(resultados, container) {
    if (resultados.length === 0) {
        container.innerHTML = `
            <div style="max-width: var(--container-w); margin: 40px auto; padding: 0 20px; text-align: center; color: var(--text-muted);">
                <h2>Nenhum resultado encontrado</h2>
                <p>Tente termos como <em>one piece, jujutsu, nintendo</em></p>
            </div>
        `;
        return;
    }

    const html = resultados.map(r => `
        <a href="${r.conteudo.url}" style="display:grid;grid-template-columns:120px 1fr;gap:20px;margin-bottom:30px;text-decoration:none;color:inherit;">
            <img src="${r.conteudo.imagem}" loading="lazy" style="width:100%;height:80px;object-fit:cover;">
            <div>
                <small>${r.categoria}</small>
                <h3>${r.conteudo.titulo}</h3>
                <p>${r.conteudo.descricao}</p>
                <small>Score: ${r.score}</small>
            </div>
        </a>
    `).join('');

    container.innerHTML = `
        <div style="max-width: var(--container-w); margin: 20px auto; padding: 0 20px;">
            <h2>Resultados (${resultados.length})</h2>
            ${html}
        </div>
    `;
}

// ===============================
// INICIALIZAÇÃO
// ===============================

function initSearchBar() {
    const input = document.querySelector('.search-input');
    const button = document.querySelector('.search-btn');
    const container = document.getElementById('dynamic-content');

    if (!input || !button || !container) return;

    carregarNoticias();

    let debounce;
    const executarBusca = valor => {
        const resultados = buscarNoticias(valor);
        exibirResultados(resultados, container);
    };

    input.addEventListener('input', e => {
        clearTimeout(debounce);
        debounce = setTimeout(() => executarBusca(e.target.value), 300);
    });

    button.addEventListener('click', () => executarBusca(input.value));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') executarBusca(input.value);
    });
}

document.addEventListener('DOMContentLoaded', initSearchBar);
