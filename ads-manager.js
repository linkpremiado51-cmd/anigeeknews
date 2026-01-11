(function() {
    // === 1. GAVETA (BOTTOM DRAWER) ===
    const drawer = document.createElement('div');
    drawer.id = 'ads-bottom-drawer';
    drawer.innerHTML = `
        <div class="drawer-wrapper">
            <button id="close-drawer-btn">FECHAR</button>
            <div class="drawer-content">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="drawer-ad-slot" style="width:320px; height:50px; background:#f9f9f9; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                    </div>
            </div>
        </div>
    `;

    // === 2. INTERSTITIAL (TELA CHEIA PREMIUM) ===
    const interstitial = document.createElement('div');
    interstitial.id = 'ads-full-overlay';
    interstitial.innerHTML = `
        <button id="close-full-btn" disabled>FECHAR X</button>
        
        <div class="interstitial-modal">
            <div class="interstitial-media-container">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="interstitial-media-slot">
                    <img src="https://via.placeholder.com/300x450" alt="Anúncio Profissional" style="max-width:100%; height:auto; display:block;">
                </div>
            </div>
        </div>

        <div id="ad-timer-display">AGUARDE...</div>
    `;

    // === 3. ESTILIZAÇÃO (VISUAL RETANGULAR E POSIÇÕES FIXAS) ===
    const style = document.createElement('style');
    style.textContent = `
        /* --- GAVETA --- */
        #ads-bottom-drawer {
            position: fixed; bottom: -120px; left: 0; width: 100%;
            z-index: 99999; transition: bottom 0.6s cubic-bezier(0.2, 1, 0.3, 1);
            display: flex; justify-content: center;
        }
        #ads-bottom-drawer.active { bottom: 0; }
        .drawer-wrapper { 
            width: 100%; max-width: 500px; background: #fff; 
            box-shadow: 0 -5px 25px rgba(0,0,0,0.1);
            padding: 12px; position: relative; border-top: 2px solid #121212;
        }
        #close-drawer-btn {
            position: absolute; top: -25px; right: 0; 
            background: #121212; color: #fff; border: none;
            padding: 4px 12px; font-family: 'Franklin Gothic', sans-serif;
            font-size: 10px; font-weight: 800; cursor: pointer; letter-spacing: 1px;
        }

        /* --- INTERSTITIAL (TELA CHEIA) --- */
        #ads-full-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(18, 18, 18, 0.85); 
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            z-index: 1000000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        #ads-full-overlay.show { display: flex; opacity: 1; }
        
        .interstitial-modal {
            width: 85%; max-width: 320px;
            transform: scale(0.9); transition: transform 0.5s ease;
        }
        #ads-full-overlay.show .interstitial-modal { transform: scale(1); }

        /* Estilo do Botão de Fechar (Superior Esquerdo da Tela) */
        #close-full-btn {
            position: fixed; top: 20px; left: 20px;
            background: #fff; color: #000; border: none;
            padding: 10px 20px; font-family: 'Franklin Gothic', sans-serif;
            font-size: 12px; font-weight: 900; letter-spacing: 1.5px;
            cursor: not-allowed; opacity: 0.3; transition: all 0.3s;
            box-shadow: 5px 5px 0px rgba(0,0,0,0.2);
        }
        #close-full-btn.ready { opacity: 1; cursor: pointer; background: #c1121f; color: #fff; }

        /* Estilo do Cronômetro (Inferior Direito da Tela) */
        #ad-timer-display {
            position: fixed; bottom: 20px; right: 20px;
            background: #fff; color: #121212;
            padding: 10px 20px; font-family: 'Franklin Gothic', sans-serif;
            font-size: 11px; font-weight: 800; letter-spacing: 1px;
            border-left: 4px solid #c1121f;
            box-shadow: 5px 5px 0px rgba(0,0,0,0.2);
        }

        .interstitial-media-container {
            background: #fff; padding: 5px;
            border: 1px solid #333; box-shadow: 15px 15px 0px rgba(0,0,0,0.3);
        }

        .ad-tag { font-size: 9px; color: #777; margin: 5px 0; text-align: center; font-family: sans-serif; font-weight: 700; letter-spacing: 2px; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(drawer);
    document.body.appendChild(interstitial);

    // === 4. LÓGICA DE TEMPO E INTERAÇÃO ===

    // Gaveta aparece em 2s
    setTimeout(() => { drawer.classList.add('active'); }, 2000);
    document.getElementById('close-drawer-btn').onclick = () => { drawer.classList.remove('active'); };

    // Interstitial aparece em 10s
    setTimeout(() => {
        interstitial.classList.add('show');
        let count = 10;
        const btnClose = document.getElementById('close-full-btn');
        const timerLabel = document.getElementById('ad-timer-display');
        
        const countdown = setInterval(() => {
            if(count > 0) {
                timerLabel.innerText = `DISPONÍVEL EM ${count}S`;
                count--;
            } else {
                clearInterval(countdown);
                timerLabel.innerText = "PRONTO PARA FECHAR";
                btnClose.disabled = false;
                btnClose.classList.add('ready');
                btnClose.onclick = () => {
                    interstitial.style.opacity = '0';
                    setTimeout(() => interstitial.remove(), 500);
                };
            }
        }, 1000);
    }, 10000);
})();
