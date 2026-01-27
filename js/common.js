/* ==================================================================
   COMMON JS: Navigation, Footer, and UI Interactions
   ================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // --- 1. Auto-Update Copyright Year ---
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Mobile Menu Toggle (Responsive) ---
    // If you add a hamburger icon later, this logic handles the click
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('open');
        });
    }

    // --- 3. Sticky Header Effect ---
    // Adds a 'scrolled' class to header when user scrolls down
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
            header.style.background = "rgba(15, 23, 42, 0.95)"; // Glassmorphism
            header.style.backdropFilter = "blur(10px)";
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = "none";
            header.style.background = "#0f172a";
        }
    });

    // --- 4. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});