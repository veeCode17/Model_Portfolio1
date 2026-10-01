/* =========================================
   DOM ELEMENTS
========================================= */

const loader = document.getElementById("loader");
const header = document.getElementById("header");

const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");

const navLinks = document.querySelectorAll(".nav-link");

const revealElements = document.querySelectorAll(".reveal");

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxDescription = document.getElementById("lightboxDescription");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const year = document.getElementById("year");


/* =========================================
   LOADER
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {
        loader.classList.add("hide");
    }, 900);

});


/* =========================================
   CURRENT YEAR
========================================= */

year.textContent = new Date().getFullYear();


/* =========================================
   HEADER SCROLL EFFECT
========================================= */

function updateHeader() {

    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* =========================================
   MOBILE MENU
========================================= */

function closeMenu() {

    nav.classList.remove("open");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");

}


menuToggle.addEventListener("click", () => {

    const isOpen = nav.classList.contains("open");

    if (isOpen) {
        closeMenu();
    } else {

        nav.classList.add("open");

        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");

        document.body.classList.add("menu-open");

    }

});


/* Close menu when navigation link is clicked */

navLinks.forEach(link => {

    link.addEventListener("click", () => {
        closeMenu();
    });

});


/* Close mobile menu when clicking outside */

document.addEventListener("click", event => {

    if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMenu();
    }

});


/* =========================================
   SMOOTH INTERNAL LINKS
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") {
            return;
        }

        const target = document.querySelector(targetID);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    }
);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentID = entry.target.getAttribute("id");

                navLinks.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${currentID}`
                    ) {
                        link.classList.add("active");
                    }

                });

            }

        });

    },
    {
        threshold: 0.25,
        rootMargin: "-15% 0px -60% 0px"
    }
);


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =========================================
   PORTFOLIO FILTER
========================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        galleryItems.forEach(item => {

            const category = item.dataset.category;

            if (
                filter === "all" ||
                category === filter
            ) {

                item.classList.remove("hidden");

                requestAnimationFrame(() => {

                    item.style.opacity = "0";

                    item.style.transform = "translateY(15px)";

                    requestAnimationFrame(() => {

                        item.style.transition =
                            "opacity .45s ease, transform .45s ease";

                        item.style.opacity = "1";

                        item.style.transform = "translateY(0)";

                    });

                });

            } else {

                item.classList.add("hidden");

            }

        });

    });

});


/* =========================================
   LIGHTBOX DATA
========================================= */

let visibleGalleryItems = [];
let currentGalleryIndex = 0;


function updateVisibleItems() {

    visibleGalleryItems = Array.from(galleryItems)
        .filter(item => !item.classList.contains("hidden"));

}


function openLightbox(item) {

    updateVisibleItems();

    currentGalleryIndex =
        visibleGalleryItems.indexOf(item);

    if (currentGalleryIndex === -1) {
        currentGalleryIndex = 0;
    }

    updateLightbox();

    lightbox.classList.add("active");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

}


function updateLightbox() {

    const item =
        visibleGalleryItems[currentGalleryIndex];

    if (!item) {
        return;
    }

    const image = item.querySelector("img");

    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;

    lightboxTitle.textContent =
        item.dataset.title;

    lightboxDescription.textContent =
        item.dataset.description;

    lightboxCategory.textContent =
        item.dataset.category;

}


function closeLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

}


function showNextImage() {

    if (visibleGalleryItems.length === 0) {
        return;
    }

    currentGalleryIndex =
        (currentGalleryIndex + 1) %
        visibleGalleryItems.length;

    updateLightbox();

}


function showPreviousImage() {

    if (visibleGalleryItems.length === 0) {
        return;
    }

    currentGalleryIndex =
        (currentGalleryIndex - 1 +
            visibleGalleryItems.length) %
        visibleGalleryItems.length;

    updateLightbox();

}


/* Open lightbox */

galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        openLightbox(item);

    });

});


/* Close button */

lightboxClose.addEventListener(
    "click",
    closeLightbox
);


/* Previous */

lightboxPrev.addEventListener(
    "click",
    showPreviousImage
);


/* Next */

lightboxNext.addEventListener(
    "click",
    showNextImage
);


/* Click outside image to close */

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


/* Keyboard controls */

document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

});


/* =========================================
   TOUCH SWIPE FOR LIGHTBOX
========================================= */

let touchStartX = 0;
let touchEndX = 0;


lightbox.addEventListener("touchstart", event => {

    touchStartX = event.changedTouches[0].screenX;

});


lightbox.addEventListener("touchend", event => {

    touchEndX = event.changedTouches[0].screenX;

    const difference =
        touchStartX - touchEndX;

    if (Math.abs(difference) < 50) {
        return;
    }

    if (difference > 0) {
        showNextImage();
    } else {
        showPreviousImage();
    }

});


/* =========================================
   CONTACT FORM
========================================= */

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const project =
        document.getElementById("project").value;

    const message =
        document.getElementById("message").value.trim();


    /* Basic validation */

    if (
        name === "" ||
        email === "" ||
        project === "" ||
        message === ""
    ) {

        formStatus.textContent =
            "Please complete all fields.";

        formStatus.style.color = "#a33";

        return;

    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        formStatus.textContent =
            "Please enter a valid email address.";

        formStatus.style.color = "#a33";

        return;

    }


    /*
       Build an email.

       Since this is a frontend-only website,
       there is no backend server.

       mailto opens the visitor's email client.
    */

    const subject =
        encodeURIComponent(
            `Portfolio Inquiry — ${project}`
        );

    const body =
        encodeURIComponent(
`Hello Khushi,

My name is ${name}.

I'm interested in working with you for a ${project} project.

${message}

You can contact me at:
${email}

Thank you.`
        );


    const mailtoURL =
        `mailto:hello@khushimodel.com?subject=${subject}&body=${body}`;


    window.location.href = mailtoURL;


    formStatus.textContent =
        "Opening your email application...";

    formStatus.style.color = "#555";


    showToast(
        "Your inquiry is ready to send."
    );

});


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =========================================
   ESCAPE KEY — MENU
========================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        nav.classList.contains("open")
    ) {

        closeMenu();

    }

});


/* =========================================
   IMAGE FALLBACK
========================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.background =
            "linear-gradient(135deg,#181818,#333)";

        image.removeAttribute("src");

        image.alt = "Portfolio image";

    });

});


/* =========================================
   INITIALIZATION
========================================= */

updateVisibleItems();