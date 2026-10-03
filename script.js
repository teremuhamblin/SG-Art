/* ==========================================
   SG@Art — Quantum‑Era JS v4.0
   Section Switching + Smooth Scroll
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav-list a");
    const sections = document.querySelectorAll(".section");

    function activateSection(id) {
        sections.forEach(sec => {
            sec.classList.toggle("active", sec.id === id);
        });

        navLinks.forEach(link => {
            const li = link.parentElement;
            li.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            activateSection(targetId);

            // Smooth scroll to top of container (mobile especially)
            const container = document.querySelector(".container");
            if (container) {
                container.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    });

    // Optional: ensure home is active on load
    activateSection("home");
});
