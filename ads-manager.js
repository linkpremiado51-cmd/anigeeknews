(function() {
    // === 1. CONFIGURAÇÃO DA GAVETA (BOTTOM DRAWER - 2 SEGUNDOS) ===
    const drawer = document.createElement('div');
    drawer.id = 'ads-bottom-drawer';
    drawer.innerHTML = `
        <div class="drawer-wrapper">
            <button id="close-drawer-btn">×</button>
            <div class="drawer-content">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="drawer-ad-slot">
                    <img src="https://via.placeholder.com/320x50" alt="Banner" style="max-width:100%">
                </div>
            </div>
        </div>
    `;

    // === 2. CONFIGURAÇÃO DO INTERSTITIAL (TELA CHEIA - 10 SEGUNDOS) ===
    const interstitial = document.createElement('div');
    interstitial.id = 'ads-full-overlay';
    interstitial.innerHTML = `
        <div class="interstitial-modal">
            <button id="close-full-btn" disabled>Aguarde...</button>
            <div class="interstitial-content">
                <p class="ad-tag">PUBLICIDADE</p>
                <img src="https://via.placeholder.com/300x400" alt="Ads" style="max-width:100%; border-radius:8px;">
            </div>
        </div>
    `;

    // === 3. ESTILIZAÇÃO UNIFICADA ===
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos da Gaveta */
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

        /* Estilos do Interstitial (Tela Cheia) */
        #ads-full-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            z-index: 1000000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        #ads-full-overlay.show { display: flex; opacity: 1; }
        .interstitial-modal {
            position: relative; width: 85%; max-width: 350px; background: #fff;
            padding: 20px; border-radius: 20px; text-align: center;
        }
        #close-full-btn {
            position: absolute; top: -45px; right: 0; padding: 8px 15px;
            background: #fff; border: none; border-radius: 20px; font-weight: bold;
            cursor: not-allowed; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        #close-full-btn.ready { cursor: pointer; background: #c1121f; color: #fff; }

        .ad-tag { font-size: 9px; color: #999; margin-bottom: 5px; text-align: center; font-family: sans-serif; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(drawer);
    document.body.appendChild(interstitial);

    // === 4. LÓGICA DE ATIVAÇÃO ===

    // Gatilho da Gaveta (2 segundos)
    setTimeout(() => {
        drawer.classList.add('active');
    }, 2000);

    document.getElementById('close-drawer-btn').onclick = () => {
        drawer.classList.remove('active');
    };

    // Gatilho do Interstitial (10 segundos)
    setTimeout(() => {
        interstitial.classList.add('show');
        let count = 5;
        const btn = document.getElementById('close-full-btn');
        const timer = setInterval(() => {
            if(count > 0) {
                btn.innerText = `Fechar em ${count}s`;
                count--;
            } else {
                clearInterval(timer);
                btn.innerText = "FECHAR X";
                btn.disabled = false;
                btn.classList.add('ready');
                btn.onclick = () => {
                    interstitial.style.opacity = '0';
                    setTimeout(() => interstitial.remove(), 500);
                };
            }
        }, 1000);
    }, 10000);
})();
