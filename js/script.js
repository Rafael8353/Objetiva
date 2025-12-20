/**
 * =========================================
 * 1. INICIALIZAÇÃO GERAL
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MENU MOBILE ---
    const btnMobile = document.getElementById('mobile-btn');
    const navMenu = document.querySelector('.desktop-menu'); // Seletor ajustado para a versão sem Bootstrap

    if (btnMobile && navMenu) {
        btnMobile.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Fecha o menu automaticamente ao clicar num link
        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
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
    
    // Seleciona todos os botões que abrem o modal
    // Usamos 'document' para delegar o evento, garantindo que funcione nos clones do Splide
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-abrir-modal');
        
        if (!btn) return; // Se não clicou no botão, sai da função

        e.preventDefault();

        // Encontra o card pai para extrair as informações
        const card = btn.closest('.card-curso');
        
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

        // Limpa a lista anterior
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
            // TEMA PADRÃO (Verde + Módulos com carga horária)
            
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

        // Gera o link do WhatsApp dinâmico
        const mensagem = encodeURIComponent(`Olá! Vi no site e tenho interesse em: ${titulo}. Poderia dar-me mais informações?`);
        const telefoneDestino = "5551999869527"; 
        
        modalWhatsapp.href = `https://wa.me/${telefoneDestino}?text=${mensagem}`;

        // Exibe o modal
        modal.classList.add('active');
    });

    // Função para fechar o modal
    const fecharModal = () => {
        modal.classList.remove('active');
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