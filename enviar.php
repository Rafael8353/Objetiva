<?php
// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Recebe e limpa os dados do formulário
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $whatsapp = strip_tags(trim($_POST["whatsapp"]));
    $interesse = strip_tags(trim($_POST["interesse"]));

    // 2. Configurações do E-mail
    $para = "objetivainfoarroio@gmail.com";
    $assunto = "Nova Solicitação de Bolsa - Site Objetiva";

    // 3. Monta o corpo da mensagem
    $corpo_email = "Você recebeu uma nova solicitação de bolsa pelo site.\n\n";
    $corpo_email .= "Nome: $nome\n";
    $corpo_email .= "E-mail: $email\n";
    $corpo_email .= "WhatsApp: $whatsapp\n";
    $corpo_email .= "Interesse/Mensagem: \n$interesse\n";

    // 4. Cabeçalhos (Headers) para evitar cair no spam
    $headers = "From: $email\r\n"; // Quem enviou (usamos o email do cliente para facilitar o 'responder')
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Tenta enviar o e-mail
    if (mail($para, $assunto, $corpo_email, $headers)) {
        // Sucesso: Redireciona de volta para o site com uma mensagem de sucesso (via URL) ou exibe alerta
        echo "<script>alert('Sua solicitação foi enviada com sucesso! Entraremos em contato.'); window.location.href = 'index.html';</script>";
    } else {
        // Erro
        echo "<script>alert('Ocorreu um erro ao enviar. Tente novamente ou chame no WhatsApp.'); window.history.back();</script>";
    }

} else {
    // Se tentar acessar o arquivo diretamente sem enviar o formulário
    header("Location: index.html");
    exit;
}
?>