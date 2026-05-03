/*
    CACHE-BUSTING REMINDER:
    After editing this file, bump the `?v=YYYY-MM-DD` date in `index.html` on the
    `<script src="js/lightbox.js?v=...">` line (and use the SAME date on the
    `<link rel="stylesheet" href="styles.css?v=...">` line). Otherwise visitors will
    keep running the cached old script after deploy.
*/
(function () {
    'use strict';

    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    if (!gallery || !lightbox) return;

    const items = Array.from(gallery.querySelectorAll('.gallery-item'));
    if (items.length === 0) return;

    const imgEl = lightbox.querySelector('.lightbox-img');
    const captionEl = lightbox.querySelector('.lightbox-caption');
    const counterEl = lightbox.querySelector('.lightbox-counter');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    let current = 0;
    let lastFocused = null;
    let touchStartX = null;
    let touchStartY = null;

    function show(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        current = index;

        const item = items[current];
        const href = item.getAttribute('href');
        const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';

        imgEl.src = href;
        imgEl.alt = caption;
        captionEl.textContent = caption;
        counterEl.textContent = (current + 1) + ' / ' + items.length;

        // Preload neighbours for snappy navigation.
        [items[(current + 1) % items.length], items[(current - 1 + items.length) % items.length]]
            .forEach(neighbour => {
                if (!neighbour) return;
                const url = neighbour.getAttribute('href');
                if (url) { const i = new Image(); i.src = url; }
            });
    }

    function open(index) {
        lastFocused = document.activeElement;
        show(index);
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        btnClose.focus();
        document.addEventListener('keydown', onKey);
    }

    function close() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
        imgEl.src = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    }

    items.forEach((item, index) => {
        item.addEventListener('click', e => {
            e.preventDefault();
            open(index);
        });
    });

    btnClose.addEventListener('click', close);
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) close();
    });

    lightbox.addEventListener('touchstart', e => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) next(); else prev();
        }
        touchStartX = touchStartY = null;
    }, { passive: true });
})();
