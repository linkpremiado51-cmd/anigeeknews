// /anigeeknews/usuario/comentarios-visual.js

export function aplicarEstiloFormulario(form) {
    form.innerHTML = `
        <textarea id="texto-comentario" placeholder="Escreva seu comentário..."></textarea>
        <button id="btn-enviar-comentario">Enviar comentário</button>
    `;

    const style = document.createElement("style");
    style.textContent = `
        /* FORMULÁRIO */
        #comentarios textarea {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid #ccc;
            font-size: 15px;
            resize: none;
            font-family: var(--font-sans);
            transition: all 0.3s ease;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }

        #comentarios textarea::placeholder {
            color: #999;
            font-style: italic;
        }

        #comentarios textarea:focus {
            border-color: #0070f3;
            box-shadow: 0 0 6px rgba(0,112,243,0.3);
            outline: none;
        }

        #comentarios button {
            margin-top: 12px;
            padding: 10px 18px;
            border-radius: 8px;
            border: none;
            background: linear-gradient(135deg, #0070f3, #005bb5);
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        #comentarios button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        #comentarios button:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
}

export function aplicarEstiloComentario(div, comentario, user, abrirResposta) {
    div.style.marginBottom = "20px";
    div.style.marginLeft = comentario.parentId ? "35px" : "0px";
    div.style.padding = "15px";
    div.style.borderRadius = "10px";
    div.style.border = "1px solid #e0e0e0";
    div.style.boxShadow = comentario.parentId ? "none" : "0 4px 12px rgba(0,0,0,0.05)";
    div.style.backgroundColor = comentario.parentId ? "#f9f9f9" : "#fff";
    div.style.transition = "all 0.3s ease";

    div.innerHTML = `
        <strong style="font-family:var(--font-sans); font-size:15px; color:#111;">
            ${comentario.userName}
        </strong>
        <p style="margin:8px 0; font-family:var(--font-sans); font-size:14px; color:#333; line-height:1.5;">
            ${comentario.texto}
        </p>
        <small style="opacity:.6; font-family:var(--font-sans); font-size:12px;">
            ${comentario.createdAt ? comentario.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
        </small>
        <br>
    `;

    if (user) {
        const btnResponder = document.createElement("button");
        btnResponder.textContent = "Responder";
        btnResponder.style.marginTop = "10px";
        btnResponder.style.padding = "5px 12px";
        btnResponder.style.fontSize = "13px";
        btnResponder.style.cursor = "pointer";
        btnResponder.style.borderRadius = "6px";
        btnResponder.style.border = "1px solid #0070f3";
        btnResponder.style.background = "transparent";
        btnResponder.style.color = "#0070f3";
        btnResponder.style.transition = "all 0.2s ease";
        btnResponder.onmouseover = () => {
            btnResponder.style.background = "#0070f330";
            btnResponder.style.transform = "translateY(-1px)";
        };
        btnResponder.onmouseout = () => {
            btnResponder.style.background = "transparent";
            btnResponder.style.transform = "translateY(0)";
        };
        btnResponder.onclick = () => abrirResposta(div, comentario.id);
        div.appendChild(btnResponder);
    }
}
