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

    // Observa o DOM porque este HTML é carregado via fetch
    const observer = new MutationObserver(() => {
        if (document.getElementById("destaque-status")) {
            ativarStatus();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
