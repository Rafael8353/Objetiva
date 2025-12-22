<?php
// Configurações de erro para ajudar a identificar problemas (pode remover depois que funcionar)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Verifica se o formulário foi enviado via método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Recebe e limpa os dados
    $nome      = strip_tags(trim($_POST["nome"]));
    $email     = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $whatsapp  = strip_tags(trim($_POST["whatsapp"]));
    $interesse = strip_tags(trim($_POST["interesse"]));

    // --- CONFIGURAÇÃO CRÍTICA PARA LOCAWEB ---
    
    // 1. QUEM RECEBE (Seu Gmail pessoal) - PODE MANTER O GMAIL AQUI
    $para = "objetivainfoarroio@gmail.com";

    // 2. QUEM ENVIA (Tem que ser do seu domínio)
    // Se o seu site é www.objetivagrupodeensino.com.br, o final tem que ser igual.
    // DICA: Crie esse email 'site@...' ou 'contato@...' no painel da Locaweb para garantir.
    $email_origem = "contato@objetiva.com.br"; 

    $assunto = "Nova Solicitação de Bolsa - Site Objetiva";

    // 3. Montagem do corpo da mensagem
    $corpo_email  = "Você recebeu uma nova solicitação de bolsa pelo site.\n\n";
    $corpo_email .= "Nome: " . $nome . "\n";
    $corpo_email .= "E-mail do Aluno: " . $email . "\n";
    $corpo_email .= "WhatsApp: " . $whatsapp . "\n";
    $corpo_email .= "Interesse/Mensagem: \n" . $interesse . "\n";
    $corpo_email .= "---------------------------\n";
    $corpo_email .= "Enviado em: " . date('d/m/Y H:i:s');

    // 4. Cabeçalhos (Headers)
    // O 'From' deve ser o do seu site para o servidor não bloquear.
    // O 'Reply-To' deve ser o do aluno, para você poder responder para ele.
    $headers  = "MIME-Version: 1.1\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\n";
    $headers .= "From: " . $email_origem . "\n"; 
    $headers .= "Reply-To: " . $email . "\n";     
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Envio com o parâmetro "-r" (Obrigatório na Locaweb)
    // O "-r" define o Return-Path, confirmando a identidade do remetente.
    if (mail($para, $assunto, $corpo_email, $headers, "-r".$email_origem)) {
        // Sucesso
        echo "<script>
            alert('Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.'); 
            window.location.href = 'index.html';
        </script>";
    } else {
        // Falha no servidor
        echo "<script>
            alert('Erro ao enviar e-mail. Tente novamente ou entre em contato pelo WhatsApp.'); 
            window.history.back();
        </script>";
    }

} else {
    // Acesso direto negado
    header("Location: index.html");
    exit;
}
?>