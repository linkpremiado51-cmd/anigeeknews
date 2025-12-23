// /anigeeknews/usuario/comentarios-visual.js

export function aplicarEstiloFormulario(form) {
    form.innerHTML = `
        <textarea id="texto-comentario" placeholder="Escreva seu comentário..."></textarea>
        <button id="btn-enviar-comentario">Enviar comentário</button>
    `;

    const style = document.createElement("style");
    style.textContent = `
        #comentarios textarea {
            width: 100%;
            padding: 16px;
            border-radius: 4px;
            border: 1px solid var(--border);
            font-size: 15px;
            font-family: var(--font-sans);
            resize: none;
            transition: all 0.3s ease;
            background: var(--card-bg);
            color: var(--text-main);
        }

        #comentarios textarea::placeholder {
            color: var(--text-muted);
            font-style: italic;
        }

        #comentarios textarea:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 0 5px rgba(193,18,31,0.3);
        }

        #comentarios button {
            margin-top: 12px;
            padding: 10px 18px;
            border-radius: 4px;
            border: none;
            background: var(--primary);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #comentarios button:hover {
            background: #a10f1b;
        }
    `;
    document.head.appendChild(style);
}

export function aplicarEstiloComentario(div, comentario, user, abrirResposta) {
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.marginBottom = "20px";
    div.style.marginLeft = comentario.parentId ? "40px" : "0px";
    div.style.padding = "12px 16px";
    div.style.borderRadius = "4px";
    div.style.border = `1px solid var(--border)`;
    div.style.backgroundColor = comentario.parentId ? "var(--bg)" : "var(--card-bg)";
    div.style.transition = "all 0.3s ease";
    div.style.position = "relative";

    div.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px;">
            <img src="https://i.pravatar.cc/40?u=${comentario.userId}" alt="avatar"
                 style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid var(--border);">
            <div style="flex:1">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-family:var(--font-sans); font-size:15px; color:var(--text-main);">
                        ${comentario.userName}
                    </strong>
                    <small style="opacity:.6; font-family:var(--font-sans); font-size:12px;">
                        ${comentario.createdAt ? comentario.createdAt.toDate().toLocaleString("pt-BR") : "agora mesmo"}
                    </small>
                </div>
                <p style="margin-top:6px; font-family:var(--font-sans); font-size:14px; color:var(--text-main); line-height:1.5;">
                    ${comentario.texto}
                </p>
            </div>
        </div>
    `;

    if (user) {
        const btnResponder = document.createElement("button");
        btnResponder.innerHTML = "&#128172; Responder";
        btnResponder.style.marginTop = "10px";
        btnResponder.style.padding = "6px 14px";
        btnResponder.style.fontSize = "13px";
        btnResponder.style.cursor = "pointer";
        btnResponder.style.borderRadius = "4px";
        btnResponder.style.border = `1px solid var(--primary)`;
        btnResponder.style.background = "transparent";
        btnResponder.style.color = "var(--primary)";
        btnResponder.style.transition = "all 0.2s ease";

        btnResponder.onmouseover = () => {
            btnResponder.style.background = "rgba(193,18,31,0.1)";
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
