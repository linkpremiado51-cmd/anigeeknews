(function() {
    // === 1. GAVETA (BOTTOM DRAWER) ===
    const drawer = document.createElement('div');
    drawer.id = 'ads-bottom-drawer';
    drawer.innerHTML = `
        <div class="drawer-wrapper">
            <button id="close-drawer-btn">×</button>
            <div class="drawer-content">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="drawer-ad-slot" style="width:320px; height:50px; background:#f0f0f0; margin:0 auto;">
                    </div>
            </div>
        </div>
    `;

    // === 2. INTERSTITIAL (TELA CHEIA) ===
    const interstitial = document.createElement('div');
    interstitial.id = 'ads-full-overlay';
    interstitial.innerHTML = `
        <div class="interstitial-modal">
            <button id="close-full-btn" disabled>X</button>
            
            <div class="interstitial-media-container">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="interstitial-media-slot">
                    <img src="https://via.placeholder.com/300x450" alt="Ads" style="max-width:100%; height:auto; display:block; border-radius:8px;">
                </div>
            </div>

            <div id="ad-timer-display">Aguarde...</div>
        </div>
    `;

    // === 3. ESTILIZAÇÃO (LAYOUT E BOTÕES) ===
    const style = document.createElement('style');
    style.textContent = `
        /* Gaveta */
        #ads-bottom-drawer {
            position: fixed; bottom: -120px; left: 0; width: 100%;
            z-index: 99999; transition: bottom 0.5s ease;
            display: flex; justify-content: center;
        }
        #ads-bottom-drawer.active { bottom: 0; }
        .drawer-wrapper { 
            width: 100%; max-width: 500px; background: #fff; 
            border-radius: 12px 12px 0 0; box-shadow: 0 -2px 15px rgba(0,0,0,0.2);
            padding: 10px; position: relative; border: 1px solid #ddd;
        }
        #close-drawer-btn {
            position: absolute; top: -15px; right: 10px; width: 30px; height: 30px;
            background: #fff; border: 1px solid #ddd; border-radius: 50%; cursor: pointer;
        }

        /* Interstitial Adaptado */
        #ads-full-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            z-index: 1000000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        #ads-full-overlay.show { display: flex; opacity: 1; }
        
        .interstitial-modal {
            position: relative; 
            width: 90%; 
            max-width: 350px; 
            min-height: 400px;
            background: transparent; /* Fundo transparente para focar na mídia */
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Botão Superior Esquerdo */
        #close-full-btn {
            position: absolute; top: -40px; left: 0;
            width: 35px; height: 35px; border-radius: 50%;
            border: none; background: #fff; color: #000;
            font-weight: bold; font-size: 18px; cursor: not-allowed;
            display: flex; align-items: center; justify-content: center;
            opacity: 0.5;
        }
        #close-full-btn.ready { opacity: 1; cursor: pointer; background: #c1121f; color: #fff; }

        /* Mídia Container */
        .interstitial-media-container {
            background: #fff; padding: 10px; border-radius: 12px;
            width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* Cronômetro Inferior Direito */
        #ad-timer-display {
            position: absolute; bottom: -40px; right: 0;
            background: rgba(255,255,255,0.9); padding: 5px 15px;
            border-radius: 20px; font-family: sans-serif; font-size: 12px;
            font-weight: bold; color: #333;
        }

        .ad-tag { font-size: 9px; color: #999; margin-bottom: 5px; text-align: center; font-family: sans-serif; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(drawer);
    document.body.appendChild(interstitial);

    // === 4. LÓGICA ===

    // Gaveta
    setTimeout(() => { drawer.classList.add('active'); }, 2000);
    document.getElementById('close-drawer-btn').onclick = () => { drawer.classList.remove('active'); };

    // Interstitial
    setTimeout(() => {
        interstitial.classList.add('show');
        let count = 10; // Cronômetro de 10 segundos
        const btnClose = document.getElementById('close-full-btn');
        const timerLabel = document.getElementById('ad-timer-display');
        
        const countdown = setInterval(() => {
            if(count > 0) {
                timerLabel.innerText = `O anúncio fechará em ${count}s`;
                count--;
            } else {
                clearInterval(countdown);
                timerLabel.innerText = "Você já pode fechar";
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
