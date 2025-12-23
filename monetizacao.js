// monetizacao.js

const CONFIG_ADS = {
    managerScript: "https://js.wpadmngr.com/static/adManager.js",
    pid: "405407",
    locais: {
        videoPrincipal: "1475529",
        bannerArtigo: "1475530",
        bannerMeioTexto: "1475536",
        bannerSidebar: "1475537"
    }
};

function inicializarAnuncios() {
    // 1. Injetar o VÍDEO (Corrigido: mantendo o seletor)
    document.querySelectorAll('[data-slot="video-topo"]').forEach(el => {
        el.innerHTML = `<div class="ad-video-container" data-banner-id="${CONFIG_ADS.locais.videoPrincipal}"></div>`;
    });

    // 2. Injetar os BANNERS
    document.querySelectorAll('[data-slot="banner-1"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerArtigo}"></div>`;
    });

    document.querySelectorAll('[data-slot="banner-meio"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerMeioTexto}"></div>`;
    });

    document.querySelectorAll('[data-slot="banner-lateral"]').forEach(el => {
        el.innerHTML = `<div data-banner-id="${CONFIG_ADS.locais.bannerSidebar}"></div>`;
    });

    // 3. Carregar o script do Ad Manager
    const script = document.createElement('script');
    script.async = true;
    script.src = CONFIG_ADS.managerScript;
    script.setAttribute('data-admpid', CONFIG_ADS.pid);
    document.head.appendChild(script);
}

// Executa quando TUDO (estilos e imagens) estiver carregado
window.addEventListener('load', inicializarAnuncios);

