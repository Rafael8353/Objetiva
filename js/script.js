/**
 * =========================================
 * 1. CARROSSEL DE CURSOS
 * =========================================
 */
function scrollCursos(direction) {
    const track = document.getElementById('track-cursos');

    // Verifica se o elemento existe para evitar erros
    if (!track) return;

    // Tamanho do card + espaçamento (gap)
    const scrollAmount = 320;

    // Usa o método scrollBy para rolagem suave nativa
    if (direction === 1) {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}

/**
 * =========================================
 * 2. WIDGET FLUTUANTE DO WHATSAPP
 * =========================================
 */
function toggleWhatsApp() {
    const menu = document.getElementById('wa-menu');
    const mainIcon = document.getElementById('wa-main-icon');
    const closeIcon = document.getElementById('wa-close-icon');

    // Garante que todos os elementos necessários existem
    if (!menu || !mainIcon || !closeIcon) return;

    // Alterna a classe 'open' que controla a visibilidade no CSS
    menu.classList.toggle('open');

    const isOpen = menu.classList.contains('open');

    // Alterna a exibição entre o ícone do Logo e o 'X'
    if (isOpen) {
        mainIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mainIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

/**
 * =========================================
 * 3. INICIALIZAÇÃO E MENU MOBILE
 * =========================================
 */
document.addEventListener('DOMContentLoaded', function() {
    const btnMobile = document.getElementById('mobile-btn');
    const menuLista = document.getElementById('menu-lista'); // O <ul> dentro do nav

    if (btnMobile && menuLista) {
        // Abre/Fecha o menu ao clicar no botão hambúrguer
        btnMobile.addEventListener('click', function() {
            menuLista.classList.toggle('active');
        });

        // (Opcional) Fecha o menu automaticamente ao clicar em um link
        const links = menuLista.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuLista.classList.remove('active');
            });
        });
    }
});