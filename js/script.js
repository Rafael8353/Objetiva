/**
 * =========================================
 * 1. INICIALIZAÇÃO GERAL
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MENU MOBILE ---
    const btnMobile = document.getElementById('mobile-btn');
    const menuLista = document.getElementById('menu-lista'); // O UL que contém os itens

    if (btnMobile && menuLista) {
        // Alternar menu ao clicar no botão
        btnMobile.addEventListener('click', function() {
            menuLista.classList.toggle('active');
        });

        // Fechar menu ao clicar em qualquer link
        const links = menuLista.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuLista.classList.remove('active');
            });
        });
    }

    // --- CARROSSEL COM SPLIDE.JS ---
    if (typeof Splide !== 'undefined') {
        const elms = document.getElementsByClassName('splide');

        // Inicializa todos os carrosséis encontrados na página
        for (let i = 0; i < elms.length; i++) {
            new Splide(elms[i], {
                type: 'loop',       // Loop infinito
                perPage: 3,         // 3 cards no Desktop
                perMove: 1,
                gap: '30px',
                pagination: false,
                arrows: true,
                
                // Responsividade
                breakpoints: {
                    1024: {
                        perPage: 2, // 2 cards em Tablets
                    },
                    768: {
                        perPage: 1, // 1 card em Celulares
                        gap: '15px',
                        padding: '0' // Sem padding lateral no mobile para focar no card inteiro
                    }
                }
            }).mount();
        }
    } else {
        console.warn("A biblioteca Splide.js não foi encontrada.");
    }

    // --- INICIALIZAÇÕES ---
    initModal();
    initFormSubmission(); // Ativa o envio do formulário via JS
});

/**
 * =========================================
 * 2. LÓGICA DO MODAL (CARD FLUTUANTE)
 * =========================================
 */
function initModal() {
    const modal = document.getElementById('modal-curso');
    const modalContainer = document.querySelector('.modal-container'); 
    const closeBtn = document.querySelector('.close-modal');
    
    // Elementos Internos do Modal
    const modalTitle = document.getElementById('modal-titulo');
    const modalDesc = document.getElementById('modal-descricao');
    const modalWhatsapp = document.getElementById('modal-whatsapp-btn');
    
    // Seções Dinâmicas (Listas e Carga Horária)
    const modalListaContainer = document.getElementById('modal-lista-container');
    const modalListaTitulo = document.getElementById('modal-lista-titulo');
    const modalListaUl = document.getElementById('modal-lista-ul');
    const modalCargaContainer = document.getElementById('modal-carga-container');
    const modalCargaValor = document.getElementById('modal-carga-valor');
    
    // Usamos 'Event Delegation' para capturar cliques (inclusive em clones do Splide)
    document.addEventListener('click', (e) => {
        // Verifica se clicou num botão de abrir modal
        const btn = e.target.closest('.btn-abrir-modal');
        
        if (!btn) return; 

        e.preventDefault();

        // Encontra o card pai para extrair os dados
        const card = btn.closest('.card-curso');
        
        // Extrai dados básicos
        const titulo = card.querySelector('h3').innerText;
        // Tenta pegar descrição do atributo data (se existir) ou do parágrafo
        const descricao = card.getAttribute('data-descricao') || card.querySelector('p').innerText;
        const tipo = card.getAttribute('data-modal-type'); // 'padrao' ou 'uniritter'

        // Preenche Básico
        modalTitle.innerText = titulo;
        modalDesc.innerText = descricao;

        // RESET: Limpa estados anteriores
        modalContainer.classList.remove('uniritter-theme');
        if (modalListaContainer) modalListaContainer.style.display = 'none';
        if (modalCargaContainer) modalCargaContainer.style.display = 'none';
        if (modalListaUl) modalListaUl.innerHTML = '';

        // --- LÓGICA CONDICIONAL ---
        
        if (tipo === 'uniritter') {
            // TEMA UNIRITTER (Vermelho + Lista de Cursos)
            modalContainer.classList.add('uniritter-theme');
            
            const listaCursos = card.getAttribute('data-lista');
            if (listaCursos) {
                modalListaContainer.style.display = 'block';
                modalListaTitulo.innerText = "Cursos disponíveis:";
                
                listaCursos.split(',').forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    modalListaUl.appendChild(li);
                });
            }

        } else {
            // TEMA PADRÃO (Verde + Módulos + Carga Horária)
            
            // 1. Carga Horária
            const carga = card.getAttribute('data-carga');
            if (carga) {
                modalCargaContainer.style.display = 'block';
                modalCargaValor.innerText = carga;
            }

            // 2. Módulos
            const modulos = card.getAttribute('data-modulos');
            if (modulos) {
                modalListaContainer.style.display = 'block';
                modalListaTitulo.innerText = "Módulos do Curso:";
                
                modulos.split(',').forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    modalListaUl.appendChild(li);
                });
            }
        }

        // Link do WhatsApp
        const mensagem = encodeURIComponent(`Olá! Vi no site e tenho interesse em: ${titulo}. Poderia dar-me mais informações?`);
        const telefoneDestino = "5551999869527"; 
        
        modalWhatsapp.href = `https://wa.me/${telefoneDestino}?text=${mensagem}`;

        // Exibe o modal
        modal.classList.add('active');
    });

    // Fechar Modal
    const fecharModal = () => {
        modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', fecharModal);

    // Fecha ao clicar no fundo escuro
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

/**
 * =========================================
 * 3. ENVIO DO FORMULÁRIO (AJAX)
 * Esta função intercepta o envio e redireciona manualmente
 * =========================================
 */
function initFormSubmission() {
    const form = document.getElementById('form-bolsa');
    
    // Se não encontrar o formulário, sai da função
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // IMPEDE o envio normal que abre o site do Formspree
        
        const data = new FormData(form);
        const btn = document.getElementById('btn-enviar-bolsa');
        const msgErro = document.getElementById('msg-erro');
        const textoOriginal = btn.innerText;

        // Feedback Visual (Carregando...)
        btn.innerText = 'Enviando...';
        btn.disabled = true;
        if (msgErro) msgErro.style.display = 'none';

        // Envia os dados "por baixo dos panos"
        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // SUCESSO: Redireciona manualmente para o arquivo local
                window.location.href = "success.html";
            } else {
                // ERRO DO FORMSPREE
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        if (msgErro) {
                            msgErro.innerText = "Ocorreu um erro ao enviar. Tente novamente.";
                            msgErro.style.display = 'block';
                        } else {
                            alert('Ocorreu um erro ao enviar.');
                        }
                    }
                });
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }
        }).catch(error => {
            // ERRO DE REDE
            if (msgErro) {
                msgErro.innerText = "Erro de conexão. Verifique sua internet.";
                msgErro.style.display = 'block';
            } else {
                alert('Erro de conexão. Tente novamente.');
            }
            btn.innerText = textoOriginal;
            btn.disabled = false;
        });
    });
}

/**
 * =========================================
 * 4. WIDGET FLUTUANTE DO WHATSAPP
 * =========================================
 */
function toggleWhatsApp() {
    const menu = document.getElementById('wa-menu');
    const mainIcon = document.getElementById('wa-main-icon');
    const closeIcon = document.getElementById('wa-close-icon');

    if (!menu || !mainIcon || !closeIcon) return;

    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');

    // Alterna ícones
    if (isOpen) {
        mainIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mainIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}