/*

Armorsil WA — Construction Chemical Company

https://armorsilwa.com

*/

/* ===== Mobile Nav Toggle ===== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded',
        navToggle.classList.contains('active'));
});

const isMobile = () => window.innerWidth <= 768;

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMobile()) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

/* ===== Dropdown Toggle (Mobile) ===== */
const dropdownToggle = document.querySelector('.nav-dropdown > a');
if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
        if (isMobile()) {
            e.preventDefault();
            dropdownToggle.parentElement.classList.toggle('open');
        }
    });
}



/* ===== Scroll Reveal ===== */
/* 3-second fallback for iframe previews where IntersectionObserver may not fire */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${i * 60}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));

    /* Fallback: force all reveals visible after 3s (iframe preview) */
    setTimeout(() => {
        reveals.forEach(el => el.classList.add('visible'));
    }, 3000);
} else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ===== Awards Auto-Cycle ===== */
(function awardsCycle() {
    const list = document.getElementById('awardsList');
    if (!list) return;
    const items = list.querySelectorAll('.award-item');
    const image = document.getElementById('awardsImage');
    const dots = document.querySelectorAll('.awards-progress-dot');
    if (!items.length || !image) return;

    let current = 0;
    let interval;

    function activate(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        image.classList.add('fade');
        setTimeout(() => {
            image.src = items[index].dataset.image;
            image.classList.remove('fade');
        }, 300);
    }

    function next() {
        current = (current + 1) % items.length;
        activate(current);
    }

    function startCycle() {
        activate(0);
        interval = setInterval(next, 3000);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            current = i;
            activate(current);
            interval = setInterval(next, 3000);
        });
    });

    /* Observer: start when visible */
    const section = document.querySelector('.awards');
    if (section && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCycle();
                obs.unobserve(section);
            }
        }, { threshold: 0.3 });
        obs.observe(section);
    } else {
        startCycle();
    }
})();
