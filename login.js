document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o envio do formulário padrão
        
        const email = document.getElementById("logemail").value;
        const password = document.getElementById("logpass").value;

        // Credenciais de exemplo para validação
        const validEmailA = "adm@onix.com";
        const validPasswordA = "senha123";

        const validEmailF = "fun@onix.com";
        const validPasswordF = "senha123";

        // Validação simples
        if (email === validEmailA && password === validPasswordA) {
            errorMessage.style.display = "none"; // Esconde a mensagem de erro
            window.location.href = "inicioADMs.html"; // Redireciona
        } else if (email === validEmailF && password === validPasswordF){
            errorMessage.style.display = "none"; // Esconde a mensagem de erro
            window.location.href = "inicioFUN.html"; // Redireciona
        }else {
            errorMessage.style.display = "block"; // Exibe a mensagem de erro
        }
    });
});
