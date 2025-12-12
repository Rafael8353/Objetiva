<?php
// Verifica se o formulário foi enviado via método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Recebe e limpa os dados do formulário para segurança
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $whatsapp = strip_tags(trim($_POST["whatsapp"]));
    $interesse = strip_tags(trim($_POST["interesse"]));

    // 2. Configurações do E-mail (Quem recebe)
    $para = "objetivainfoarroio@gmail.com";
    $assunto = "Nova Solicitação de Bolsa - Site Objetiva";

    // 3. Monta o corpo da mensagem que chegará no e-mail
    $corpo_email = "Você recebeu uma nova solicitação de bolsa pelo site.\n\n";
    $corpo_email .= "Nome: $nome\n";
    $corpo_email .= "E-mail: $email\n";
    $corpo_email .= "WhatsApp: $whatsapp\n";
    $corpo_email .= "Interesse/Mensagem: \n$interesse\n";
    $corpo_email .= "---------------------------\n";
    $corpo_email .= "Enviado em: " . date('d/m/Y H:i:s');

    // 4. Cabeçalhos (Headers) essenciais
    $headers = "From: $email\r\n"; // Faz parecer que veio do e-mail do cliente
    $headers .= "Reply-To: $email\r\n"; // Ao clicar em responder, vai para o cliente
    $headers .= "X-Mailer: PHP/" . phpversion();

    // --- LÓGICA HÍBRIDA (TESTE LOCAL + HOSPEDAGEM REAL) ---
    
    // Tenta enviar o e-mail. O @ esconde erros técnicos na tela caso falhe (comum no XAMPP).
    if (@mail($para, $assunto, $corpo_email, $headers)) {
        // SUCESSO: Este bloco roda na Hospedagem Real
        echo "<script>
            alert('Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.'); 
            window.location.href = 'index.html';
        </script>";
    } else {
        // FALHA NO ENVIO: Este bloco roda no XAMPP (Localhost)
        // Salva os dados num arquivo de texto para você conferir se a lógica funcionou
        
        $arquivo_log = "email_teste.txt";
        $handle = fopen($arquivo_log, "a"); // Abre ou cria o arquivo para escrita
        
        if ($handle) {
            fwrite($handle, "=================================\n");
            fwrite($handle, "DATA DE ENVIO: " . date('d/m/Y H:i:s') . "\n");
            fwrite($handle, $corpo_email . "\n\n");
            fclose($handle);
            
            // Avisa que salvou no arquivo (apenas para seu teste)
            echo "<script>
                alert('AMBIENTE LOCAL DETECTADO (XAMPP): O e-mail não pôde ser enviado, mas os dados foram salvos no arquivo email_teste.txt na pasta do projeto para conferência.');
                window.location.href = 'index.html';
            </script>";
        } else {
            // Caso não consiga nem criar o arquivo (erro de permissão)
            echo "<script>
                alert('Erro ao processar a solicitação. Tente entrar em contato pelo WhatsApp.');
                window.history.back();
            </script>";
        }
    }

} else {
    // Se o usuário tentar abrir o arquivo enviar.php direto no navegador sem preencher o formulário
    header("Location: index.html");
    exit;
}
?>