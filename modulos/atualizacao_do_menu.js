// /anigeeknews/modulos/atualizacao_do_menu.js

export function inicializarMegaMenu() {
    const container = document.getElementById('megaMenuContainer');
    if (!container) return;

    // Estrutura HTML baseada no modelo NYT (Seções, Newsletters, Podcasts)
    container.innerHTML = `
        <style>
            .mega-menu-overlay {
                position: fixed; top: 0; left: -100%; width: 100%; height: 100%;
                background: var(--bg); z-index: 3000; transition: left 0.4s var(--ease-editorial);
                overflow-y: auto; padding: 60px 20px; border-right: 1px solid var(--border);
            }
            .mega-menu-overlay.active { left: 0; }
            .mega-menu-content { max-width: var(--container-w); margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 50px; }
            .menu-col h3 { font-family: var(--font-sans); font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 20px; color: var(--text-main); }
            .menu-col ul { list-style: none; }
            .menu-col ul li { margin-bottom: 12px; }
            .menu-col ul li a { text-decoration: none; color: var(--text-main); font-size: 15px; font-weight: 500; transition: color 0.2s; }
            .menu-col ul li a:hover { color: var(--accent-news); text-decoration: underline; }
            .close-mega { position: absolute; top: 20px; right: 20px; font-size: 32px; cursor: pointer; background: none; border: none; color: var(--text-main); }
            
            /* Newsletters e Destaques */
            .menu-highlight { margin-top: 25px; padding-top: 15px; border-top: 1px dashed var(--border); }
            .menu-highlight h4 { font-size: 14px; margin-bottom: 5px; color: var(--text-main); }
            .menu-highlight p { font-size: 12px; color: var(--text-muted); line-height: 1.4; }
            
            .promo-box { background: #f9f9f9; padding: 20px; border: 1px solid var(--border); margin-top: 20px; }
            body.dark-mode .promo-box { background: #1a1a1a; }
        </style>

        <div class="mega-menu-overlay" id="megaOverlay">
            <button class="close-mega" id="btnFecharMega">×</button>
            <div class="mega-menu-content">
                <div class="menu-col">
                    <h3>Seções</h3>
                    <ul>
                        <li><a href="#">Animes</a></li>
                        <li><a href="#">Games</a></li>
                        <li><a href="#">Mangás</a></li>
                        <li><a href="#">Cinema</a></li>
                        <li><a href="#">Séries</a></li>
                        <li><a href="#">Tecnologia</a></li>
                        <li><a href="#">Hardware</a></li>
                    </ul>
                </div>

                <div class="menu-col">
                    <h3>Mundo Geek</h3>
                    <ul>
                        <li><a href="#">Eventos (CCXP)</a></li>
                        <li><a href="#">Cosplay</a></li>
                        <li><a href="#">Action Figures</a></li>
                        <li><a href="#">Quadrinhos</a></li>
                        <li><a href="#">E-Sports</a></li>
                        <li><a href="#">Cultura Pop</a></li>
                    </ul>
                </div>

                <div class="menu-col">
                    <h3>Podcasts</h3>
                    <div class="menu-highlight">
                        <h4>O Diário AniGeek</h4>
                        <p>As maiores notícias da cultura pop em 20 minutos por dia.</p>
                    </div>
                    <div class="menu-highlight">
                        <h4>Hard Fork Tech</h4>
                        <p>Entendendo o mundo da tecnologia em transformação.</p>
                    </div>
                    <a href="#" style="font-size:12px; font-weight:800; color:var(--accent-news); text-decoration:none; display:block; margin-top:15px;">VER TODOS</a>
                </div>

                <div class="menu-col">
                    <h3>Boletins Informativos</h3>
                    <div class="promo-box">
                        <h4>A Manhã</h4>
                        <p>Comece seu dia entendendo as notícias e ideias que importam.</p>
                        <button style="margin-top:10px; width:100%; padding:8px; background:var(--text-main); color:var(--bg); border:none; font-size:11px; font-weight:800; cursor:pointer;">INSCREVER-SE</button>
                    </div>
                    <div class="promo-box">
                        <h4>Briefing Noturno</h4>
                        <p>Fique por dentro das principais notícias antes de encerrar o dia.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Lógica Global de Abertura/Fechamento
    const overlay = document.getElementById('megaOverlay');
    const btnFechar = document.getElementById('btnFecharMega');

    // Registra a função no objeto window para ser acessada pelo HTML
    window.abrirMegaMenu = () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll da página ao abrir
    };

    btnFechar.onclick = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Destrava o scroll
    };

    // Fecha o menu se clicar fora do conteúdo
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
}
