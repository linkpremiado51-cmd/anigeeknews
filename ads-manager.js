(function() {
    // 1. CRIAÇÃO DO ELEMENTO (O anúncio em si)
    const adOverlay = document.createElement('div');
    adOverlay.id = 'interstitial-ad-overlay';
    adOverlay.innerHTML = `
        <div class="ad-modal">
            <button id="close-ad-timer" disabled>Aguarde...</button>
            <div class="ad-content-full">
                <p class="ad-label">PUBLICIDADE</p>
                <div id="interstitial-slot">
                    <img src="https://via.placeholder.com/300x450" alt="Anúncio" style="max-width: 100%; border-radius: 8px; display: block; margin: 0 auto;">
                </div>
            </div>
        </div>
    `;

    // 2. ESTILIZAÇÃO (Resolve o botão cortado e adiciona o desfoque)
    const style = document.createElement('style');
    style.textContent = `
        #interstitial-ad-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7); 
            backdrop-filter: blur(12px); /* Efeito de vidro embaçado */
            -webkit-backdrop-filter: blur(12px);
            z-index: 1000000;
            display: none; /* Invisível até o tempo de ativação */
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.6s ease;
        }

        #interstitial-ad-overlay.show {
            display: flex;
            opacity: 1;
        }

        .ad-modal {
            position: relative;
            width: 85%;
            max-width: 350px;
            background: #fff;
            padding: 25px 15px 15px 15px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* AJUSTE DO BOTÃO: Fora da caixa para não cortar */
        #close-ad-timer {
            position: absolute;
            top: -45px;
            right: 0;
            background: #ffffff;
            border: none;
            padding: 8px 20px;
            border-radius: 30px;
            font-family: 'Franklin Gothic', sans-serif;
            font-size: 13px;
            font-weight: 800;
            color: #000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            cursor: not-allowed;
            min-width: 100px;
        }

        #close-ad-timer.ready {
            cursor: pointer;
            background: #c1121f; /* Vermelho da sua marca */
            color: #fff;
        }

        .ad-label {
            font-family: sans-serif;
            font-size: 9px;
            font-weight: bold;
            color: #bbb;
            text-align: center;
            margin-bottom: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(adOverlay);

    // 3. LÓGICA DE TEMPO
    // O anúncio aparece 10 segundos após carregar o site
    setTimeout(() => {
        adOverlay.classList.add('show');
        iniciarContagem(7); // O usuário deve esperar 7 segundos para fechar
    }, 10000); 

    function iniciarContagem(tempo) {
        const botao = document.getElementById('close-ad-timer');
        let contador = tempo;

        const contagemRegressiva = setInterval(() => {
            if (contador > 0) {
                botao.innerText = `FECHAR EM ${contador}s`;
                contador--;
            } else {
                clearInterval(contagemRegressiva);
                botao.innerText = "FECHAR X";
                botao.disabled = false;
                botao.classList.add('ready');
                
                // Ação de fechar
                botao.onclick = () => {
                    adOverlay.style.opacity = '0';
                    setTimeout(() => adOverlay.remove(), 600);
                };
            }
        }, 1000);
    }
})();
