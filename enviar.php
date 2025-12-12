<?php
// Verifica se o formulário foi enviado via método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Recebe e limpa os dados do formulário
    $nome      = strip_tags(trim($_POST["nome"]));
    $email     = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $whatsapp  = strip_tags(trim($_POST["whatsapp"]));
    $interesse = strip_tags(trim($_POST["interesse"]));

    // 2. Configurações de envio
    $para    = "objetivainfoarroio@gmail.com";
    $assunto = "Nova Solicitação de Bolsa - Site Objetiva";

    // 3. Montagem do corpo da mensagem
    $corpo_email  = "Você recebeu uma nova solicitação de bolsa pelo site.\n\n";
    $corpo_email .= "Nome: $nome\n";
    $corpo_email .= "E-mail: $email\n";
    $corpo_email .= "WhatsApp: $whatsapp\n";
    $corpo_email .= "Interesse/Mensagem: \n$interesse\n";
    $corpo_email .= "---------------------------\n";
    $corpo_email .= "Enviado em: " . date('d/m/Y H:i:s');

    // 4. Cabeçalhos (Headers)
    $headers  = "From: $email\r\n";      // Remetente (e-mail do usuário para facilitar identificação)
    $headers .= "Reply-To: $email\r\n";  // Responder para
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Tentativa de envio
    if (mail($para, $assunto, $corpo_email, $headers)) {
        // Sucesso
        echo "<script>
            alert('Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.'); 
            window.location.href = 'index.html';
        </script>";
    } else {
        // Falha no servidor
        echo "<script>
            alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato pelo WhatsApp.'); 
            window.history.back();
        </script>";
    }

} else {
    // Acesso direto negado
    header("Location: index.html");
    exit;
}
?>