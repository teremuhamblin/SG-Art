/* ==========================================
   SG@Art HyperCube Quantum‑Era v5.0
   Rotation X/Y • Military OPS
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav-list a");
    const cube = document.querySelector(".hypercube");
    const sections = document.querySelectorAll(".section");

    function rotateCube(target) {

        let transform = "";

        switch (target) {
            case "home":
                transform = "rotateY(0deg) rotateX(0deg)";
                break;

            case "about":
                transform = "rotateY(-90deg) rotateX(0deg)";
                break;

            case "resume":
                transform = "rotateY(-180deg) rotateX(0deg)";
                break;

            case "contact":
                transform = "rotateY(90deg) rotateX(0deg)";
                break;

            case "market":
                transform = "rotateX(-90deg) rotateY(0deg)";
                break;

            case "ops":
                transform = "rotateX(90deg) rotateY(0deg)";
                break;
        }

        cube.style.transform = transform;

        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(target).classList.add("active");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.getAttribute("href").substring(1);
            rotateCube(target);

            navLinks.forEach(l => l.parentElement.classList.remove("active"));
            link.parentElement.classList.add("active");
        });
    });

});
