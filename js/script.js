/**
 * =========================================
 * 1. INICIALIZAÇÃO GERAL
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MENU MOBILE ---
    const btnMobile = document.getElementById('mobile-btn');
    const menuLista = document.getElementById('menu-lista'); // O UL que deve receber a classe active

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
                        // O TRUQUE PARA IMAGEM NÃO FICAR GIGANTE:
                        // Adicionamos 'padding' lateral. Isso diminui a largura útil do card.
                        // Como a imagem tem largura 100%, ao diminuir a largura, a altura diminui junto proporcionalmente.
                        // Resultado: Imagem inteira, legível e num tamanho bom.
                        padding: '1.5rem' 
                    }
                }
            }).mount();
        }
    } else {
        console.warn("A biblioteca Splide.js não foi encontrada.");
    }

    // --- INICIALIZA O MODAL ---
    initModal();
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
 * 3. WIDGET FLUTUANTE DO WHATSAPP
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