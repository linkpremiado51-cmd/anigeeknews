(function() {
// === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === INSERÇÃO DO POPUNDER ADSTERRA (IMEDIATO) ===
const popunder = document.createElement('script');
popunder.src = 'https://pl28480241.effectivegatecpm.com/03/fd/7f/03fd7fcc66be850e0b69314ae833f984.js';
document.head.appendChild(popunder);

// === 2. CONTAINER MESTRE (ROOT) ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO E AJUSTES DE ESPAÇO ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system { font-family: 'Helvetica', sans-serif; pointer-events: none; }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  

    .ind-banner {  
        position: fixed; left: 0; width: 100%;  
        z-index: 2147483646; background: #ffffff;  
        border-top: 3px solid #000; border-bottom: 3px solid #000;  
        box-shadow: 0 0 30px rgba(0,0,0,0.2);  
        transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);  
    }  
    .ind-bottom { bottom: -800px; padding: 15px 0; }  
    .ind-top { top: -800px; padding: 15px 0; }  
    .ind-container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 15px; text-align: center; }  
    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }  
    .ind-label { font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: 2px; }  
    .ind-close-btn { font-size: 10px; font-weight: 900; background: #000; color: #fff; border: none; padding: 5px 15px; cursor: pointer; }  

    /* Slot Adsterra */
    #container-400bc04139af7d37cf07e325be6678fb { min-height: 150px; width: 100%; display: block; }

    .ind-overlay {  
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9);  
        z-index: 2147483647; display: none; align-items: center; justify-content: center;  
        opacity: 0; transition: opacity 0.4s ease;  
    }  
    .ind-modal {  
        background: #fff; width: 95%; max-width: 480px; padding: 25px;  
        border-top: 10px solid #000; transform: translateY(20px); transition: transform 0.4s ease;  
    }  
    .ind-btn-skip { background: #f0f0f0; border: 1px solid #ddd; padding: 10px 20px; font-size: 11px; font-weight: 800; cursor: not-allowed; }  
    .ind-btn-skip.ready { background: #000; color: #fff; cursor: pointer; }  
    .ind-progress-bg { width: 100%; height: 4px; background: #eee; margin: 15px 0; }  
    .ind-progress-fill { width: 0%; height: 100%; background: #000; }  
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA DOS BLOCOS ===  
adsRoot.innerHTML = `  
    <div id="ind-block-1" class="ind-banner ind-bottom">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade Nativa</span>  
                <button id="ind-close-1" class="ind-close-btn">Fechar (30s)</button>  
            </div>  
            <div id="container-400bc04139af7d37cf07e325be6678fb"></div>  
        </div>  
    </div>  

    <div id="ind-block-2-overlay" class="ind-overlay">  
        <div class="ind-modal">  
            <div class="ind-header">  
                <span class="ind-label">Patrocinado</span>  
                <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>  
            </div>  
            <div id="modal-ad-space" style="min-height:200px">
                <p style="font-size:12px">Clique no anúncio abaixo para liberar</p>
            </div>  
            <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>  
            <div class="ind-footer" style="text-align:center">  
                <span id="ind-timer-txt" style="font-size:11px; font-weight:900;">INICIANDO...</span>  
            </div>  
        </div>  
    </div>  
`;  

// Carrega o Script do Banner Adsterra para garantir renderização
const scriptBanner = document.createElement('script');
scriptBanner.async = true;
scriptBanner.dataset.cfasync = "false";
scriptBanner.src = "//pl28480282.effectivegatecpm.com/400bc04139af7d37cf07e325be6678fb/invoke.js";
document.body.appendChild(scriptBanner);

// === 5. LÓGICA DE TEMPO (30 SEGUNDOS) ===  
const b1 = document.getElementById('ind-block-1');  
const b2Overlay = document.getElementById('ind-block-2-overlay');  
const b2Modal = b2Overlay.querySelector('.ind-modal');  

const CICLO_TEMPO = 30000; // 30 segundos em milissegundos

// Mostrar Bloco Inferior
const openB1 = () => { b1.style.bottom = '0px'; };  

// Fechar e agendar para 30s depois
document.getElementById('ind-close-1').onclick = () => {  
    b1.style.bottom = '-800px';  
    setTimeout(openB1, CICLO_TEMPO);  
};  

// Motor do Interstitial (Bloco Central)  
function startInterstitial() {  
    setTimeout(() => {  
        b2Overlay.style.display = 'flex';  
        setTimeout(() => {  
            b2Overlay.style.opacity = '1';  
            b2Modal.style.transform = 'translateY(0)';  
        }, 50);  

        let timeLeft = 5; // Tempo que o usuário deve esperar para clicar em PULAR
        const btn = document.getElementById('ind-close-2');  
        const prog = document.getElementById('ind-prog-2');  
        const txt = document.getElementById('ind-timer-txt');  

        const countdown = setInterval(() => {  
            if (isTabActive) {  
                if (timeLeft > 0) {  
                    timeLeft--;  
                    txt.innerText = `AGUARDE ${timeLeft}s`;  
                    prog.style.width = `${((5 - timeLeft) / 5) * 100}%`;  
                } else {  
                    clearInterval(countdown);  
                    txt.innerText = "PRONTO";  
                    btn.innerText = "PULAR ANÚNCIO";  
                    btn.disabled = false;  
                    btn.classList.add('ready');  
                }  
            }  
        }, 1000);  

        btn.onclick = () => {  
            b2Overlay.style.opacity = '0';  
            b2Modal.style.transform = 'translateY(20px)';  
            setTimeout(() => {  
                b2Overlay.style.display = 'none';  
                // Só volta a aparecer 30 segundos após ser fechado
                setTimeout(startInterstitial, CICLO_TEMPO);  
            }, 500);  
            
            // Reset do botão
            btn.disabled = true;  
            btn.classList.remove('ready');  
            btn.innerText = "Aguarde";  
            prog.style.width = "0%";  
        };  
    }, CICLO_TEMPO); // Aparece pela primeira vez após 30s
}  

// Inicialização Geral (Tudo começa a aparecer após 30 segundos de página aberta)
setTimeout(openB1, CICLO_TEMPO); 
startInterstitial();

})();
