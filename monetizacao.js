// monetizacao.js

// Aqui você centraliza todos os seus IDs
const CONFIG_ADS = {
    managerScript: "https://js.wpadmngr.com/static/adManager.js",
    pid: "405407",
    locais: {
        videoPrincipal: "1475529",    // O vídeo do topo
        bannerArtigo: "1475530",      // O primeiro banner
        bannerMeioTexto: "1475536",   // O do meio do texto
        bannerSidebar: "1475537"      // O da lateral
    }
};

// Função para injetar os anúncios e carregar o script da rede
function inicializarAnuncios() {
    // 1. Injetar os IDs nos locais que marcamos no HTML
    document.querySelectorAll('[data-slot="video-topo"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.videoPrincipal}"></div>`;
    });

    document.querySelectorAll('[data-slot="banner-1"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerArtigo}"></div>`;
    });

    document.querySelectorAll('[data-slot="banner-meio"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerMeioTexto}"></div>`;
    });

    document.querySelectorAll('[data-slot="banner-lateral"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerSidebar}"></div>`;
    });

    // 2. Carregar o script do Ad Manager dinamicamente
    const script = document.createElement('script');
    script.async = true;
    script.src = CONFIG_ADS.managerScript;
    script.setAttribute('data-admpid', CONFIG_ADS.pid);
    document.head.appendChild(script);
}

// Executa quando a página carregar
window.addEventListener('DOMContentLoaded', inicializarAnuncios);
