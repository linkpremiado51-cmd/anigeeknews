(function() {
    // === CONFIGURAÇÃO DE AMBIENTE ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // === 1. COMPONENTES DE INTERFACE (UI) ===

    // BLOCO 1 (BOTTOM SNACKBAR STYLE)
    const bloco1 = document.createElement('div');
    bloco1.id = 'ads-bloco-1';
    bloco1.innerHTML = `
        <div class="ad-unit-card snackbar">
            <div class="ad-header">
                <span class="ad-badge">Anúncio</span>
                <button id="close-b1" class="ad-icon-close">&times;</button>
            </div>
            <div id="slot-b1" class="ad-slot skeleton-loading"></div>
        </div>
    `;

    // BLOCO 2 (MODAL INTERSTITIAL ELITE)
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <div class="ad-backdrop">
            <div class="ad-modal-canvas">
                <div class="ad-modal-top">
                    <span class="ad-badge">Patrocinado</span>
                    <button id="close-b2" class="ad-btn-exit" disabled>Aguarde...</button>
                </div>
                <div id="slot-b2" class="ad-slot-large skeleton-loading"></div>
                <div class="ad-modal-footer">
                    <div class="ad-progress-track">
                        <div id="progress-bar-b2" class="ad-progress-bar"></div>
                    </div>
                    <div class="ad-action-area">
                        <div id="timer-b2" class="ad-status-text">Carregando experiência...</div>
                        <a href="#" target="_blank" class="ad-prime-button">
                            <span>Saber mais</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // BLOCO 3 (TOP STICKY BANNER)
    const bloco3 = document.createElement('div');
    bloco3.id = 'ads-bloco-3';
    bloco3.innerHTML = `
        <div class="ad-unit-card top-banner">
            <div class="ad-header">
                <span class="ad-badge">Publicidade</span>
                <button id="close-b3" class="ad-btn-minimal">Fechar</button>
            </div>
            <div id="slot-b3" class="ad-slot skeleton-loading"></div>
        </div>
    `;

    // === 2. ESTILIZAÇÃO DE ALTO NÍVEL (CSS) ===
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --ad-surface: #ffffff;
            --ad-on-surface: #1f1f1f;
            --ad-primary: #0b57d0; /* Google Blue */
            --ad-outline: #e3e3e3;
            --ad-shimmer: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
        }

        /* TIPOGRAFIA E BADGES */
        .ad-badge { font-family: 'Segoe UI', Roboto, Helvetica, sans-serif; font-size: 11px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; }
        .ad-status-text { font-family: 'Segoe UI', sans-serif; font-size: 13px; color: #444746; }

        /* SKELETON ANIMATION */
        .skeleton-loading { background: var(--ad-shimmer); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* CARDS E ESTRUTURA */
        .ad-unit-card { position: fixed; background: var(--ad-surface); border: 1px solid var(--ad-outline); box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 9999; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); width: 95%; max-width: 500px; padding: 12px; border-radius: 16px; }
        .snackbar { bottom: -200px; left: 50%; transform: translateX(-50%); }
        .top-banner { top: -200px; left: 50%; transform: translateX(-50%); border-radius: 0 0 16px 16px; }

        .ad-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .ad-slot { height: 100px; border-radius: 8px; border: 1px dashed #d1d1d1; }
        .ad-slot-large { height: 320px; border-radius: 12px; background: #f8f9fa; }

        /* BOTÕES EXECUTIVOS */
        .ad-icon-close { background: none; border: none; font-size: 20px; color: #5f6368; cursor: pointer; padding: 0 5px; }
        .ad-btn-minimal { background: none; border: 1px solid var(--ad-outline); border-radius: 20px; padding: 4px 12px; font-size: 11px; color: #5f6368; cursor: pointer; }

        /* MODAL INTERSTITIAL ELITE */
        #ads-bloco-2 { position: fixed; inset: 0; z-index: 10000; display: none; opacity: 0; transition: opacity 0.4s ease; }
        .ad-backdrop { width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; }
        .ad-modal-canvas { background: #fff; width: 90%; max-width: 420px; border-radius: 28px; padding: 24px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
        .ad-modal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        
        .ad-btn-exit { background: #f1f3f4; border: none; border-radius: 20px; padding: 8px 16px; font-weight: 600; color: #3c4043; cursor: not-allowed; font-size: 13px; }
        .ad-btn-exit.ready { background: var(--ad-primary); color: #fff; cursor: pointer; }

        .ad-modal-footer { margin-top: 20px; }
        .ad-progress-track { width: 100%; height: 4px; background: #e8eaed; border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
        .ad-progress-bar { width: 0%; height: 100%; background: var(--ad-primary); transition: width 0.1s linear; }
        
        .ad-action-area { display: flex; justify-content: space-between; align-items: center; }
        .ad-prime-button { display: flex; align-items: center; gap: 8px; background: var(--ad-primary); color: #fff; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .ad-prime-button:hover { filter: brightness(1.1); }

        /* RESPONSIVIDADE */
        @media (max-width: 480px) {
            .ad-modal-canvas { width: 95%; padding: 16px; border-radius: 24px; }
            .ad-slot-large { height: 250px; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco1);
    document.body.appendChild(bloco2);
    document.body.appendChild(bloco3);

    // === 3. LÓGICA DE MOVIMENTO E TEMPO ===

    const showUnit = (el, prop, val) => { el.style[prop] = val; };

    function runBloco1() {
        setTimeout(() => showUnit(bloco1, 'bottom', '20px'), 2000);
    }
    document.getElementById('close-b1').onclick = () => {
        showUnit(bloco1, 'bottom', '-200px');
        setTimeout(runBloco1, 20000);
    };

    function runBloco3() {
        setTimeout(() => showUnit(bloco3, 'top', '0px'), 4000);
    }
    document.getElementById('close-b3').onclick = () => {
        showUnit(bloco3, 'top', '-200px');
        setTimeout(runBloco3, 25000);
    };

    function runBloco2() {
        setTimeout(() => {
            bloco2.style.display = "block";
            setTimeout(() => bloco2.style.opacity = "1", 50);
            
            let time = 10;
            const btn = document.getElementById('close-b2');
            const bar = document.getElementById('progress-bar-b2');
            const status = document.getElementById('timer-b2');

            const timer = setInterval(() => {
                if (isTabActive) {
                    if (time > 0) {
                        time--;
                        status.innerText = `Livre em ${time}s`;
                        bar.style.width = `${(10 - time) * 10}%`;
                    } else {
                        clearInterval(timer);
                        status.innerText = "Pronto para continuar";
                        btn.innerText = "Fechar";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                } else {
                    status.innerText = "Pausado...";
                }
            }, 1000);
        }, 10000);
    }

    document.getElementById('close-b2').onclick = () => {
        bloco2.style.opacity = "0";
        setTimeout(() => {
            bloco2.style.display = "none";
            setTimeout(runBloco2, 120000);
        }, 500);
    };

    // START
    runBloco1();
    runBloco2();
    runBloco3();

})();
