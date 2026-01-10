(function () {
    function ativarStatus() {
        const status = document.getElementById("destaque-status");

        if (!status) return;

        status.textContent = "JavaScript ativo";
        status.style.color = "lime";
        status.style.fontWeight = "bold";
        status.style.padding = "8px 12px";
        status.style.background = "#000";
        status.style.display = "inline-block";
        status.style.borderRadius = "6px";
        status.style.marginBottom = "12px";
    }

    // Caso o HTML ainda não tenha sido injetado
    let tentativas = 0;
    const intervalo = setInterval(() => {
        tentativas++;
        const status = document.getElementById("destaque-status");

        if (status || tentativas > 20) {
            clearInterval(intervalo);
            ativarStatus();
        }
    }, 50);
})();
