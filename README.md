# 🎓 Sistema de Gestão Dinâmica de Cursos

Um sistema web completo desenvolvido para exibição dinâmica de cursos, captação de leads (bolsas de estudo) e um painel administrativo customizado para gerenciamento de conteúdo.

## 🚀 Visão Geral do Projeto

Este projeto transformou um site institucional estático criado por mim em uma plataforma dinâmica. Um site de uma Loja/Grupo de Ensino também agora funciona com um sistema que permite que administradores gerenciem o catálogo de cursos (adicionando, editando e excluindo) através de um painel seguro, refletindo as mudanças em tempo real na vitrine do site sem a necessidade de alterar o código HTML.

## ✨ Funcionalidades

### Frontend (Vitrine do Site)
* **Carrosséis Dinâmicos:** Exibição de cursos separados por categorias (Padrão e Uniritter) utilizando a biblioteca Splide.js.
* **Modais Interativos:** Ao clicar em um curso, um modal detalhado é aberto com informações extras, carga horária e lista de módulos.
* **Integração com WhatsApp:** Botões de conversão que redirecionam o aluno diretamente para o WhatsApp da instituição com uma mensagem pré-configurada sobre o curso de interesse.
* **Captação de Leads:** Formulário de solicitação de bolsas integrado com envio de e-mails via SMTP autêntico.

### Backend (Painel Administrativo)
* **Autenticação:** Área restrita protegida por login e senha.
* **CRUD Completo:** Sistema para Cadastrar, Ler, Atualizar e Excluir cursos diretamente no banco de dados.
* **Upload de Mídia:** Gerenciador de upload de imagens (capas dos cursos) integrado.
* **API RESTful Simples:** Endpoint (`api-cursos.php`) que fornece os dados dos cursos em formato JSON para consumo assíncrono (Fetch API) pelo frontend.
* **Setup Automatizado:** O script PHP verifica e cria automaticamente a tabela `cursos` no banco de dados no primeiro acesso, facilitando a migração de servidor.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Backend:** PHP (Vanilla)
* **Banco de Dados:** MySQL / PDO (PHP Data Objects)
* **Envio de E-mails:** [PHPMailer](https://github.com/PHPMailer/PHPMailer) (Envio via SMTP SSL/TLS)
* **Componentes UI:** [Splide.js](https://splidejs.com/) (Carrosséis)

## 📁 Estrutura de Diretórios

```text
/
├── index.html              # Página principal e vitrine de cursos
├── gestao-objetiva.php     # Painel Administrativo (Protegido)
├── api-cursos.php          # Endpoint JSON que alimenta o frontend
├── enviar-email.php        # Controlador de disparo de e-mails (Formulário)
├── css/                    # Arquivos de estilo
├── js/                     # Scripts de frontend (Consumo da API e Modais)
├── img/                    # Diretório de armazenamento de imagens e uploads
└── PHPMailer/              # Biblioteca de envio de e-mails