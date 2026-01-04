// /anigeeknews/usuario/perfil-lateral.js

export function carregarPerfilLateral() {
    const container = document.getElementById('container-menu-perfil');
    if (!container) return;

    const gostos = JSON.parse(localStorage.getItem("gostosUsuario")) || [];

    container.innerHTML = `
        <div class="perfil-info" style="padding:20px;">
            <h4 style="font-size:13px; font-weight:800; text-transform:uppercase; margin-bottom:10px;">
                Seus temas
            </h4>

            <div style="font-size:12px; color:var(--text-muted); line-height:1.6;">
                ${
                    gostos.length
                        ? gostos.map(g => `<span style="display:inline-block; margin:4px 6px 4px 0; padding:4px 8px; border:1px solid var(--border); font-size:11px;">${g}</span>`).join("")
                        : "Nenhum tema selecionado"
                }
            </div>

            <hr style="border:0; border-top:1px solid var(--border); margin:20px 0;">

            <a href="/anigeeknews/usuario/painel.html"
               style="display:block; text-align:center; font-size:12px; font-weight:700; text-decoration:none; color:var(--accent-news);">
                Editar preferências
            </a>
        </div>
    `;
}
