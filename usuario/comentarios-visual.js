// /anigeeknews/usuario/comentarios-visual.js

export function aplicarEstiloFormulario(form) {
    form.innerHTML = `
        <textarea id="texto-comentario" placeholder="Escreva seu comentário..."></textarea>
        <button id="btn-enviar-comentario">Enviar comentário</button>
    `;

    // Adiciona estilos diretamente no JS
    const style = document.createElement("style");
    style.textContent = `
        #comentarios textarea {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 14px;
            resize: none;
            font-family: var(--font-sans);
            transition: border .2s;
        }

        #comentarios textarea:focus {
            border-color: #0070f3;
        }

        #comentarios button {
            margin-top: 10px;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            background-color: #0070f3;
            color: #fff;
            font-weight: 600;
            cursor: pointer;
        }

        #comentarios button:hover {
            background-color: #005bb5;
        }
    `;
    document.head.appendChild(style);
}

export function aplicarEstiloComentario(div, comentario, user, abrirResposta) {
    div.style.marginBottom = "18px";
    div.style.marginLeft = comentario.parentId ? "30px" : "0px";
    div.style.padding = "12px";
    div.style.borderRadius = "8px";
    div.style.border = "1px solid #e0e0e0";
    div.style.boxShadow = comentario.parentId ? "none" : "0 2px 6px rgba(0,0,0,0.05)";
    div.style.backgroundColor = comentario.parentId ? "#f9f9f9" : "#fff";
    div.style.transition = "background .2s";

    div.innerHTML = `
        <strong style="font-family:var(--font-sans); font-size:14px; color:#111;">
            ${comentario.userName}
        </strong>
        <p style="margin:6px 0; font-family:var(--font-sans); font-size:14px; color:#333;">
            ${comentario.texto}
        </p>
        <small style="opacity:.5; font-family:var(--font-sans); font-size:12px;">
            ${comentario.createdAt ? comentario.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
        </small>
        <br>
    `;

    if (user) {
        const btnResponder = document.createElement("button");
        btnResponder.textContent = "Responder";
        btnResponder.style.marginTop = "8px";
        btnResponder.style.padding = "4px 10px";
        btnResponder.style.fontSize = "12px";
        btnResponder.style.cursor = "pointer";
        btnResponder.style.borderRadius = "4px";
        btnResponder.style.border = "1px solid #0070f3";
        btnResponder.style.background = "transparent";
        btnResponder.style.color = "#0070f3";
        btnResponder.onmouseover = () => btnResponder.style.background = "#0070f350";
        btnResponder.onmouseout = () => btnResponder.style.background = "transparent";
        btnResponder.onclick = () => abrirResposta(div, comentario.id);
        div.appendChild(btnResponder);
    }
}
