/**
 * =========================================
 * 1. INICIALIZAÇÃO GERAL
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MENU MOBILE ---
    const btnMobile = document.getElementById('mobile-btn');
    const menuLista = document.getElementById('menu-lista');

    if (btnMobile && menuLista) {
        btnMobile.addEventListener('click', function() {
            menuLista.classList.toggle('active');
        });

        // Fecha o menu automaticamente ao clicar num link
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
                        gap: '15px', // Espaço menor entre cards
                        padding: '10%' // MOSTRA 10% DO PRÓXIMO CARD (Reduz o tamanho do atual)
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
    
    // Seções Dinâmicas (Lista e Carga Horária)
    const modalListaContainer = document.getElementById('modal-lista-container');
    const modalListaTitulo = document.getElementById('modal-lista-titulo');
    const modalListaUl = document.getElementById('modal-lista-ul');
    const modalCargaContainer = document.getElementById('modal-carga-container');
    const modalCargaValor = document.getElementById('modal-carga-valor');
    
    // CORREÇÃO: Uso de 'Event Delegation' para capturar cliques em slides clonados pelo Splide
    document.addEventListener('click', (e) => {
        // Verifica se o elemento clicado (ou um parente dele) é o botão de abrir modal
        const btn = e.target.closest('.btn-abrir-modal');
        
        // Se não foi um clique no botão, ignora
        if (!btn) return;

        e.preventDefault();

        // Encontra o card pai para extrair as informações
        const card = btn.closest('.card-curso');
        if (!card) return;
        
        // Pega dados básicos
        const titulo = card.querySelector('h3').innerText;
        const descricao = card.querySelector('p').innerText;
        const tipo = card.getAttribute('data-modal-type'); // 'padrao' ou 'uniritter'

        // Preenche Básico
        modalTitle.innerText = titulo;
        modalDesc.innerText = descricao;

        // RESET: Esconde seções e remove temas antigos
        modalContainer.classList.remove('uniritter-theme');
        if (modalListaContainer) modalListaContainer.style.display = 'none';
        if (modalCargaContainer) modalCargaContainer.style.display = 'none';

        // LÓGICA CONDICIONAL
        if (tipo === 'uniritter') {
            // --- TEMA UNIRITTER (Vermelho + Lista de Cursos) ---
            modalContainer.classList.add('uniritter-theme');
            
            const listaCursos = card.getAttribute('data-lista');
            if (listaCursos && modalListaContainer) {
                modalListaContainer.style.display = 'block';
                if (modalListaTitulo) modalListaTitulo.innerText = "Cursos disponíveis:";
                if (modalListaUl) {
                    modalListaUl.innerHTML = '';
                    listaCursos.split(',').forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.trim();
                        modalListaUl.appendChild(li);
                    });
                }
            }

        } else {
            // --- TEMA PADRÃO (Verde + Módulos + Carga Horária) ---
            
            // 1. Carga Horária (se houver)
            const carga = card.getAttribute('data-carga');
            if (carga && modalCargaContainer) {
                modalCargaContainer.style.display = 'block';
                if (modalCargaValor) modalCargaValor.innerText = carga;
            }

            // 2. Lista de Módulos
            const modulos = card.getAttribute('data-modulos');
            if (modulos && modalListaContainer) {
                modalListaContainer.style.display = 'block';
                if (modalListaTitulo) modalListaTitulo.innerText = "Módulos do Curso:";
                if (modalListaUl) {
                    modalListaUl.innerHTML = '';
                    modulos.split(',').forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.trim();
                        modalListaUl.appendChild(li);
                    });
                }
            }
        }

        // Gera o link do WhatsApp dinâmico
        const mensagem = encodeURIComponent(`Olá! Vi no site e tenho interesse em: ${titulo}. Poderia dar-me mais informações?`);
        const telefoneDestino = "5551999869527"; 
        
        if (modalWhatsapp) {
            modalWhatsapp.href = `https://wa.me/${telefoneDestino}?text=${mensagem}`;
        }

        // Exibe o modal
        if (modal) modal.classList.add('active');
    });

    // Função para fechar o modal
    const fecharModal = () => {
        if (modal) modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', fecharModal);

    // Fecha ao clicar fora do conteúdo (no fundo escuro)
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

    // Alterna ícone entre Logo e X
    if (isOpen) {
        mainIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mainIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}