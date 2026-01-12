(function() {
    // === 1. GESTÃO DE ESTADO E SEGURANÇA ===
    let isTabActive = true;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    // === 2. CRIAÇÃO DO CONTAINER MESTRE (ROOT) ===
    // Isso evita que os elementos fiquem soltos e facilita o controle de cliques
    const adsRoot = document.createElement('div');
    adsRoot.id = 'premium-ads-system-root';
    document.body.appendChild(adsRoot);

    // === 3. ESTILIZAÇÃO DE ALTO NÍVEL (CSS GOOGLE STYLE) ===
    const style = document.createElement('style');
    style.textContent = `
        #premium-ads-system-root {
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            pointer-events: none; /* Não bloqueia cliques na página por padrão */
        }

        #premium-ads-system-root * { pointer-events: auto; }

        /* Animação Skeleton Shimmer Profissional */
        .premium-shimmer {
            background: #f6f7f8 linear-gradient(90deg, #f6f7f8 0%, #ececf1 50%, #f6f7f8 100%);
            background-size: 200% 100%;
            animation: shimmer-anim 1.5s infinite linear;
        }
        @keyframes shimmer-anim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Estilo dos Cards (Blocos 1 e 3) */
        .premium-card {
            position: fixed; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 500px; z-index: 2147483646;
            background: #ffffff; border: 1px solid #e0e0e0;
            padding: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.12);
            transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .premium-bottom { bottom: -300px; border-radius: 24px 24px 0 0; }
        .premium-top { top: -300px; border-radius: 0 0 24px 24px; }

        .premium-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .premium-tag { font-size: 11px; font-weight: 700; color: #70757a; text-transform: uppercase; letter-spacing: 0.8px; }
        .premium-slot { height: 90px; border-radius: 12px; }

        /* Bloco 2 - Overlay Interstitial */
        .premium-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.4);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            z-index: 2147483647; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        }
        .premium-modal {
            background: #fff; width: 92%; max-width: 420px; border-radius: 32px;
            padding: 28px; box-shadow: 0 24px 80px rgba(0,0,0,0.3);
            transform: translateY(30px); transition: transform 0.6s cubic-bezier(0.2, 1, 0.2, 1);
        }

        .premium-slot-hero { height: 300px; border-radius: 20px; margin-bottom: 20px; }

        /* Botões e Progresso */
        .premium-btn-skip {
            background: #f1f3f4; border: none; padding: 10px 20px; border-radius: 100px;
            font-size: 13px; font-weight: 600; color: #3c4043; cursor: not-allowed; transition: 0.3s;
        }
        .premium-btn-skip.ready { background: #1a73e8; color: #fff; cursor: pointer; }

        .premium-progress-bg { width: 100%; height: 6px; background: #e8eaed; border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
        .premium-progress-fill { width: 0%; height: 100%; background: #1a73e8; transition: width 0.1s linear; }

        .premium-footer { display: flex; justify-content: space-between; align-items: center; }
        .premium-cta {
            background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 24px;
            border-radius: 16px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(26,115,232,0.3);
        }
    `;
    document.head.appendChild(style);

    // === 4. ESTRUTURA DOS BLOCOS (INSERÇÃO NO ROOT) ===
    adsRoot.innerHTML = `
        <div id="block-1" class="premium-card premium-bottom">
            <div class="premium-header">
                <span class="premium-tag">Publicidade</span>
                <button id="close-1" style="background:none; border:none; cursor:pointer; font-size:20px; color:#5f6368;">&times;</button>
            </div>
            <div class="premium-slot premium-shimmer"></div>
        </div>

        <div id="block-2-overlay" class="premium-overlay">
            <div class="premium-modal">
                <div class="premium-header">
                    <span class="premium-tag" style="color:#1a73e8;">Anúncio Exclusivo</span>
                    <button id="close-2" class="premium-btn-skip" disabled>Aguarde...</button>
                </div>
                <div class="premium-slot-hero premium-shimmer"></div>
                <div class="premium-progress-bg"><div id="prog-2" class="premium-progress-fill"></div></div>
                <div class="premium-footer">
                    <span id="timer-txt" style="font-size:12px; color:#5f6368;">Sincronizando...</span>
                    <a href="#" target="_blank" class="premium-cta">Visitar Site</a>
                </div>
            </div>
        </div>

        <div id="block-3" class="premium-card premium-top">
            <div class="premium-header">
                <span class="premium-tag">Recomendado</span>
                <button id="close-3" style="font-size:10px; font-weight:700; color:#1a73e8; border:1px solid #e0e0e0; border-radius:8px; padding:4px 10px; background:none; cursor:pointer;">FECHAR</button>
            </div>
            <div class="premium-slot premium-shimmer"></div>
        </div>
    `;

    // === 5. LÓGICA DE EXECUÇÃO (ENGINE) ===
    const b1 = document.getElementById('block-1');
    const b2Overlay = document.getElementById('block-2-overlay');
    const b2Modal = b2Overlay.querySelector('.premium-modal');
    const b3 = document.getElementById('block-3');

    // Funções de Abrir/Fechar
    const openB1 = () => { b1.style.bottom = '0px'; };
    const openB3 = () => { b3.style.top = '0px'; };

    document.getElementById('close-1').onclick = () => {
        b1.style.bottom = '-300px';
        setTimeout(openB1, 20000);
    };

    document.getElementById('close-3').onclick = () => {
        b3.style.top = '-300px';
        setTimeout(openB3, 25000);
    };

    function runB2() {
        setTimeout(() => {
            b2Overlay.style.display = 'flex';
            setTimeout(() => {
                b2Overlay.style.opacity = '1';
                b2Modal.style.transform = 'translateY(0)';
            }, 50);

            let timeLeft = 10;
            const btn = document.getElementById('close-2');
            const prog = document.getElementById('prog-2');
            const txt = document.getElementById('timer-txt');

            const countdown = setInterval(() => {
                if (isTabActive) {
                    if (timeLeft > 0) {
                        timeLeft--;
                        txt.innerText = `Liberando em ${timeLeft}s`;
                        prog.style.width = `${(10 - timeLeft) * 10}%`;
                    } else {
                        clearInterval(countdown);
                        txt.innerText = "Pronto para acessar";
                        btn.innerText = "Pular Anúncio";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                } else {
                    txt.innerText = "Cronômetro pausado...";
                }
            }, 1000);

            btn.onclick = () => {
                b2Overlay.style.opacity = '0';
                b2Modal.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    b2Overlay.style.display = 'none';
                    setTimeout(runB2, 120000); // Repete após 2 minutos
                }, 500);
            };
        }, 10000); // Surge após 10 segundos
    }

    // Inicialização
    setTimeout(openB1, 2000);
    setTimeout(openB3, 4000);
    runB2();

})();
