// Mostrar ou esconder o botão de rolagem
window.onscroll = function() {
    const scrollBtn = document.getElementById("scrollBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

// Função para rolar para o topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Dados iniciais (simulação de banco de dados)
let noticias = [
    {
        id: 1,
        titulo: "Novos Equipamentos em Operação",
        conteudo:
            "As novas máquinas de corte começaram a operar hoje na fábrica. Solicitamos a todos os operadores que participem do treinamento obrigatório agendado para esta semana.",
    },
    {
        id: 2,
        titulo: "Atualização no Horário de Expediente",
        conteudo:
            "A partir de 1º de dezembro, o horário de funcionamento será das 7h às 17h, com intervalo de 1h para almoço.",
    },
];

let editandoNoticiaId = null;

// Renderiza as notícias na tela
function renderizarNoticias() {
    const container = document.getElementById("noticias-container");
    container.innerHTML = "";

    noticias.forEach((noticia) => {
        const noticiaElement = document.createElement("div");
        noticiaElement.classList.add("noticia");
        noticiaElement.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p>${noticia.conteudo}</p>
            <button class="btnNot" onclick="editarNoticia(${noticia.id})">Editar</button>
            <button class="btnNot" onclick="excluirNoticia(${noticia.id})">Excluir</button>
        `;
        container.appendChild(noticiaElement);
    });
}

// Abre o modal para adicionar ou editar notícias
function abrirModal(titulo, noticia = null) {
    const modal = document.getElementById("modal");
    const form = document.getElementById("noticia-form");

    // Limpa os campos do formulário
    form.reset();

    // Define o título do modal
    document.getElementById("modal-title").innerText = titulo;

    // Preenche os campos ao editar
    if (noticia) {
        document.getElementById("titulo").value = noticia.titulo;
        document.getElementById("conteudo").value = noticia.conteudo;
        editandoNoticiaId = noticia.id;
    } else {
        editandoNoticiaId = null;
    }

    modal.classList.remove("hidden");
}



// Fecha o modal
function fecharModal() {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
}

// Adiciona ou edita uma notícia
document.getElementById("noticia-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const conteudo = document.getElementById("conteudo").value;

    if (editandoNoticiaId) {
        // Editar
        const noticia = noticias.find((n) => n.id === editandoNoticiaId);
        noticia.titulo = titulo;
        noticia.conteudo = conteudo;
    } else {
        // Adicionar
        const novaNoticia = {
            id: Date.now(),
            titulo,
            conteudo,
        };
        noticias.push(novaNoticia);
    }

    fecharModal();
    renderizarNoticias();
});

// Excluir uma notícia
function excluirNoticia(id) {
    noticias = noticias.filter((noticia) => noticia.id !== id);
    renderizarNoticias();
}

// Abrir o modal para adicionar
function adicionarNoticia() {
    abrirModal("Adicionar Notícia");
}

// Abrir o modal para editar
function editarNoticia(id) {
    const noticia = noticias.find((n) => n.id === id);
    abrirModal("Editar Notícia", noticia);
}

// Inicializa a lista de notícias
renderizarNoticias();
