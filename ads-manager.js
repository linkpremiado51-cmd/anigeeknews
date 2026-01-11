(function() {
    // === CONFIGURAÇÃO DE ESTADO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // === 1. COMPONENTES DE INTERFACE (UI ELITE) ===

    // BLOCO 1 (GAVETA INFERIOR - ESTILO SNACKBAR MODERNA)
    const bloco1 = document.createElement('div');
    bloco1.id = 'ads-bloco-1';
    bloco1.innerHTML = `
        <div class="elite-card elite-snackbar">
            <div class="elite-header">
                <span class="elite-tag">Patrocinado</span>
                <button id="close-b1" class="elite-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div id="slot-b1" class="elite-slot elite-skeleton"></div>
        </div>
    `;

    // BLOCO 2 (INTERSTITIAL - FULL EXPERIENCE GOOGLE STYLE)
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <div class="elite-overlay">
            <div class="elite-modal">
                <div class="elite-modal-header">
                    <div class="elite-tag-group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0b57d0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <span class="elite-tag blue">Anúncio Premium</span>
                    </div>
                    <button id="close-b2" class="elite-btn-exit" disabled>Aguarde...</button>
                </div>
                
                <div id="slot-b2" class="elite-slot-hero elite-skeleton"></div>

                <div class="elite-modal-footer">
                    <div class="elite-progress-container">
                        <div id="progress-bar-b2" class="elite-progress-fill"></div>
                    </div>
                    <div class="elite-action-bar">
                        <span id="timer-b2" class="elite-timer-label">Sincronizando...</span>
                        <a href="#" target="_blank" class="elite-main-button">
                            Acessar Agora
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // BLOCO 3 (TOPO - STICKY BANNER)
    const bloco3 = document.createElement('div');
    bloco3.id = 'ads-bloco-3';
    bloco3.innerHTML = `
        <div class="elite-card elite-top-banner">
            <div class="elite-header">
                <span class="elite-tag">Informativo</span>
                <button id="close-b3" class="elite-btn-text">FECHAR</button>
            </div>
            <div id="slot-b3" class="elite-slot elite-skeleton"></div>
        </div>
    `;

    // === 2. ESTILIZAÇÃO DE ALTO NÍVEL (CSS) ===
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --elite-blue: #0b57d0;
            --elite-surface: #ffffff;
            --elite-on-surface: #1f1f1f;
            --elite-gray: #f8f9fa;
            --elite-outline: #e3e3e3;
            --elite-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
        }

        /* ANIMAÇÃO SKELETON (SHIMMER) */
        .elite-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: elite-shimmer 2s infinite linear;
        }
        @keyframes elite-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* BASE DOS CARDS */
        .elite-card { 
            position: fixed; background: var(--elite-surface); border: 1px solid var(--elite-outline);
            padding: 16px; z-index: 9999; transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
            width: 92%; max-width: 550px; box-shadow: var(--elite-shadow);
        }
        .elite-snackbar { bottom: -250px; left: 50%; transform: translateX(-50%); border-radius: 24px; }
        .elite-top-banner { top: -250px; left: 50%; transform: translateX(-50%); border-radius: 0 0 24px 24px; border-top: none; }

        .elite-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .elite-tag { font-family: 'Google Sans', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; color: #5f6368; text-transform: uppercase; letter-spacing: 0.8px; }
        .elite-tag.blue { color: var(--elite-blue); }
        .elite-tag-group { display: flex; align-items: center; gap: 6px; }

        .elite-slot { height: 100px; border-radius: 12px; }
        .elite-slot-hero { height: 320px; border-radius: 16px; margin-bottom: 20px; }

        /* MODAL INTERSTITIAL */
        .elite-overlay { 
            position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.5s ease;
        }
        .elite-modal { 
            background: #fff; width: 92%; max-width: 440px; border-radius: 32px; padding: 28px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.3); transform: translateY(20px); transition: transform 0.6s ease;
        }
        .elite-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

        /* BOTÕES */
        .elite-icon-btn { background: none; border: none; cursor: pointer; color: #5f6368; border-radius: 50%; padding: 4px; transition: background 0.2s; }
        .elite-icon-btn:hover { background: var(--elite-gray); }
        .elite-btn-text { background: none; border: none; color: var(--elite-blue); font-weight: 700; font-size: 12px; cursor: pointer; }
        
        .elite-btn-exit { 
            background: var(--elite-gray); border: none; border-radius: 100px; padding: 10px 20px;
            font-size: 13px; font-weight: 600; color: #3c4043; cursor: not-allowed; transition: all 0.3s;
        }
        .elite-btn-exit.ready { background: #fce8e6; color: #d93025; cursor: pointer; }
        .elite-btn-exit.ready:hover { background: #fad2cf; }

        /* ACTION BAR & PROGRESS */
        .elite-progress-container { width: 100%; height: 6px; background: #e8eaed; border-radius: 100px; overflow: hidden; margin-bottom: 16px; }
        .elite-progress-fill { width: 0%; height: 100%; background: var(--elite-blue); transition: width 0.1s linear; }
        .elite-action-bar { display: flex; justify-content: space-between; align-items: center; }
        .elite-timer-label { font-family: sans-serif; font-size: 13px; font-weight: 500; color: #5f6368; }

        .elite-main-button { 
            display: flex; align-items: center; gap: 8px; background: var(--elite-blue); color: #fff;
            padding: 12px 24px; border-radius: 16px; text-decoration: none; font-weight: 600; font-size: 14px;
            box-shadow: 0 4px 12px rgba(11, 87, 208, 0.25); transition: transform 0.2s, box-shadow 0.2s;
        }
        .elite-main-button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(11, 87, 208, 0.35); }
        .elite-main-button:active { transform: scale(0.96); }

        /* RESPONSIVIDADE */
        @media (max-width: 480px) {
            .elite-modal { padding: 20px; border-radius: 28px; }
            .elite-slot-hero { height: 260px; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco1);
    document.body.appendChild(bloco2);
    document.body.appendChild(bloco3);

    // === 3. LÓGICA DE EXECUÇÃO (ENGINE) ===

    const toggleDisplay = (id, property, value) => { document.getElementById(id).style[property] = value; };

    // BLOCO 1
    function startB1() { setTimeout(() => toggleDisplay('ads-bloco-1', 'bottom', '24px'), 2000); }
    document.getElementById('close-b1').onclick = () => {
        toggleDisplay('ads-bloco-1', 'bottom', '-250px');
        setTimeout(startB1, 20000);
    };

    // BLOCO 3
    function startB3() { setTimeout(() => toggleDisplay('ads-bloco-3', 'top', '0px'), 4000); }
    document.getElementById('close-b3').onclick = () => {
        toggleDisplay('ads-bloco-3', 'top', '-250px');
        setTimeout(startB3, 25000);
    };

    // BLOCO 2 (INTERSTITIAL)
    function startB2() {
        setTimeout(() => {
            const overlay = document.getElementById('ads-bloco-2');
            overlay.style.display = "flex";
            setTimeout(() => { 
                overlay.style.opacity = "1";
                overlay.querySelector('.elite-modal').style.transform = "translateY(0)";
            }, 50);
            
            let remaining = 10;
            const btnExit = document.getElementById('close-b2');
            const timerLabel = document.getElementById('timer-b2');
            const progressFill = document.getElementById('progress-bar-b2');

            const countdown = setInterval(() => {
                if (isTabActive) {
                    if (remaining > 0) {
                        remaining--;
                        timerLabel.innerText = `Próximo passo em ${remaining}s`;
                        progressFill.style.width = `${(10 - remaining) * 10}%`;
                    } else {
                        clearInterval(countdown);
                        timerLabel.innerText = "Acesso liberado";
                        btnExit.innerText = "Pular anúncio";
                        btnExit.disabled = false;
                        btnExit.classList.add('ready');
                    }
                } else {
                    timerLabel.innerText = "Aguardando seu retorno...";
                }
            }, 1000);
        }, 10000);
    }

    document.getElementById('close-b2').onclick = () => {
        const overlay = document.getElementById('ads-bloco-2');
        overlay.style.opacity = "0";
        overlay.querySelector('.elite-modal').style.transform = "translateY(20px)";
        setTimeout(() => { 
            overlay.style.display = "none";
            setTimeout(startB2, 120000); 
        }, 500);
    };

    // INICIALIZAÇÃO GLOBAL
    startB1();
    startB2();
    startB3();

})();
