function myMenuFunction() {
    const menuBtn = document.getElementById("myNavMenu");
    menuBtn.classList.toggle("responsive");
}

function headerShadow() {
    const navHeader = document.getElementById("header");
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navHeader.style.boxShadow = "0 10px 40px rgba(15, 23, 42, 0.12)";
    } else {
        navHeader.style.boxShadow = "none";
    }
}

window.onscroll = headerShadow;

const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark");
    themeToggle.innerHTML = '<i class="uil uil-sun"></i>';
}

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.innerHTML = isDark ? '<i class="uil uil-sun"></i>' : '<i class="uil uil-moon"></i>';
});

let typingEffect = new Typed(".typedText", {
    strings: ["AI-driven products", "smart automation", "modern software"],
    loop: true,
    typeSpeed: 90,
    backSpeed: 70,
    backDelay: 1500
});

const sr = ScrollReveal({
    origin: "top",
    distance: "70px",
    duration: 1200,
    reset: true
});

sr.reveal(".featured-text-card", { delay: 60 });
sr.reveal(".featured-name", { delay: 100 });
sr.reveal(".featured-text-info", { delay: 160 });
sr.reveal(".featured-text-btn", { delay: 220 });
sr.reveal(".social_icons", { delay: 280 });
sr.reveal(".featured-image", { delay: 300 });
sr.reveal(".stat-card", { interval: 120 });
sr.reveal(".top-header", { delay: 50 });
sr.reveal(".about-info", { delay: 100 });
sr.reveal(".skill-card", { delay: 120 });
sr.reveal(".service-card", { interval: 100 });
sr.reveal(".project-card", { interval: 120 });
sr.reveal(".timeline-item", { interval: 100 });
sr.reveal(".contact-info", { delay: 100 });
sr.reveal(".form-control", { delay: 140 });

const counters = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const countValue = Number(target.dataset.count || 0);
        const suffix = target.dataset.suffix || "";
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            target.textContent = `${current}${suffix}`;
            if (current >= countValue) {
                clearInterval(timer);
                target.textContent = `${countValue}${suffix}`;
            }
        }, 40);
        observer.unobserve(target);
    });
}, { threshold: 0.5 });

counters.forEach((counter) => countObserver.observe(counter));

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.scrollY;
    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 80;
        const sectionId = current.getAttribute("id");
        const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
        if (!link) return;

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add("active-link");
        } else {
            link.classList.remove("active-link");
        }
    });
}

window.addEventListener("scroll", scrollActive);
scrollActive();