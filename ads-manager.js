(function() {
    // === 1. ESTRUTURA DOS BLOCOS ===

    // BLOCO 1 (GAVETA INFERIOR)
    const bloco1 = document.createElement('div');
    bloco1.id = 'ads-bloco-1';
    bloco1.innerHTML = `
        <div class="bloco-wrapper-bottom">
            <button id="close-b1" class="btn-close-rect">FECHAR</button>
            <div class="ad-content">
                <p class="ad-tag">PUBLICIDADE | BLOCO 1</p>
                <div class="slot-img" style="height:100px; background:#eee;"></div>
            </div>
        </div>
    `;

    // BLOCO 2 (INTERSTITIAL TELA CHEIA)
    const bloco2 = document.createElement('div');
    bloco2.id = 'ads-bloco-2';
    bloco2.innerHTML = `
        <button id="close-b2" class="btn-screen-top-left" disabled>FECHAR X</button>
        <div class="interstitial-modal">
            <div class="media-container-rect">
                <p class="ad-tag">PUBLICIDADE | BLOCO 2</p>
                <div class="slot-media-full" style="height:350px; background:#ddd;"></div>
            </div>
        </div>
        <div id="timer-b2" class="screen-bottom-right">AGUARDE...</div>
    `;

    // BLOCO 3 (TOPO - 30% DA TELA)
    const bloco3 = document.createElement('div');
    bloco3.id = 'ads-bloco-3';
    bloco3.innerHTML = `
        <div class="bloco-wrapper-top">
            <div class="ad-content">
                <p class="ad-tag">PUBLICIDADE | BLOCO 3</p>
                <div class="slot-img" style="height:100px; background:#eee;"></div>
            </div>
            <button id="close-b3" class="btn-close-rect-bottom">FECHAR</button>
        </div>
    `;

    // === 2. ESTILIZAÇÃO PREMIUM (RETANGULAR) ===
    const style = document.createElement('style');
    style.textContent = `
        /* Gerais */
        .ad-tag { font-size: 8px; color: #888; text-align: center; font-weight: 700; letter-spacing: 2px; margin: 4px 0; font-family: sans-serif; }
        
        /* BLOCO 1 - INFERIOR */
        #ads-bloco-1 { position: fixed; bottom: -100%; left: 0; width: 100%; z-index: 9999; transition: bottom 0.6s cubic-bezier(0.2, 1, 0.3, 1); display: flex; justify-content: center; }
        .bloco-wrapper-bottom { width: 100%; max-width: 500px; background: #fff; border-top: 3px solid #121212; padding: 10px; box-shadow: 0 -5px 20px rgba(0,0,0,0.2); }
        .btn-close-rect { position: absolute; top: -28px; right: 0; background: #121212; color: #fff; border: none; padding: 5px 15px; font-size: 10px; font-weight: 800; cursor: pointer; }

        /* BLOCO 3 - SUPERIOR (30% DA TELA) */
        #ads-bloco-3 { position: fixed; top: -100%; left: 0; width: 100%; height: 30%; z-index: 9998; transition: top 0.6s cubic-bezier(0.2, 1, 0.3, 1); display: flex; justify-content: center; }
        .bloco-wrapper-top { width: 100%; height: 100%; max-width: 500px; background: #fff; border-bottom: 3px solid #121212; padding: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); position: relative; display: flex; flex-direction: column; justify-content: center; }
        .btn-close-rect-bottom { position: absolute; bottom: -28px; right: 0; background: #121212; color: #fff; border: none; padding: 5px 15px; font-size: 10px; font-weight: 800; cursor: pointer; }

        /* BLOCO 2 - INTERSTITIAL */
        #ads-bloco-2 { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10,10,10,0.85); backdrop-filter: blur(20px); z-index: 10000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.5s; }
        .media-container-rect { background: #fff; padding: 8px; border: 1px solid #333; box-shadow: 15px 15px 0px rgba(0,0,0,0.4); width: 85vw; max-width: 320px; }
        .btn-screen-top-left { position: fixed; top: 20px; left: 20px; background: #fff; color: #000; border: none; padding: 12px 25px; font-weight: 900; letter-spacing: 1px; box-shadow: 6px 6px 0px rgba(0,0,0,0.3); opacity: 0.3; }
        .btn-screen-top-left.ready { opacity: 1; cursor: pointer; background: #c1121f; color: #fff; }
        .screen-bottom-right { position: fixed; bottom: 20px; right: 20px; background: #fff; color: #121212; padding: 12px 25px; font-weight: 800; border-left: 5px solid #c1121f; box-shadow: 6px 6px 0px rgba(0,0,0,0.3); }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bloco1);
    document.body.appendChild(bloco2);
    document.body.appendChild(bloco3);

    // === 3. LÓGICA DE TEMPOS E LOOPS ===

    // Bloco 1 (Inferior) - Reaparece em 20s
    function runBloco1() {
        setTimeout(() => { bloco1.style.bottom = "0"; }, 2000);
    }
    document.getElementById('close-b1').onclick = () => {
        bloco1.style.bottom = "-100%";
        setTimeout(runBloco1, 20000);
    };

    // Bloco 3 (Superior) - Reaparece em 25s
    function runBloco3() {
        setTimeout(() => { bloco3.style.top = "0"; }, 4000);
    }
    document.getElementById('close-b3').onclick = () => {
        bloco3.style.top = "-100%";
        setTimeout(runBloco3, 25000);
    };

    // Bloco 2 (Interstitial) - Reaparece em 2 minutos (120s)
    function runBloco2() {
        setTimeout(() => {
            bloco2.style.display = "flex";
            setTimeout(() => { bloco2.style.opacity = "1"; }, 50);
            
            let count = 10;
            const btn = document.getElementById('close-b2');
            const timer = document.getElementById('timer-b2');
            btn.disabled = true;
            btn.classList.remove('ready');

            const counter = setInterval(() => {
                if(count > 0) {
                    timer.innerText = `DISPONÍVEL EM ${count}S`;
                    count--;
                } else {
                    clearInterval(counter);
                    timer.innerText = "PRONTO PARA FECHAR";
                    btn.disabled = false;
                    btn.classList.add('ready');
                }
            }, 1000);
        }, 10000); // Primeira vez em 10s
    }
    document.getElementById('close-b2').onclick = () => {
        bloco2.style.opacity = "0";
        setTimeout(() => { 
            bloco2.style.display = "none";
            setTimeout(runBloco2, 120000); // Loop de 2 minutos
        }, 500);
    };

    // INICIAR TUDO
    runBloco1();
    runBloco2();
    runBloco3();

})();
