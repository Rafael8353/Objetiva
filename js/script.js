/**
 * =========================================
 * 1. INICIALIZAÇÃO GERAL
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DE ALERTA DO FORMULÁRIO (COM CORREÇÃO DO PULO) ---
    const urlParams = new URLSearchParams(window.location.search);
    const statusForm = urlParams.get('status');

    if (statusForm === 'sucesso') {
        const msgSucesso = document.getElementById('msg-sucesso');
        if (msgSucesso) {
            msgSucesso.style.display = 'block'; // Mostra o card verde
            
            // Limpa a URL para não ficar aparecendo "?status=sucesso" o tempo todo
            const novaUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, novaUrl);

            // CORREÇÃO: Espera os cards carregarem e desliza suavemente até o aviso verde
            setTimeout(() => {
                msgSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    } else if (statusForm === 'erro') {
        const msgErro = document.getElementById('msg-erro');
        if (msgErro) {
            msgErro.style.display = 'block';
            msgErro.innerText = 'Ocorreu um erro ao enviar. Tente novamente ou chame no WhatsApp.';
            
            const novaUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, novaUrl);

            // CORREÇÃO: Desliza suavemente até o aviso vermelho
            setTimeout(() => {
                msgErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
    
    const btnMobile = document.getElementById('mobile-btn');
    const menuLista = document.getElementById('menu-lista');

    if (btnMobile && menuLista) {
        btnMobile.addEventListener('click', function() {
            menuLista.classList.toggle('active');
        });

        const links = menuLista.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuLista.classList.remove('active');
            });
        });
    }

    if (typeof Splide !== 'undefined') {
        
        function criarCard(curso) {
            let atributos = `data-modal-type="${curso.tipo}" `;
            
            let descricao = curso.descricao || '';
            let conteudo = curso.conteudo || '';
            let carga = curso.carga_horaria || '';
            
            if(curso.tipo === 'padrao') {
                atributos += `data-carga="${carga}" data-modulos="${conteudo}" data-descricao="${descricao}"`;
            } else {
                atributos += `data-lista="${conteudo}" data-descricao="${descricao}"`;
            }

            return `
                <li class="splide__slide">
                    <div class="card-curso" ${atributos}>
                        <div class="card-img-top btn-abrir-modal" style="cursor: pointer;">
                            <img src="${curso.imagem}" alt="${curso.titulo}">
                        </div>
                        <div class="card-body">
                            <h3>${curso.titulo}</h3>
                            <p>${descricao}</p>
                            <a href="#" class="btn-link btn-abrir-modal">Tenho Interesse →</a>
                        </div>
                    </div>
                </li>
            `;
        }

        fetch('api-cursos.php')
            .then(response => response.json())
            .then(cursos => {
                const listaPadrao = document.getElementById('lista-padrao');
                const listaUniritter = document.getElementById('lista-uniritter');

                if(cursos.erro) {
                    console.error('Erro no Banco de Dados:', cursos.erro);
                    return;
                }

                cursos.forEach(curso => {
                    if (curso.tipo === 'padrao' && listaPadrao) {
                        listaPadrao.innerHTML += criarCard(curso);
                    } else if (curso.tipo === 'uniritter' && listaUniritter) {
                        listaUniritter.innerHTML += criarCard(curso);
                    }
                });

                const elms = document.getElementsByClassName('splide');
                for (let i = 0; i < elms.length; i++) {
                    if (elms[i].querySelector('.splide__slide')) {
                        new Splide(elms[i], {
                            type: 'loop',
                            perPage: 3,
                            perMove: 1,
                            gap: '30px',
                            pagination: false,
                            arrows: true,
                            breakpoints: {
                                1024: { perPage: 2 },
                                768: { perPage: 1, gap: '15px', padding: '0' }
                            }
                        }).mount();
                    }
                }
            })
            .catch(error => console.error('Erro ao conectar com a API:', error));
            
    } else {
        console.warn("A biblioteca Splide.js não foi encontrada.");
    }

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
    
    const modalTitle = document.getElementById('modal-titulo');
    const modalDesc = document.getElementById('modal-descricao');
    const modalWhatsapp = document.getElementById('modal-whatsapp-btn');
    
    const modalListaContainer = document.getElementById('modal-lista-container');
    const modalListaTitulo = document.getElementById('modal-lista-titulo');
    const modalListaUl = document.getElementById('modal-lista-ul');
    const modalCargaContainer = document.getElementById('modal-carga-container');
    const modalCargaValor = document.getElementById('modal-carga-valor');
    
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-abrir-modal');
        if (!btn) return; 

        e.preventDefault();

        const card = btn.closest('.card-curso');
        const titulo = card.querySelector('h3').innerText;
        const descricao = card.getAttribute('data-descricao') || card.querySelector('p').innerText;
        const tipo = card.getAttribute('data-modal-type'); 

        modalTitle.innerText = titulo;
        modalDesc.innerText = descricao;
        modalDesc.classList.remove('descricao-reduzida');

        modalContainer.classList.remove('uniritter-theme');
        if (modalListaContainer) modalListaContainer.style.display = 'none';
        if (modalCargaContainer) modalCargaContainer.style.display = 'none';
        if (modalListaUl) modalListaUl.innerHTML = '';
        if (modalListaTitulo) modalListaTitulo.style.display = 'block';

        if (tipo === 'uniritter') {
            modalContainer.classList.add('uniritter-theme');
            const listaCursos = card.getAttribute('data-lista');
            if (listaCursos) {
                modalListaContainer.style.display = 'block';
                modalListaTitulo.innerText = "Cursos disponíveis:";
                listaCursos.split(',').forEach(item => {
                    if(item.trim() !== '') {
                        const li = document.createElement('li');
                        li.textContent = item.trim();
                        modalListaUl.appendChild(li);
                    }
                });
            }

        } else {
            const carga = card.getAttribute('data-carga');
            if (carga) {
                modalCargaContainer.style.display = 'block';
                modalCargaValor.innerText = carga;
            }

            const modulos = card.getAttribute('data-modulos');
            if (modulos) {
                // CORREÇÃO DA VÍRGULA: Se for EJA ou Personalizadas, trata como texto longo
                if (titulo.includes('EJA') || titulo.includes('Personalizadas')) {
                    modalListaContainer.style.display = 'none';
                    modalDesc.innerText = modulos; // O texto longo assume o lugar da descrição
                } else {
                    // Cursos normais com tópicos
                    modalListaContainer.style.display = 'block';
                    if (titulo.includes('IFSUL')) {
                        modalListaTitulo.style.display = 'none';
                    } else {
                        modalListaTitulo.style.display = 'block';
                        modalListaTitulo.innerText = "Módulos do Curso:";
                    }
                    
                    modulos.split(',').forEach(item => {
                        if(item.trim() !== '') {
                            const li = document.createElement('li');
                            li.textContent = item.trim();
                            modalListaUl.appendChild(li);
                        }
                    });
                }
            }
        }

        const mensagem = encodeURIComponent(`Olá! Vi no site e tenho interesse em: ${titulo}. Poderia dar-me mais informações?`);
        const telefoneDestino = "5551999869527"; 
        
        modalWhatsapp.href = `https://wa.me/${telefoneDestino}?text=${mensagem}`;
        modal.classList.add('active');
    });

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