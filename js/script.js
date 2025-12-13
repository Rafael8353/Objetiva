/**
 * =========================================
 * 1. INICIALIZAÇÃO E CARROSSEL (SPLIDE)
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

        // Fecha o menu automaticamente ao clicar em um link
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
                        gap: '20px'
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
 * 2. LÓGICA DO MODAL INTELIGENTE
 * =========================================
 */
function initModal() {
    const modal = document.getElementById('modal-curso');
    const modalContainer = document.querySelector('.modal-container'); // Para adicionar classe de tema
    const closeBtn = document.querySelector('.close-modal');
    
    // Elementos Internos
    const modalTitle = document.getElementById('modal-titulo');
    const modalDesc = document.getElementById('modal-descricao');
    const modalPrecos = document.getElementById('modal-precos');
    const modalLista = document.getElementById('modal-lista-container');
    const modalListaUl = document.getElementById('modal-lista-ul');
    const modalWhatsapp = document.getElementById('modal-whatsapp-btn');
    
    // Elementos de preço
    const precoEntrada = document.getElementById('preco-entrada');
    const precoMensalidade = document.getElementById('preco-mensalidade');

    // Seleciona botões de abrir
    const btnsAbrir = document.querySelectorAll('.btn-abrir-modal');

    btnsAbrir.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const card = btn.closest('.card-curso');
            
            // Dados básicos
            const titulo = card.querySelector('h3').innerText;
            const descricao = card.querySelector('p').innerText;
            
            // Dados Especiais (Data Attributes)
            const tipo = card.getAttribute('data-modal-type'); // 'padrao' ou 'uniritter'
            
            // Preenche Básico
            modalTitle.innerText = titulo;
            modalDesc.innerText = descricao;

            // RESET: Remove temas e esconde seções para não misturar informações
            modalContainer.classList.remove('uniritter-theme');
            if (modalPrecos) modalPrecos.style.display = 'none';
            if (modalLista) modalLista.style.display = 'none';

            // LÓGICA CONDICIONAL
            if (tipo === 'uniritter') {
                // TEMA VERMELHO (UNIRITTER)
                modalContainer.classList.add('uniritter-theme');
                
                // Pega a lista de cursos do HTML
                const listaCursos = card.getAttribute('data-lista');
                if (listaCursos && modalLista) {
                    modalLista.style.display = 'block';
                    modalListaUl.innerHTML = ''; // Limpa lista anterior
                    
                    // Transforma a string "Curso A, Curso B" em itens de lista
                    listaCursos.split(',').forEach(curso => {
                        const li = document.createElement('li');
                        li.textContent = curso.trim();
                        modalListaUl.appendChild(li);
                    });
                }

            } else {
                // TEMA PADRÃO (VERDE - OBJETIVA)
                if (modalPrecos) {
                    modalPrecos.style.display = 'block';
                    
                    const entrada = card.getAttribute('data-entrada') || 'Consulte';
                    const mensalidade = card.getAttribute('data-mensalidade') || 'Consulte';
                    
                    if (precoEntrada) precoEntrada.innerText = `R$ ${entrada}`;
                    if (precoMensalidade) precoMensalidade.innerText = `R$ ${mensalidade}`;
                }
            }

            // Link WhatsApp Dinâmico
            const mensagem = encodeURIComponent(`Olá! Vi no site e tenho interesse em: ${titulo}. Poderia me dar mais informações?`);
            // Número atualizado para redirecionamento
            const telefoneDestino = "5551999869527"; 
            modalWhatsapp.href = `https://wa.me/${telefoneDestino}?text=${mensagem}`;

            // Exibe
            modal.classList.add('active');
        });
    });

    // Fechar Modal
    const fecharModal = () => {
        modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', fecharModal);

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

    if (isOpen) {
        mainIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mainIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}