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

if (themeToggle) {
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
}

if (typeof Typed !== "undefined" && document.querySelector(".typedText")) {
    let typingEffect = new Typed(".typedText", {
        strings: ["AI-driven products", "smart automation", "modern software"],
        loop: true,
        typeSpeed: 90,
        backSpeed: 70,
        backDelay: 1500
    });
}

if (typeof ScrollReveal !== "undefined") {
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
}

const counters = document.querySelectorAll("[data-count]");

if (!('IntersectionObserver' in window)) {
    counters.forEach((counter) => {
        const countValue = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || "";
        counter.textContent = `${countValue}${suffix}`;
    });
} else {
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
}

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

const aiWidget = document.querySelector(".ai-assistant-widget");
const aiToggle = document.querySelector(".ai-toggle");
const aiClose = document.querySelector(".ai-close");
const aiInput = document.querySelector(".ai-input-row input");
const aiSendBtn = document.querySelector(".ai-input-row button");
const aiBody = document.querySelector(".ai-body");

const assistantKnowledge = [
    {
        source: "CV",
        text: "Mebrie Awoke is a 4th-year Information Science student at Addis Ababa University. He is a self-taught software developer with practical experience in backend, web, mobile, and AI-powered applications."
    },
    {
        source: "CV",
        text: "He is experienced with Python, FastAPI, Django, React, React Native, REST APIs, databases, and AI and machine learning technologies."
    },
    {
        source: "CV",
        text: "He is passionate about solving real world problems through technology, learning quickly, and contributing to professional software and AI projects."
    },
    {
        source: "CV",
        text: "His technical skills include Python, JavaScript, TypeScript, SQL, FastAPI, Django, REST APIs, Node.js, React, HTML, CSS, React Native, Expo, PostgreSQL, SQLite, Git, GitHub, Docker, Render, EAS, API integration, authentication, testing, and software design."
    },
    {
        source: "CV",
        text: "He worked as Backend Developer at Mahbere Kidusan from 2024 to present, developing and maintaining backend services, integrating APIs, and working with databases and software requirements."
    },
    {
        source: "CV",
        text: "He also worked as a freelance full stack and mobile developer on Upwork and independent projects, building web and mobile applications with React, React Native, Python, FastAPI, Django, and databases."
    },
    {
        source: "CV",
        text: "At Orient PLC, he contributed to web and mobile development for an e-commerce platform and integrated frontend and backend functionality through APIs."
    },
    {
        source: "CV",
        text: "Selected projects include SmartFarm, a full stack agricultural platform with AI capabilities; RAG Telegram AI Chatbot, built with Retrieval-Augmented Generation and an LLM backend; Ethioguide, a knowledge platform with FastAPI endpoints for articles, categories, search, and health services; and an AI chatbot for Adwa Victory Ethiopia."
    },
    {
        source: "CV",
        text: "He won first place in the AI Workshop at the School of Information Science and is active on GitHub as an open source and software development contributor."
    },
    {
        source: "CV",
        text: "His areas of interest include artificial intelligence, machine learning, backend engineering, full stack development, mobile development, NLP, LLM applications, and software engineering."
    },
    {
        source: "Portfolio",
        text: "Mebrie Awoke is a software developer and AI and machine learning enthusiast. He builds backend, web, mobile, and AI-powered applications for real-world problems."
    },
    {
        source: "Portfolio",
        text: "He is based in Addis Ababa, Ethiopia, and his GitHub is github.com/Mebrie-Awoke."
    },
    {
        source: "Portfolio",
        text: "The portfolio highlights projects such as SmartFarm, the RAG Telegram AI Chatbot, and Ethioguide."
    },
    {
        source: "Portfolio",
        text: "He offers backend development, AI and machine learning applications, and web and mobile app development services."
    },
    {
        source: "Portfolio",
        text: "Contact details include email mebrieawoke941@gmail.com and phone +251 922 5454 47."
    },
    {
        source: "Portfolio",
        text: "He works with Python, FastAPI, Django, React, React Native, SQL, APIs, LLMs, RAG systems, and cloud deployment tools."
    }
];

function normalizeText(value) {
    return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function containsAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
}

