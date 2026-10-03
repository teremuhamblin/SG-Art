/* ==========================================
   SG@Art — Quantum‑Era JS v3.2
   Section Switching + GPU Transitions
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav-list a");
    const sections = document.querySelectorAll(".section");

    function activateSection(id) {
        sections.forEach(sec => {
            sec.classList.remove("active");
            if (sec.id === id) sec.classList.add("active");
        });

        navLinks.forEach(link => {
            link.parentElement.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
                link.parentElement.classList.add("active");
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.getAttribute("href").substring(1);
            activateSection(target);
        });
    });

});
