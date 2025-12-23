<!-- MÓDULO DE COMENTÁRIOS -->
<section class="comments-section" style="max-width: var(--container-w); margin: 40px auto; padding: 0 20px;">
    <h2 class="section-title">Comentários</h2>

    <!-- FORMULÁRIO DE ENVIO -->
    <div class="comment-form" style="background: var(--card-bg); border: 1px solid var(--border); padding: 20px; margin-bottom: 30px;">
        <textarea placeholder="Deixe seu comentário..." style="
            width: 100%;
            font-family: var(--font-serif);
            font-size: 14px;
            color: var(--text-main);
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 12px;
            resize: vertical;
            min-height: 80px;
            margin-bottom: 10px;
        "></textarea>
        <button style="
            background: var(--primary);
            color: var(--bg);
            border: none;
            padding: 12px 20px;
            font-family: var(--font-sans);
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            transition: opacity 0.3s;
        " onmouseover="this.style.opacity=0.9" onmouseout="this.style.opacity=1">Enviar</button>
    </div>

    <!-- LISTA DE COMENTÁRIOS -->
    <div class="comments-list" style="display: flex; flex-direction: column; gap: 20px;">
        <!-- COMENTÁRIO INDIVIDUAL -->
        <div class="comment-card" style="background: var(--card-bg); border: 1px solid var(--border); padding: 15px;">
            <div class="comment-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-family: var(--font-sans); font-weight: 700; font-size: 12px; color: var(--text-main);">Luiz Carlos</span>
                <span style="font-family: var(--font-sans); font-size: 11px; color: var(--text-muted);">23 Dez, 2025</span>
            </div>
            <p style="font-family: var(--font-serif); font-size: 14px; color: var(--text-main); line-height: 1.5;">
                Esse artigo está incrível! Adorei a análise detalhada e o cuidado com a arte visual.
            </p>
            <!-- BOTÕES DE INTERAÇÃO -->
            <div class="comment-actions" style="margin-top: 10px; display: flex; gap: 15px;">
                <button style="
                    background: none;
                    border: none;
                    font-family: var(--font-sans);
                    font-size: 12px;
                    color: var(--primary);
                    cursor: pointer;
                    font-weight: 700;
                    text-transform: uppercase;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">Responder</button>
                <button style="
                    background: none;
                    border: none;
                    font-family: var(--font-sans);
                    font-size: 12px;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-weight: 700;
                    text-transform: uppercase;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">Curtir</button>
            </div>
        </div>

        <!-- EXEMPLO DE RESPOSTA -->
        <div class="comment-card reply" style="background: var(--card-bg); border: 1px solid var(--border); padding: 15px; margin-left: 30px;">
            <div class="comment-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-family: var(--font-sans); font-weight: 700; font-size: 12px; color: var(--text-main);">Editor Chefe</span>
                <span style="font-family: var(--font-sans); font-size: 11px; color: var(--text-muted);">23 Dez, 2025</span>
            </div>
            <p style="font-family: var(--font-serif); font-size: 14px; color: var(--text-main); line-height: 1.5;">
                Obrigado pelo feedback, Luiz! Fico feliz que tenha gostado da análise.
            </p>
        </div>
    </div>
</section>

<!-- RESPONSIVIDADE -->
<style>
    @media (max-width: 768px) {
        .comments-section { padding: 0 15px; }
        .comment-card.reply { margin-left: 15px; }
    }
</style>