function scoreMatch(question, knowledgeText) {
    const query = normalizeText(question);
    const text = normalizeText(knowledgeText);
    if (!query) return 0;

    const queryWords = query.split(" ").filter((word) => word.length > 2);
    const textWords = new Set(text.split(" "));

    let score = 0;
    queryWords.forEach((word) => {
        if (textWords.has(word)) {
            score += 3;
        }
        if (text.includes(word)) {
            score += 1;
        }
    });

    const phraseBonus = [
        "who are you",
        "what are you",
        "who is mebrie",
        "where are you",
        "what is your stack",
        "what skills",
        "what projects",
        "experience",
        "education",
        "contact",
        "email",
        "phone",
        "github",
        "linkedin",
        "ai",
        "machine learning",
        "backend",
        "mobile",
        "project"
    ].find((phrase) => query.includes(phrase) && text.includes(phrase.replace(/ /g, "")));

    if (phraseBonus) score += 4;

    return score;
}

function searchAssistantKnowledge(question) {
    const matches = assistantKnowledge
        .map((item) => ({ ...item, score: scoreMatch(question, item.text) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (!matches.length) {
        return {
            answer: "I could not find a direct match in the portfolio or CV, but I can help with software, AI, backend, web, and mobile development topics. Try asking about my skills, projects, experience, education, or contact details.",
            source: "Portfolio + CV"
        };
    }

    const best = matches[0];
    let answer = best.text;

    if (containsAny(normalizeText(question), ["who", "about"])) {
        answer = "Mebrie Awoke is a 4th-year Information Science student at Addis Ababa University and a self-taught software developer with experience building backend, web, mobile, and AI-powered applications.";
    }

    if (containsAny(normalizeText(question), ["skill", "stack", "technology", "tech"])) {
        answer = "His core skills include Python, JavaScript, TypeScript, SQL, FastAPI, Django, REST APIs, React, React Native, PostgreSQL, SQLite, Git, GitHub, Docker, and AI/ML tools such as NLP, RAG, and LLM integration.";
    }

    if (containsAny(normalizeText(question), ["project"])) {
        answer = "Selected projects include SmartFarm, the RAG Telegram AI Chatbot, Ethioguide, and an AI chatbot for Adwa Victory, Ethiopia. These projects demonstrate his work in AI, backend systems, and knowledge platforms.";
    }

    if (containsAny(normalizeText(question), ["experience", "work"])) {
        answer = "He has worked as a Backend Developer at Mahbere Kidusan, as a freelance Full-Stack and Mobile Developer, and as a Website and Mobile Application Developer at Orient PLC.";
    }

    if (containsAny(normalizeText(question), ["education", "university"])) {
        answer = "He is a 4th-year Information Science student at Addis Ababa University.";
    }

    if (containsAny(normalizeText(question), ["contact", "email", "phone", "github", "location"])) {
        answer = "He is based in Addis Ababa, Ethiopia. His GitHub is github.com/Mebrie-Awoke, email is mebrieawoke941@gmail.com, and phone number is +251 922 5454 47.";
    }

    return {
        answer: `${answer} (Source: ${best.source})`,
        source: best.source
    };
}

function addAssistantMessage(message, type) {
    if (!aiBody) return;

    const bubble = document.createElement("div");
    bubble.className = `ai-message ai-message-${type}`;
    bubble.textContent = message;
    aiBody.appendChild(bubble);
    aiBody.scrollTop = aiBody.scrollHeight;
}

function handleAssistantQuestion() {
    if (!aiInput || !aiSendBtn) return;

    const question = aiInput.value.trim();
    if (!question) return;

    addAssistantMessage(question, "user");
    aiInput.value = "";

    const response = searchAssistantKnowledge(question);
    setTimeout(() => {
        addAssistantMessage(response.answer, "bot");
    }, 350);
}

if (aiToggle && aiWidget) {
    aiToggle.addEventListener("click", () => {
        aiWidget.classList.toggle("open");
        if (aiWidget.classList.contains("open") && aiInput) {
            setTimeout(() => aiInput.focus(), 100);
        }
    });
}

if (aiClose && aiWidget) {
    aiClose.addEventListener("click", () => {
        aiWidget.classList.remove("open");
    });
}

if (aiSendBtn) {
    aiSendBtn.addEventListener("click", handleAssistantQuestion);
}

if (aiInput) {
    aiInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleAssistantQuestion();
        }
    });
}
