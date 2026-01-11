(function() {
    // 1. Cria o HTML da gaveta
    const adContainer = document.createElement('div');
    adContainer.id = 'dynamic-ad-drawer';
    adContainer.innerHTML = `
        <div class="ad-content">
            <button id="close-ad">X</button>
            <div id="ad-slot"></div> 
        </div>
    `;

    // 2. Injeta o CSS necessário para a animação
    const style = document.createElement('style');
    style.textContent = `
        #dynamic-ad-drawer {
            position: fixed;
            bottom: -50%; /* Começa escondido */
            left: 0;
            width: 100%;
            height: 50%;
            background: white;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.3);
            transition: bottom 0.5s ease-in-out;
            z-index: 10000;
        }
        #dynamic-ad-drawer.active { bottom: 0; }
        #close-ad { position: absolute; right: 10px; top: 10px; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(adContainer);

    // 3. Gatilhos
    setTimeout(() => adContainer.classList.add('active'), 3000); // Aparece após 3s
    
    document.getElementById('close-ad').onclick = () => {
        adContainer.classList.remove('active');
    };
})();
