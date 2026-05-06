<?php
header('Content-Type: application/json');

$db_host = 'SEU HOST'; 
$db_name = 'SEU NOME';
$db_user = 'SEU USER';
$db_pass = 'SUA SENHA';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $stmt = $pdo->query("SELECT * FROM cursos ORDER BY titulo ASC");
    $cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($cursos);
} catch(PDOException $e) {
    echo json_encode(["erro" => "Erro na conexão"]);
}
?>