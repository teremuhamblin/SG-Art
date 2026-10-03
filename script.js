// ===============================
// Quantum‑Era Navigation Engine
// ===============================

const navItems = document.querySelectorAll('.nav-list li');
const sections = document.querySelectorAll('.section');

// Activate section instantly with GPU fade
function activateSection(id) {
    sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === id) {
            sec.classList.add('active');
        }
    });
}

// Navigation click handler
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active from all
        navItems.forEach(i => i.classList.remove('active'));

        // Set active on clicked
        item.classList.add('active');

        // Extract target section ID
        const target = item.querySelector('a').getAttribute('href').replace('#', '');

        // Activate section
        activateSection(target);
    });
});
