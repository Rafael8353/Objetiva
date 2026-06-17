<?php
// Importa as classes do PHPMailer para o script
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Carrega os arquivos que você baixou (Caminho manual sem Composer)
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
// 1. CAPTURA A ARMADILHA (HONEYPOT)
    $honeypot = $_POST['url_site'];

    // 2. VERIFICA SE É UM ROBÔ
    if (!empty($honeypot)) {
        // Se o campo invisível foi preenchido, é um robô.
        // Redireciona como 'sucesso' para que o robô ache que funcionou e vá embora, mas NÃO envia o e-mail.
        header("Location: index.html?status=sucesso#orcamento");
        exit;
    }


    // Captura os dados do formulário
    $nome = htmlspecialchars($_POST['nome']);
    $email_aluno = htmlspecialchars($_POST['email']);
    $whatsapp = htmlspecialchars($_POST['whatsapp']);
    $interesse = htmlspecialchars($_POST['interesse']);

    $mail = new PHPMailer(true);

    try {
        // ==========================================
        // 1. CONFIGURAÇÕES DO SERVIDOR SMTP (LOCAWEB)
        // ==========================================
        $mail->isSMTP();                                            
        $mail->Host       = 'email-ssl.com.br'; //  smtp.objetivagrupodeensino.com.br
        $mail->SMTPAuth   = true;                                   
        $mail->Username   = ''; // Seu novo email criado
        $mail->Password   = '';               // A senha desse email
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // SSL
        $mail->Port       = 465;                                 // Porta SSL padrão
        $mail->CharSet    = 'UTF-8';

        // ==========================================
        // 2. REMETENTE E DESTINATÁRIO
        // ==========================================
        // Quem está enviando (O carteiro)
        $mail->setFrom('', 'Site Objetiva'); 
        
        // Para quem vai a mensagem
        $mail->addAddress('', '');     
        
        // Se ela clicar em "Responder", vai pro email do aluno
        $mail->addReplyTo($email_aluno, $nome);

        // ==========================================
        // 3. CONTEÚDO DO E-MAIL
        // ==========================================
        $mail->isHTML(true);                                  
        $mail->Subject = 'Nova Solicitação de Bolsa - Site Objetiva';
        
        // Corpo do e-mail em HTML para ficar mais bonito
        $mail->Body    = "
            <h2>Nova solicitação de bolsa pelo site</h2>
            <p><strong>Nome:</strong> {$nome}</p>
            <p><strong>E-mail:</strong> {$email_aluno}</p>
            <p><strong>WhatsApp:</strong> {$whatsapp}</p>
            <p><strong>Interesse:</strong> {$interesse}</p>
        ";
        
        // Corpo em texto puro (para clientes de e-mail muito antigos)
        $mail->AltBody = "Nova solicitação de bolsa\nNome: {$nome}\nE-mail: {$email_aluno}\nWhatsApp: {$whatsapp}\nInteresse: {$interesse}";

        // Envia o e-mail
        $mail->send();
        
        // Redireciona de volta com sucesso
        header("Location: index.html?status=sucesso#bolsas");
        exit;
        
    } catch (Exception $e) {
        // Se der erro, redireciona mostrando que falhou (você pode logar o $mail->ErrorInfo depois se quiser investigar)
        header("Location: index.html?status=erro#bolsas");
        exit;
    }
}
?>