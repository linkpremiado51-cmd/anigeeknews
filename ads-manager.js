(function() {
    // === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // === 2. CONTAINER MESTRE (ROOT) ===
    const adsRoot = document.createElement('div');
    adsRoot.id = 'industrial-ads-system';
    document.body.appendChild(adsRoot);

    // === 3. ESTILIZAÇÃO INDUSTRIAL (FULL WIDTH & SQUARE) ===
    const style = document.createElement('style');
    style.textContent = `
        #industrial-ads-system {
            font-family: 'Roboto', 'Helvetica', Arial, sans-serif;
            pointer-events: none;
            -webkit-font-smoothing: antialiased;
        }

        #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }

        /* Animação Shimmer Linear */
        .industrial-shimmer {
            background: #e0e0e0 linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%);
            background-size: 200% 100%;
            animation: industrial-shimmer-anim 1.2s infinite linear;
        }
        @keyframes industrial-shimmer-anim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Estrutura Full Width (Blocos 1 e 3) */
        .industrial-banner {
            position: fixed; left: 0; width: 100%;
            z-index: 2147483646; background: #ffffff;
            border-top: 2px solid #1a73e8; border-bottom: 2px solid #1a73e8;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ind-bottom { bottom: -450px; }
        .ind-top { top: -450px; }

        .ind-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 12px 20px; }

        .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .ind-label { font-size: 10px; font-weight: 900; color: #1a73e8; text-transform: uppercase; letter-spacing: 2px; }
        
        /* Slot de Banner Clickadilla (Otimizado para 300px+ se necessário) */
        .ind-slot-banner { width: 100%; height: 100px; border: 1px solid #eee; }

        /* Bloco 2 - Interstitial Industrial Full */
        .ind-overlay {
            position: fixed; inset: 0; background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(8px); z-index: 2147483647;
            display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.4s ease;
        }
        .ind-modal {
            background: #fff; width: 100%; max-width: 450px;
            padding: 30px; border-radius: 0; /* Zero bordas */
            border-left: 8px solid #1a73e8;
            box-shadow: 0 30px 60px rgba(0,0,0,0.5);
            transform: scale(0.95); transition: transform 0.4s ease;
        }

        .ind-slot-hero { width: 100%; height: 320px; margin-bottom: 20px; }

        /* UI de Controle */
        .ind-btn-skip {
            background: #eee; border: 1px solid #ccc; padding: 10px 25px;
            font-size: 12px; font-weight: 700; color: #333; cursor: not-allowed;
            text-transform: uppercase; border-radius: 0;
        }
        .ind-btn-skip.ready { background: #1a73e8; color: #fff; border-color: #1a73e8; cursor: pointer; }

        .ind-progress-bg { width: 100%; height: 8px; background: #eee; border-radius: 0; margin-bottom: 15px; overflow: hidden; }
        .ind-progress-fill { width: 0%; height: 100%; background: #1a73e8; transition: width 0.1s linear; }

        .ind-footer { display: flex; justify-content: space-between; align-items: center; }
        .ind-cta {
            background: #000; color: #fff; text-decoration: none; padding: 12px 30px;
            font-size: 13px; font-weight: 700; text-transform: uppercase; border-radius: 0;
            transition: background 0.2s;
        }
        .ind-cta:hover { background: #1a73e8; }

        .ind-close-x { background: none; border: none; font-size: 24px; cursor: pointer; color: #000; line-height: 1; }
    `;
    document.head.appendChild(style);

    // === 4. ESTRUTURA DOS BLOCOS ===
    adsRoot.innerHTML = `
        <div id="ind-block-1" class="industrial-banner ind-bottom">
            <div class="ind-container">
                <div class="ind-header">
                    <span class="ind-label">Publicidade Patrocinada</span>
                    <button id="ind-close-1" class="ind-close-x">&times;</button>
                </div>
                <div class="ind-slot-banner industrial-shimmer"></div>
            </div>
        </div>

        <div id="ind-block-2-overlay" class="ind-overlay">
            <div class="ind-modal">
                <div class="ind-header">
                    <span class="ind-label">Aviso de Publicidade</span>
                    <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>
                </div>
                <div class="ind-slot-hero industrial-shimmer"></div>
                <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>
                <div class="ind-footer">
                    <span id="ind-timer-txt" style="font-size:11px; font-weight:700; color:#666;">SINCRONIZANDO...</span>
                    <a href="#" target="_blank" class="ind-cta">Visitar Agora</a>
                </div>
            </div>
        </div>

        <div id="ind-block-3" class="industrial-banner ind-top">
            <div class="ind-container">
                <div class="ind-header">
                    <span class="ind-label">Recomendado para você</span>
                    <button id="ind-close-3" style="font-size:11px; font-weight:900; background:#000; color:#fff; border:none; padding:5px 15px; cursor:pointer; text-transform:uppercase;">Fechar</button>
                </div>
                <div class="ind-slot-banner industrial-shimmer"></div>
            </div>
        </div>
    `;

    // === 5. LÓGICA DE EXECUÇÃO E TEMPO ===
    const b1 = document.getElementById('ind-block-1');
    const b2Overlay = document.getElementById('ind-block-2-overlay');
    const b2Modal = b2Overlay.querySelector('.ind-modal');
    const b3 = document.getElementById('ind-block-3');

    // Funções de Controle de Visibilidade
    const openB1 = () => { b1.style.bottom = '0px'; };
    const openB3 = () => { b3.style.top = '0px'; };

    // Bloco 1: Fecha e volta em 20 segundos
    document.getElementById('ind-close-1').onclick = () => {
        b1.style.bottom = '-450px';
        setTimeout(openB1, 20000);
    };

    // Bloco 3: Fecha e volta em 25 segundos
    document.getElementById('ind-close-3').onclick = () => {
        b3.style.top = '-450px';
        setTimeout(openB3, 25000);
    };

    function startInterstitialCycle() {
        // Surge após 10 segundos iniciais
        setTimeout(() => {
            b2Overlay.style.display = 'flex';
            setTimeout(() => {
                b2Overlay.style.opacity = '1';
                b2Modal.style.transform = 'scale(1)';
            }, 50);

            let timeLeft = 10;
            const btn = document.getElementById('ind-close-2');
            const prog = document.getElementById('ind-prog-2');
            const txt = document.getElementById('ind-timer-txt');

            const countdown = setInterval(() => {
                if (isTabActive) {
                    if (timeLeft > 0) {
                        timeLeft--;
                        txt.innerText = `O CONTEÚDO SERÁ LIBERADO EM ${timeLeft}S`;
                        prog.style.width = `${(10 - timeLeft) * 10}%`;
                    } else {
                        clearInterval(countdown);
                        txt.innerText = "ACESSO LIBERADO";
                        btn.innerText = "PULAR ANÚNCIO";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                } else {
                    txt.innerText = "CRONÔMETRO PAUSADO";
                }
            }, 1000);

            btn.onclick = () => {
                b2Overlay.style.opacity = '0';
                b2Modal.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    b2Overlay.style.display = 'none';
                    // Reinicia o ciclo após 120 segundos (conforme lógica inicial de 2 min)
                    setTimeout(startInterstitialCycle, 120000);
                }, 400).
                // Reset do botão para o próximo ciclo
                timeLeft = 10;
                btn.disabled = true;
                btn.classList.remove('ready');
                btn.innerText = "Aguarde";
                prog.style.width = "0%";
            };
        }, 10000); 
    }

    // Inicialização do Sistema
    setTimeout(openB1, 2000); // Bloco 1 aparece em 2s
    setTimeout(openB3, 4000); // Bloco 3 aparece em 4s
    startInterstitialCycle();  // Inicia motor do Interstitial

})();
