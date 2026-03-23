# 🎓 Objetiva Grupo de Ensino - Website Institucional

Este repositório contém o código-fonte do website institucional da **Objetiva Grupo de Ensino**, uma escola focada em cursos profissionalizantes, informática e idiomas, com unidades em Charqueadas e Arroio dos Ratos (RS).

O projeto é uma **Landing Page** responsiva, otimizada para conversão de leads e divulgação da grade curricular.

O Site está atualmente no ar no link: https://objetivagrupodeensino.com.br/

## 🖥️ Visualização do Projeto

O site apresenta:
* **Home:** Banner principal e proposta de valor.
* **Localização:** Mapas interativos das duas unidades.
* **Cursos:** Carrossel interativo com listagem de cursos profissionalizantes e Uniritter.
* **Bolsas:** Formulário de captação de leads integrado.
* **Contato:** Links para redes sociais e widget de WhatsApp.

## 🚀 Tecnologias Utilizadas

* **HTML5 Semântico:** Estrutura limpa e organizada.
* **CSS3 Moderno:** Uso de *CSS Variables* (`:root`), Flexbox e CSS Grid. Design totalmente responsivo (Mobile-First).
* **JavaScript (Vanilla):** Lógica para menu mobile, modais dinâmicos e manipulação do DOM.
* **[Splide.js](https://splidejs.com/):** Biblioteca leve para criação dos carrosséis (sliders) de cursos.
* **[Formspree](https://formspree.io/):** Backend-as-a-service para processamento do formulário de contato/bolsas.
* **Google Fonts:** Tipografia *Montserrat*.

## ✨ Funcionalidades Principais

1.  **Carrossel de Cursos:**
    * Utiliza a biblioteca *Splide.js*.
    * Adaptável: Exibe 3 cards no desktop, 2 no tablet e 1 no mobile.

2.  **Sistema de Modal Dinâmico:**
    * Ao clicar em um curso (botão ou imagem), um modal flutuante se abre.
    * O conteúdo do modal é preenchido dinamicamente via JavaScript usando atributos `data-*` do HTML (Título, Carga Horária, Lista de Módulos).
    * Possui tratamento para listas longas (scroll interno) no mobile.

3.  **Widget Flutuante de WhatsApp:**
    * Botão fixo no canto da tela.
    * Ao clicar, expande um menu com opções diretas para a unidade de **Arroio dos Ratos** ou **Charqueadas**.

4.  **Formulário de Bolsas:**
    * Envio direto via Formspree.
    * Validação básica de HTML5.

## 📂 Estrutura de Pastas

```text
/
├── index.html      # Estrutura principal
├── css/
│   └── style.css   # Estilos globais e responsividade
├── js/
│   └── script.js   # Lógica (Menu, Modal, Slider)
├── img/            # Imagens (Banners, Logos, Cursos em .jpg)
└── README.md       # Documentação

⚙️ Configuração e Personalização

Para clonar e rodar este projeto localmente:

1. git clone [https://github.com/SEU-USUARIO/NOME-DO-REPO.git](https://github.com/SEU-USUARIO/NOME-DO-REPO.git)

2. Abra o index.html no seu navegador.