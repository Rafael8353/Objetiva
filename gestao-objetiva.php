<?php
session_start();

// ==========================================
// 1. CONFIGURAÇÕES DE LOGIN
// ==========================================
$usuario_painel = 'Camila';
$senha_painel = '10203040'; 

// ==========================================
// 2. BANCO DE DADOS (LOCAWEB)
// ==========================================
$db_host = ''; 
$db_name = '';
$db_user = '';
$db_pass = '';

if (isset($_GET['sair'])) { session_destroy(); header("Location: gestao-objetiva.php"); exit; }

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
    if ($_POST['usuario'] === $usuario_painel && $_POST['senha'] === $senha_painel) {
        $_SESSION['logado'] = true;
    } else { $erro_login = "Usuário ou senha incorretos!"; }
}

// TELA DE LOGIN COM A LOGO DA OBJETIVA E FAVICON
if (!isset($_SESSION['logado'])) {
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Página de Administrador</title>
    <link rel="icon" type="image/png" href="img/Favicon.png">
    <style>body{font-family:Arial; background:#e8f5e9; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;} .box{background:white; padding:40px; border-radius:12px; box-shadow:0 8px 20px rgba(0,143,76,0.15); border-top:6px solid #008f4c; text-align:center; width: 300px;} input{width:100%; padding:12px; margin:10px 0; border:1px solid #a5d6a7; border-radius:6px; box-sizing:border-box;} input:focus{outline:none; border-color:#008f4c; box-shadow:0 0 5px rgba(0,143,76,0.4);} button{width:100%; padding:12px; background:#008f4c; color:white; border:none; cursor:pointer; font-weight:bold; border-radius:6px; margin-top:10px; transition:0.3s;} button:hover{background:#00703c;}</style></head>
    <body><div class="box">
    <img src="img/Logo.png" alt="Logo Objetiva" style="max-width: 150px; margin-bottom: 20px;">
    <h2 style="margin-top:0; color:#008f4c; font-size:18px;">Página de Administrador Objetiva</h2>';
    if(isset($erro_login)) echo "<p style='color:red;'>$erro_login</p>";
    echo '<form method="POST"><input type="text" name="usuario" placeholder="Usuário" required><input type="password" name="senha" placeholder="Senha" required><button type="submit" name="login">Entrar</button></form></div></body></html>';
    exit;
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "CREATE TABLE IF NOT EXISTS cursos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        imagem VARCHAR(255) NOT NULL,
        carga_horaria VARCHAR(100),
        conteudo TEXT
    )";
    $pdo->exec($sql);
} catch(PDOException $e) { die("Erro de conexão: " . $e->getMessage()); }

// ==========================================
// CARREGAR DADOS PARA EDIÇÃO
// ==========================================
$curso_edit = null;
if (isset($_GET['editar'])) {
    $stmt = $pdo->prepare("SELECT * FROM cursos WHERE id = ?");
    $stmt->execute([$_GET['editar']]);
    $curso_edit = $stmt->fetch(PDO::FETCH_ASSOC);
}

// ==========================================
// SALVAR OU ATUALIZAR CURSO
// ==========================================
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['salvar_curso'])) {
    $id_curso = $_POST['id_curso'];
    $imagem = $_POST['imagem_atual']; 
    
    // Se fez upload de uma imagem nova, substitui a atual
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
        $extensao = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
        $novo_nome = uniqid() . '.' . $extensao;
        move_uploaded_file($_FILES['imagem']['tmp_name'], 'img/' . $novo_nome);
        $imagem = 'img/' . $novo_nome;
    }

    if (!empty($id_curso)) {
        // MODO ATUALIZAR (UPDATE)
        $stmt = $pdo->prepare("UPDATE cursos SET tipo=?, titulo=?, descricao=?, imagem=?, carga_horaria=?, conteudo=? WHERE id=?");
        $stmt->execute([$_POST['tipo'], $_POST['titulo'], $_POST['descricao'], $imagem, $_POST['carga_horaria'], $_POST['conteudo'], $id_curso]);
        $mensagem = "Curso atualizado com sucesso!";
    } else {
        // MODO ADICIONAR NOVO (INSERT)
        $stmt = $pdo->prepare("INSERT INTO cursos (tipo, titulo, descricao, imagem, carga_horaria, conteudo) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$_POST['tipo'], $_POST['titulo'], $_POST['descricao'], $imagem, $_POST['carga_horaria'], $_POST['conteudo']]);
        $mensagem = "Novo curso salvo com sucesso!";
    }
    // Redireciona para limpar o formulário e a URL
    header("Location: gestao-objetiva.php?msg=" . urlencode($mensagem));
    exit;
}

if (isset($_GET['deletar'])) {
    $stmt = $pdo->prepare("DELETE FROM cursos WHERE id = ?");
    $stmt->execute([$_GET['deletar']]);
    header("Location: gestao-objetiva.php?msg=Curso+excluido"); exit;
}

