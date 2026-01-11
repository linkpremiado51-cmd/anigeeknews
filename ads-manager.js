(function() {
    // 1. Cria o container do anúncio Interstitial (Tela Cheia)
    const adOverlay = document.createElement('div');
    adOverlay.id = 'interstitial-ad-overlay';
    adOverlay.innerHTML = `
        <div class="ad-modal">
            <button id="close-ad-timer" disabled>Aguarde...</button>
            <div class="ad-content-full">
                <p class="ad-label">PUBLICIDADE</p>
                <div id="interstitial-slot">
                    <img src="https://via.placeholder.com/300x450" alt="Anúncio" style="max-width: 100%; border-radius: 8px;">
                </div>
            </div>
        </div>
    `;

    // 2. CSS com efeito de desfoque (Blur) e botão arrumado
    const style = document.createElement('style');
    style.textContent = `
        #interstitial-ad-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6); /* Fundo escuro leve */
            backdrop-filter: blur(10px); /* O efeito embaçado no seu site */
            -webkit-backdrop-filter: blur(10px);
            z-index: 999999;
            display: none; /* Começa escondido */
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        #interstitial-ad-overlay.show {
            display: flex;
            opacity: 1;
        }

        .ad-modal {
            position: relative;
            width: 90%;
            max-width: 400px;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            text-align: center;
        }

        /* Botão de Fechar Arrumado (Não fica cortado) */
        #close-ad-timer {
            position: absolute;
            top: -50px; /* Fica acima da caixa branca */
            right: 0;
            background: #fff;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            font-family: sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            cursor: not-allowed;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        #close-ad-timer.ready {
            cursor: pointer;
            background: #c1121f; /* Cor do seu site */
            color: white;
        }

        .ad-label {
            font-family: sans-serif;
            font-size: 10px;
            color: #999;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(adOverlay);

    // 3. Lógica de Tempo (Aparece após 10s e libera o fechar)
    setTimeout(() => {
        adOverlay.classList.add('show');
        iniciarContagemRegressiva(5); // 5 segundos para poder fechar após aparecer
    }, 10000); // Aparece após 10 segundos de site aberto

    function iniciarContagemRegressiva(segundos) {
        const btn = document.getElementById('close-ad-timer');
        let restante = segundos;

        const intervalo = setInterval(() => {
            if (restante > 0) {
                btn.innerText = `Fechar em ${restante}s`;
                restante--;
            } else {
                clearInterval(intervalo);
                btn.innerText = 'Fechar X';
                btn.disabled = false;
                btn.classList.add('ready');
                btn.onclick = () => {
                    adOverlay.style.opacity = '0';
                    setTimeout(() => adOverlay.remove(), 500);
                };
            }
        }, 1000);
    }
})();
