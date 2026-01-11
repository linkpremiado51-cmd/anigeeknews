(function() {
    // === CONFIGURAÇÃO DE ESTADO ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => {
        isTabActive = !document.hidden;
    });

    // === ESTRUTURA DOS BLOCOS (Bloco 2 com Barra de Progresso) ===
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <button id="close-b2" class="btn-glass-top-left" disabled>FECHAR</button>
        <div class="interstitial-modal">
            <div class="media-container-rect">
                <p class="ad-tag">PUBLICIDADE | BLOCO 2</p>
                <div class="slot-media-full" style="height:350px; background:#ddd; display:flex; align-items:center; justify-content:center;">
                    </div>
                <div class="progress-container">
                    <div id="progress-bar-b2"></div>
                </div>
            </div>
        </div>
        <div id="timer-b2" class="timer-glass-bottom-right">AGUARDE...</div>
    `;

    // === ESTILIZAÇÃO REFINADA (Melhoria 8: Responsividade) ===
    const style = document.createElement('style');
    style.textContent = `
        /* BLOCO 2 - GLASSMORFISM */
        #ads-bloco-2 { 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(15, 15, 15, 0.7); 
            backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); 
            z-index: 10000; display: none; align-items: center; justify-content: center; 
            opacity: 0; transition: opacity 0.5s; 
        }

        .btn-glass-top-left { 
            position: fixed; top: 30px; left: 30px; 
            background: rgba(255, 255, 255, 0.1); 
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.6); 
            padding: 8px 16px; font-size: 11px; font-weight: 600; letter-spacing: 2px;
            backdrop-filter: blur(10px); cursor: not-allowed; transition: all 0.3s;
        }

        .btn-glass-top-left.ready { 
            background: rgba(193, 18, 31, 0.8); 
            color: #fff; border-color: transparent; cursor: pointer; opacity: 1;
        }

        .timer-glass-bottom-right { 
            position: fixed; bottom: 30px; right: 30px; 
            background: rgba(40, 40, 40, 0.6); 
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ddd; padding: 8px 16px; font-size: 10px; font-weight: 700;
            letter-spacing: 1px; backdrop-filter: blur(10px);
        }

        /* Estilo da Barra de Progresso */
        .progress-container { width: 100%; height: 4px; background: #eee; margin-top: 5px; overflow: hidden; }
        #progress-bar-b2 { width: 0%; height: 100%; background: #c1121f; transition: width 0.1s linear; }

        .media-container-rect { 
            background: #fff; padding: 6px; 
            box-shadow: 0 30px 60px rgba(0,0,0,0.5); 
            width: 80vw; max-width: 320px;
        }

        /* Melhoria 8: Responsividade para modo Paisagem (Landscape) */
        @media (orientation: landscape) and (max-height: 500px) {
            .media-container-rect { width: 50vw; max-height: 70vh; overflow: hidden; }
            .slot-media-full { height: 180px !important; }
            #ads-bloco-3 { display: none; } /* Esconde o topo em telas muito baixas */
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco2);

    // === LÓGICA DO CRONÔMETRO (Melhoria 6: Pausa) ===
    function runBloco2() {
        setTimeout(() => {
            bloco2.style.display = "flex";
            setTimeout(() => { bloco2.style.opacity = "1"; }, 50);
            
            let totalTime = 10;
            let remainingTime = totalTime;
            const btn = document.getElementById('close-b2');
            const timer = document.getElementById('timer-b2');
            const progressBar = document.getElementById('progress-bar-b2');

            const counter = setInterval(() => {
                // Melhoria 6: Só diminui o tempo se a aba estiver ativa
                if (isTabActive) {
                    if (remainingTime > 0) {
                        remainingTime--;
                        timer.innerText = `DISPONÍVEL EM ${remainingTime}S`;
                        
                        // Melhoria 7: Atualiza barra de progresso
                        let progress = ((totalTime - remainingTime) / totalTime) * 100;
                        progressBar.style.width = `${progress}%`;
                    } else {
                        clearInterval(counter);
                        timer.innerText = "PRONTO PARA FECHAR";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                } else {
                    timer.innerText = "PAUSADO (VOLTE PARA O SITE)";
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

    runBloco2();
})();
