// Menu
const triggerMenu = document.body.querySelector('.toggle-all');
const closeMenu = document.querySelector('#close-menu');

triggerMenu.addEventListener('click', e => {
    if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
    } else {
        document.body.classList.add('menu-open');
    }
});

closeMenu.addEventListener('click', e => {
    document.body.classList.remove('menu-open');
});