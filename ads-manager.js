co3();

})();
(function() {
    // === CONFIGURAÇÃO DE ESTADO (PAUSA) ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => {
        isTabActive = !document.hidden;
    });

    // === 1. ESTRUTURA DOS BLOCOS ===

    // BLOCO 1 (GAVETA INFERIOR)
    const bloco1 = document.createElement('div');
    bloco1.id = 'ads-bloco-1';
    bloco1.innerHTML = `
        <div class="bloco-wrapper-bottom">
            <button id="close-b1" class="btn-close-rect ad-click-effect">FECHAR</button>
            <div class="ad-content">
                <p class="ad-tag">PUBLICIDADE | BLOCO 1</p>
                <div id="slot-b1" style="height:100px; background:#eee; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <span style="font-family:sans-serif; color:#999; font-size:12px;">BANNER PUBLICITÁRIO</span>
                </div>
            </div>
        </div>
    `;

    // BLOCO 2 (INTERSTITIAL REFINADO)
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <button id="close-b2" class="btn-glass-top-left ad-click-effect" disabled>FECHAR</button>
        <div class="interstitial-modal">
            <div class="media-container-rect">
                <p class="ad-tag">PUBLICIDADE | BLOCO 2</p>
                <div id="slot-b2" style="height:350px; background:#ddd; display:flex; align-items:center; justify-content:center; position:relative;">
                    <a href="#" target="_blank" class="btn-learn-more ad-click-effect">SABER MAIS</a>
                </div>
                <div class="progress-container">
                    <div id="progress-bar-b2"></div>
                </div>
            </div>
        </div>
        <div id="timer-b2" class="timer-glass-bottom-right">AGUARDE...</div>
    `;

    // BLOCO 3 (TOPO)
    const bloco3 = document.createElement('div');
    bloco3.id = 'ads-bloco-3';
    bloco3.innerHTML = `
        <div class="bloco-wrapper-top">
            <div class="ad-content">
                <p class="ad-tag">PUBLICIDADE | BLOCO 3</p>
                <div id="slot-b3" style="height:100px; background:#eee; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <span style="font-family:sans-serif; color:#999; font-size:12px;">BANNER TOPO</span>
                </div>
            </div>
            <button id="close-b3" class="btn-close-rect-bottom ad-click-effect">FECHAR</button>
        </div>
    `;

    // === 2. ESTILIZAÇÃO COMPLETA ===
    const style = document.createElement('style');
    style.textContent = `
        .ad-tag { font-size: 8px; color: #888; text-align: center; font-weight: 700; letter-spacing: 2px; margin: 4px 0; font-family: sans-serif; }
        
        /* Melhoria 5: Efeito de Clique/Feedback */
        .ad-click-effect:active { transform: scale(0.95); transition: transform 0.1s; }
        .ad-click-effect { transition: transform 0.2s ease, background 0.3s; }

        /* BLOCO 1 */
        #ads-bloco-1 { position: fixed; bottom: -100%; left: 0; width: 100%; z-index: 9999; transition: bottom 0.6s cubic-bezier(0.2, 1, 0.3, 1); display: flex; justify-content: center; }
        .bloco-wrapper-bottom { width: 100%; max-width: 500px; background: #fff; border-top: 3px solid #121212; padding: 10px; box-shadow: 0 -5px 20px rgba(0,0,0,0.2); position: relative; }
        .btn-close-rect { position: absolute; top: -28px; right: 0; background: #121212; color: #fff; border: none; padding: 5px 15px; font-size: 10px; font-weight: 800; cursor: pointer; }

        /* BLOCO 3 */
        #ads-bloco-3 { position: fixed; top: -100%; left: 0; width: 100%; height: 30%; z-index: 9998; transition: top 0.6s cubic-bezier(0.2, 1, 0.3, 1); display: flex; justify-content: center; }
        .bloco-wrapper-top { width: 100%; height: 100%; max-width: 500px; background: #fff; border-bottom: 3px solid #121212; padding: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); position: relative; display: flex; flex-direction: column; justify-content: center; }
        .btn-close-rect-bottom { position: absolute; bottom: -28px; right: 0; background: #121212; color: #fff; border: none; padding: 5px 15px; font-size: 10px; font-weight: 800; cursor: pointer; }

        /* BLOCO 2 & Melhoria 3 (Saber Mais) */
        #ads-bloco-2 { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); z-index: 10000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.5s; }
        .btn-glass-top-left { position: fixed; top: 30px; left: 30px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.6); padding: 8px 16px; font-size: 11px; font-weight: 600; letter-spacing: 2px; backdrop-filter: blur(10px); cursor: not-allowed; }
        .btn-glass-top-left.ready { background: rgba(193, 18, 31, 0.8); color: #fff; border-color: transparent; cursor: pointer; opacity: 1; }
        
        .btn-learn-more { position: absolute; bottom: 20px; background: #121212; color: #fff; text-decoration: none; padding: 12px 30px; font-family: sans-serif; font-weight: 900; font-size: 12px; letter-spacing: 1px; box-shadow: 5px 5px 0px rgba(0,0,0,0.2); }
        .btn-learn-more:hover { background: #c1121f; }

        .timer-glass-bottom-right { position: fixed; bottom: 30px; right: 30px; background: rgba(40, 40, 40, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #ddd; padding: 8px 16px; font-size: 10px; font-weight: 700; letter-spacing: 1px; backdrop-filter: blur(10px); }
        .progress-container { width: 100%; height: 4px; background: #eee; margin-top: 5px; overflow: hidden; }
        #progress-bar-b2 { width: 0%; height: 100%; background: #c1121f; transition: width 0.1s linear; }
        .media-container-rect { background: #fff; padding: 6px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); width: 80vw; max-width: 320px; }

        /* RESPONSIVIDADE LANDSCAPE */
        @media (orientation: landscape) and (max-height: 500px) {
            .media-container-rect { width: 50vw; max-height: 75vh; }
            #slot-b2 { height: 180px !important; }
            #ads-bloco-3 { display: none; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco1);
    document.body.appendChild(bloco2);
    document.body.appendChild(bloco3);

    // === 3. LÓGICA DE TEMPOS E REPETIÇÃO ===

    function runBloco1() {
        setTimeout(() => { bloco1.style.bottom = "0"; }, 2000);
    }
    document.getElementById('close-b1').onclick = () => {
        bloco1.style.bottom = "-100%";
        setTimeout(runBloco1, 20000);
    };

    function runBloco3() {
        setTimeout(() => { bloco3.style.top = "0"; }, 4000);
    }
    document.getElementById('close-b3').onclick = () => {
        bloco3.style.top = "-100%";
        setTimeout(runBloco3, 25000);
    };

    function runBloco2() {
        setTimeout(() => {
            bloco2.style.display = "flex";
            setTimeout(() => { bloco2.style.opacity = "1"; }, 50);
            
            let totalTime = 10;
            let remainingTime = totalTime;
            const btn = document.getElementById('close-b2');
            const timerLabel = document.getElementById('timer-b2');
            const progressBar = document.getElementById('progress-bar-b2');
            
            btn.disabled = true;
            btn.classList.remove('ready');
            progressBar.style.width = "0%";

            const counter = setInterval(() => {
                if (isTabActive) {
                    if (remainingTime > 0) {
                        remainingTime--;
                        timerLabel.innerText = `DISPONÍVEL EM ${remainingTime}S`;
                        let progress = ((totalTime - remainingTime) / totalTime) * 100;
                        progressBar.style.width = `${progress}%`;
                    } else {
                        clearInterval(counter);
                        timerLabel.innerText = "PRONTO PARA FECHAR";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                } else {
                    timerLabel.innerText = "PAUSADO (VOLTE)";
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

    runBloco1();
    runBloco2();
    runBloco3();
})();
