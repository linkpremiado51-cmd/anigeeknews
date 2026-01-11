(function() {
    // === CONFIGURAÇÕES DE CONTEÚDO (SIMULAÇÃO) ===
    const mockAds = {
        bloco1: [
            { type: 'image', src: 'https://via.placeholder.com/320x50', height: '50px' },
            { type: 'image', src: 'https://via.placeholder.com/320x250', height: '250px' }, // Tamanho grande
            { type: 'image', src: 'https://via.placeholder.com/320x400', height: '400px' }  // Metade da tela
        ],
        bloco2: [
            { type: 'image', src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300&h=450&auto=format&fit=crop' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' } // Exemplo de vídeo
        ]
    };

    // === ELEMENTOS HTML ===
    const drawer = document.createElement('div');
    drawer.id = 'ads-bloco-1';
    drawer.innerHTML = `
        <div class="drawer-wrapper">
            <button id="close-bloco-1">FECHAR</button>
            <div class="drawer-content">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="slot-bloco-1"></div>
            </div>
        </div>
    `;

    const interstitial = document.createElement('div');
    interstitial.id = 'ads-bloco-2';
    interstitial.innerHTML = `
        <button id="close-bloco-2" disabled>FECHAR X</button>
        <div class="interstitial-modal">
            <div class="interstitial-media-container">
                <p class="ad-tag">PUBLICIDADE</p>
                <div id="slot-bloco-2"></div>
            </div>
        </div>
        <div id="timer-bloco-2">AGUARDE...</div>
    `;

    // === ESTILIZAÇÃO (SUPORTE DINÂMICO) ===
    const style = document.createElement('style');
    style.textContent = `
        /* BLOCO 1 (GAVETA) */
        #ads-bloco-1 {
            position: fixed; bottom: -100%; left: 0; width: 100%;
            z-index: 99999; transition: bottom 0.6s cubic-bezier(0.2, 1, 0.3, 1);
            display: flex; justify-content: center;
        }
        #ads-bloco-1.active { bottom: 0; }
        .drawer-wrapper { 
            width: 100%; max-width: 500px; background: #fff; 
            box-shadow: 0 -5px 25px rgba(0,0,0,0.2);
            padding: 12px; position: relative; border-top: 3px solid #121212;
            display: flex; flex-direction: column;
        }
        #close-bloco-1 {
            position: absolute; top: -30px; right: 0; background: #121212;
            color: #fff; border: none; padding: 5px 15px; font-size: 10px;
            font-weight: 800; cursor: pointer; letter-spacing: 1px;
        }
        #slot-bloco-1 img { width: 100%; height: auto; display: block; }

        /* BLOCO 2 (INTERSTITIAL) */
        #ads-bloco-2 {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(25px);
            z-index: 1000000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        #ads-bloco-2.show { display: flex; opacity: 1; }
        
        #close-bloco-2 {
            position: fixed; top: 20px; left: 20px; background: #fff; color: #000;
            border: none; padding: 12px 25px; font-weight: 900; letter-spacing: 1.5px;
            cursor: not-allowed; opacity: 0.3; transition: all 0.3s;
            box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        }
        #close-bloco-2.ready { opacity: 1; cursor: pointer; background: #c1121f; color: #fff; }

        #timer-bloco-2 {
            position: fixed; bottom: 20px; right: 20px; background: #fff; color: #121212;
            padding: 12px 25px; font-weight: 800; border-left: 5px solid #c1121f;
            box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
        }

        .interstitial-media-container {
            background: #fff; padding: 8px; width: 85vw; max-width: 340px;
            border: 1px solid #444; box-shadow: 20px 20px 0px rgba(0,0,0,0.4);
        }
        .video-ad { width: 100%; height: auto; display: block; outline: none; }
        .ad-tag { font-size: 9px; color: #777; text-align: center; font-weight: 700; letter-spacing: 2px; margin-bottom: 8px; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(drawer);
    document.body.appendChild(interstitial);

    // === LÓGICA DE EXECUÇÃO ===

    function carregarBloco1() {
        const slot = document.getElementById('slot-bloco-1');
        const ad = mockAds.bloco1[Math.floor(Math.random() * mockAds.bloco1.length)];
        
        slot.innerHTML = `<img src="${ad.src}" style="max-height: ${ad.height}">`;
        
        setTimeout(() => {
            drawer.classList.add('active');
        }, 2000);
    }

    function carregarBloco2() {
        const slot = document.getElementById('slot-bloco-2');
        const ad = mockAds.bloco2[Math.floor(Math.random() * mockAds.bloco2.length)];
        const btn = document.getElementById('close-bloco-2');
        const timer = document.getElementById('timer-bloco-2');
        
        // Ajuste para Vídeo ou Imagem
        if (ad.type === 'video') {
            slot.innerHTML = `<video class="video-ad" autoplay muted loop><source src="${ad.src}" type="video/mp4"></video>`;
        } else {
            slot.innerHTML = `<img src="${ad.src}" style="width:100%; height:auto;">`;
        }

        setTimeout(() => {
            interstitial.classList.add('show');
            let count = 10;
            btn.disabled = true;
            btn.classList.remove('ready');

            const countdown = setInterval(() => {
                if (count > 0) {
                    timer.innerText = `DISPONÍVEL EM ${count}S`;
                    count--;
                } else {
                    clearInterval(countdown);
                    timer.innerText = "PRONTO PARA FECHAR";
                    btn.disabled = false;
                    btn.classList.add('ready');
                }
            }, 1000);
        }, 10000);
    }

    // Handlers de Fechamento com RE-LOOP
    document.getElementById('close-bloco-1').onclick = () => {
        drawer.classList.remove('active');
        setTimeout(carregarBloco1, 10000); // Reaparece o Bloco 1 após 10s
    };

    document.getElementById('close-bloco-2').onclick = () => {
        interstitial.classList.remove('show');
        setTimeout(carregarBloco2, 15000); // Reaparece o Bloco 2 após 15s (mais tempo para não irritar)
    };

    // Início imediato
    carregarBloco1();
    carregarBloco2();

})();
