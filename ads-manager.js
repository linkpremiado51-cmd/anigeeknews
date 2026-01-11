(function() {
    // 1. Cria a estrutura com classes para melhor controle
    const adContainer = document.createElement('div');
    adContainer.id = 'google-style-drawer';
    adContainer.innerHTML = `
        <div class="ad-wrapper">
            <div class="ad-handle">
                <button id="close-ad-btn" aria-label="Fechar anúncio">
                    <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
            <div class="ad-slot-container">
                <p style="color: #666; font-size: 10px; text-align: center; margin-bottom: 5px; font-family: sans-serif;">PUBLICIDADE</p>
                <div id="actual-ad-content"></div>
            </div>
        </div>
    `;

    // 2. CSS refinado (Estilo Moderno/Google)
    const style = document.createElement('style');
    style.textContent = `
        #google-style-drawer {
            position: fixed;
            bottom: -100%; /* Escondido */
            left: 0;
            width: 100%;
            z-index: 2147483647; /* Valor máximo de z-index */
            transition: bottom 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
            display: flex;
            justify-content: center;
        }

        #google-style-drawer.active {
            bottom: 0;
        }

        .ad-wrapper {
            width: 100%;
            max-width: 500px; /* Largura máxima típica de mobile ads */
            background: #ffffff;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
            border-radius: 12px 12px 0 0;
            overflow: hidden;
            border: 1px solid #e0e0e0;
            border-bottom: none;
        }

        .ad-handle {
            height: 24px;
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            border-bottom: 1px solid #eee;
        }

        #close-ad-btn {
            position: absolute;
            right: 5px;
            top: -15px; /* Botão flutuante acima da barra */
            width: 30px;
            height: 30px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            padding: 5px;
        }

        #close-ad-btn svg {
            fill: #5f6368;
            width: 18px;
            height: 18px;
        }

        .ad-slot-container {
            padding: 10px;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(adContainer);

    // 3. Lógica de aparição (Trigger)
    setTimeout(() => {
        adContainer.classList.add('active');
    }, 2000); // 2 segundos para não assustar o usuário instantaneamente

    document.getElementById('close-ad-btn').onclick = () => {
        adContainer.classList.remove('active');
    };
})();
