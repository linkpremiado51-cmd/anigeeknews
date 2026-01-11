(function() {
    // === ESTADO E MONITORAMENTO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => {
        isTabActive = !document.hidden;
    });

    // === 1. ESTRUTURA DOS BLOCOS (EXECUTIVA) ===

    // BLOCO 1 (GAVETA INFERIOR)
    const bloco1 = document.createElement('div');
    bloco1.id = 'ads-bloco-1';
    bloco1.innerHTML = `
        <div class="corporate-drawer">
            <button id="close-b1" class="corp-close-btn">&times;</button>
            <div class="corp-ad-header">PUBLICIDADE</div>
            <div id="slot-b1" class="corp-slot-small">
                <span class="placeholder-text">Conteúdo Publicitário</span>
            </div>
        </div>
    `;

    // BLOCO 2 (INTERSTITIAL PREMIUM)
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <div class="corp-overlay">
            <div class="corp-modal-card">
                <button id="close-b2" class="corp-modal-close" disabled>&times;</button>
                <div class="corp-ad-header">PUBLICIDADE EXCLUSIVA</div>
                
                <div id="slot-b2" class="corp-slot-main">
                    </div>

                <div class="corp-footer">
                    <div class="corp-progress-bg">
                        <div id="progress-bar-b2" class="corp-progress-fill"></div>
                    </div>
                    <div id="timer-b2" class="corp-timer-text">Aguarde...</div>
                    <a href="#" target="_blank" id="btn-cta-b2" class="corp-cta-button">VISITAR WEBSITE</a>
                </div>
            </div>
        </div>
    `;

    // BLOCO 3 (TOPO)
    const bloco3 = document.createElement('div');
    bloco3.id = 'ads-bloco-3';
    bloco3.innerHTML = `
        <div class="corporate-top-banner">
            <div class="corp-ad-header">PUBLICIDADE</div>
            <div id="slot-b3" class="corp-slot-small">
                <span class="placeholder-text">Anúncio Institucional</span>
            </div>
            <button id="close-b3" class="corp-close-btn-bottom">FECHAR</button>
        </div>
    `;

    // === 2. ESTILIZAÇÃO PROFISSIONAL (CSS) ===
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --corp-bg: #ffffff;
            --corp-text: #1a1a1b;
            --corp-accent: #0066cc; /* Azul Corporativo */
            --corp-gray: #f6f7f8;
            --corp-border: #edeff1;
        }

        .corp-ad-header { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 10px; color: #878a8c; font-weight: 700; letter-spacing: 1px;
            text-align: center; margin-bottom: 8px;
        }

        /* BLOCO 1 - DRAWER */
        #ads-bloco-1 { position: fixed; bottom: -200px; left: 0; width: 100%; z-index: 9999; transition: bottom 0.5s ease; display: flex; justify-content: center; }
        .corporate-drawer { 
            width: 100%; max-width: 600px; background: var(--corp-bg); 
            border: 1px solid var(--corp-border); border-radius: 8px 8px 0 0;
            padding: 15px; box-shadow: 0 -4px 12px rgba(0,0,0,0.08); position: relative;
        }

        /* BLOCO 3 - TOP BANNER */
        #ads-bloco-3 { position: fixed; top: -200px; left: 0; width: 100%; z-index: 9998; transition: top 0.5s ease; display: flex; justify-content: center; }
        .corporate-top-banner { 
            width: 100%; max-width: 600px; background: var(--corp-bg); 
            border: 1px solid var(--corp-border); border-radius: 0 0 8px 8px;
            padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: relative;
        }

        .corp-close-btn, .corp-close-btn-bottom {
            position: absolute; background: var(--corp-gray); border: none; color: #555;
            cursor: pointer; font-size: 14px; padding: 2px 8px; border-radius: 4px;
        }
        .corp-close-btn { top: 10px; right: 10px; }
        .corp-close-btn-bottom { bottom: -25px; right: 10px; font-size: 10px; background: #fff; border: 1px solid var(--corp-border); }

        /* BLOCO 2 - OVERLAY EXECUTIVO */
        #ads-bloco-2 { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: none; opacity: 0; transition: opacity 0.4s ease; }
        .corp-overlay { 
            width: 100%; height: 100%; background: rgba(26, 26, 27, 0.9); 
            display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);
        }
        .corp-modal-card { 
            width: 90%; max-width: 400px; background: #fff; border-radius: 12px;
            padding: 20px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .corp-modal-close { 
            position: absolute; top: -15px; right: -15px; width: 35px; height: 35px;
            background: #fff; border: none; border-radius: 50%; font-size: 22px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); cursor: pointer; display: none;
        }
        .corp-modal-close:not([disabled]) { display: block; }

        .corp-slot-main { height: 300px; background: var(--corp-gray); border-radius: 6px; margin-bottom: 15px; border: 1px solid var(--corp-border); }
        .corp-slot-small { height: 90px; background: var(--corp-gray); border-radius: 4px; display: flex; align-items: center; justify-content: center; }

        .placeholder-text { color: #bcc0c4; font-size: 12px; font-family: sans-serif; font-weight: 500; }

        /* FOOTER & PROGRESS */
        .corp-progress-bg { width: 100%; height: 3px; background: var(--corp-gray); border-radius: 2px; margin-bottom: 10px; overflow: hidden; }
        .corp-progress-fill { width: 0%; height: 100%; background: var(--corp-accent); transition: width 0.1s linear; }
        .corp-timer-text { font-family: sans-serif; font-size: 11px; color: #878a8c; text-align: center; margin-bottom: 15px; }
        
        .corp-cta-button { 
            display: block; width: 100%; padding: 14px; background: var(--corp-accent);
            color: #fff; text-align: center; text-decoration: none; border-radius: 6px;
            font-family: sans-serif; font-weight: 700; font-size: 14px; transition: filter 0.2s;
        }
        .corp-cta-button:active { transform: scale(0.98); }

        /* RESPONSIVIDADE */
        @media (max-height: 550px) {
            .corp-slot-main { height: 150px; }
            .corp-modal-card { padding: 10px; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco1);
    document.body.appendChild(bloco2);
    document.body.appendChild(bloco3);

    // === 3. LÓGICA DE EXECUÇÃO ===

    function runBloco1() {
        setTimeout(() => { bloco1.style.bottom = "0"; }, 2000);
    }
    document.getElementById('close-b1').onclick = () => {
        bloco1.style.bottom = "-200px";
        setTimeout(runBloco1, 20000);
    };

    function runBloco3() {
        setTimeout(() => { bloco3.style.top = "0"; }, 4000);
    }
    document.getElementById('close-b3').onclick = () => {
        bloco3.style.top = "-200px";
        setTimeout(runBloco3, 25000);
    };

    function runBloco2() {
        setTimeout(() => {
            bloco2.style.display = "block";
            setTimeout(() => { bloco2.style.opacity = "1"; }, 50);
            
            let time = 10;
            const btnClose = document.getElementById('close-b2');
            const timer = document.getElementById('timer-b2');
            const progress = document.getElementById('progress-bar-b2');
            
            btnClose.disabled = true;

            const interval = setInterval(() => {
                if (isTabActive) {
                    if (time > 0) {
                        time--;
                        timer.innerText = `O conteúdo será liberado em ${time}s`;
                        progress.style.width = `${(10 - time) * 10}%`;
                    } else {
                        clearInterval(interval);
                        timer.innerText = "Conteúdo Liberado";
                        btnClose.disabled = false;
                    }
                } else {
                    timer.innerText = "Cronômetro pausado...";
                }
            }, 1000);
        }, 10000);
    }

    document.getElementById('close-b2').onclick = () => {
        bloco2.style.opacity = "0";
        setTimeout(() => { 
            bloco2.style.display = "none";
            setTimeout(runBloco2, 120000); 
        }, 4000);
    };

    // INICIAR
    runBloco1();
    runBloco2();
    runBloco3();

})();