$cursos = $pdo->query("SELECT * FROM cursos ORDER BY titulo ASC")->fetchAll(PDO::FETCH_ASSOC);
$msg_sucesso = isset($_GET['msg']) ? $_GET['msg'] : '';
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Painel Cursos</title>
    <link rel="icon" type="image/png" href="img/Favicon.png">
    
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #e8f5e9; color: #333; margin: 0; padding: 40px 20px; }
        .container { max-width: 1000px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0, 143, 76, 0.15); border-top: 6px solid #008f4c; }
        h2 { color: #008f4c; margin-top: 0; }
        h3 { color: #2e7d32; }
        form { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f1f8f4; padding: 25px; border-radius: 8px; border: 1px solid #c8e6c9; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #a5d6a7; border-radius: 6px; box-sizing: border-box; outline: none; transition: 0.3s; }
        input:focus, select:focus, textarea:focus { border-color: #008f4c; box-shadow: 0 0 5px rgba(0, 143, 76, 0.4); }
        button { grid-column: span 2; padding: 15px; background: #008f4c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: 0.3s; }
        button:hover { background: #00703c; }
        .btn-cancelar { background: #6c757d; text-align: center; color: white; padding: 12px; text-decoration: none; border-radius: 6px; grid-column: span 2; display: block; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        th { background: #008f4c; color: white; padding: 15px; text-align: left; }
        td { padding: 15px; border-bottom: 1px solid #e0e0e0; }
        tr:hover { background: #f1f8f4; }
        .acoes a { margin-right: 10px; padding: 8px 14px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; color: white; }
        .btn-edit { background: #008f4c; }
        .btn-edit:hover { background: #00703c; }
        .btn-del { background: #dc3545; }
        .btn-del:hover { background: #c82333; }
        .btn-sair { 
        background: #dc3545; 
        color: white; 
        padding: 8px 16px; 
        text-decoration: none; 
        font-weight: bold; 
        border-radius: 6px; 
        font-size: 14px; 
        transition: 0.3s; 
    }
    .btn-sair:hover { 
        background: #c82333; 
        box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
    }
    </style>
</head>
<body>
<div class="container">
    <div style="display:flex; justify-content:space-between; align-items: center;">
        <h2>Gerenciar Cursos</h2>
        <a href="?sair=1" class="btn-sair">Sair</a>
    </div>
    
    <?php if($msg_sucesso) echo "<p style='color:green; font-weight:bold; padding: 10px; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 6px;'>$msg_sucesso</p>"; ?>
    
    <h3 style="margin-top:0; color:#555;"><?= $curso_edit ? "Editando: " . htmlspecialchars($curso_edit['titulo']) : "Adicionar Novo Curso" ?></h3>
    
    <form method="POST" enctype="multipart/form-data">
        
        <input type="hidden" name="id_curso" value="<?= $curso_edit ? $curso_edit['id'] : '' ?>">
        <input type="hidden" name="imagem_atual" value="<?= $curso_edit ? $curso_edit['imagem'] : '' ?>">

        <select name="tipo">
            <option value="padrao" <?= ($curso_edit && $curso_edit['tipo'] == 'padrao') ? 'selected' : '' ?>>Padrão</option>
            <option value="uniritter" <?= ($curso_edit && $curso_edit['tipo'] == 'uniritter') ? 'selected' : '' ?>>Uniritter</option>
        </select>
        
        <input type="text" name="titulo" placeholder="Título do Curso" value="<?= $curso_edit ? htmlspecialchars($curso_edit['titulo']) : '' ?>" required>
        
        <input type="text" name="descricao" placeholder="Descrição curta (Aparece no card)" value="<?= $curso_edit ? htmlspecialchars($curso_edit['descricao']) : '' ?>" style="grid-column:span 2" required>
        
        <input type="text" name="carga_horaria" placeholder="Carga Horária (Ex: 100 Horas)" value="<?= $curso_edit ? htmlspecialchars($curso_edit['carga_horaria']) : '' ?>">
        
        <div>
            <input type="file" name="imagem" accept="image/*" <?= $curso_edit ? '' : 'required' ?> style="background: white;">
            <?php if($curso_edit): ?>
                <small style="color:#666; display:block; margin-top:5px;">Deixe vazio para manter a imagem atual.</small>
            <?php endif; ?>
        </div>

        <textarea name="conteudo" placeholder="Módulos (Separados por vírgula) ou Texto Longo para EJA" style="grid-column:span 2" rows="4"><?= $curso_edit ? htmlspecialchars($curso_edit['conteudo']) : '' ?></textarea>
        
        <button type="submit" name="salvar_curso"><?= $curso_edit ? "Salvar Alterações" : "Adicionar Curso" ?></button>
        
        <?php if($curso_edit): ?>
            <a href="gestao-objetiva.php" class="btn-cancelar">Cancelar Edição</a>
        <?php endif; ?>
    </form>

    <table>
        <tr><th>Img</th><th>Título</th><th>Tipo</th><th>Ações</th></tr>
        <?php foreach($cursos as $c): ?>
        <tr>
            <td><img src="<?= $c['imagem'] ?>" width="50" style="border-radius:4px; object-fit:cover; height:50px;"></td>
            <td style="font-weight: bold;"><?= $c['titulo'] ?></td>
            <td><?= $c['tipo'] ?></td>
            <td class="acoes">
                <a href="?editar=<?= $c['id'] ?>" class="btn-edit">Editar</a>
                <a href="?deletar=<?= $c['id'] ?>" class="btn-del" onclick="return confirm('Tem certeza que deseja excluir este curso?');">Excluir</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</div></body></html>