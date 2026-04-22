document.addEventListener("DOMContentLoaded", () => {
  const CALENDLY_BASE_URL = "https://calendly.com/ethangrin0/gm-auto-detailing";

  const header = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const revealEls = document.querySelectorAll(".reveal");
  const sectionLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
  const bookingForm = document.getElementById("bookingForm");
  const formNote = document.getElementById("formNote");
  const phoneInput = document.getElementById("phone");

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    const sections = document.querySelectorAll("main section[id]");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          sectionLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      {
        threshold: 0.45,
        rootMargin: "-10% 0px -35% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight : 80;
      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    });
  });

  function digitsOnly(value) {
    return value.replace(/\D/g, "");
  }

  function formatPhoneDisplay(value) {
    const digits = digitsOnly(value).slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  function getFullPhoneNumber() {
    const localDigits = digitsOnly(phoneInput?.value || "").slice(0, 10);
    return localDigits ? `+1${localDigits}` : "";
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatPhoneDisplay(phoneInput.value);
    });

    phoneInput.addEventListener("keydown", (event) => {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End"
      ];

      if (allowedKeys.includes(event.key)) return;
      if (/^\d$/.test(event.key)) return;

      event.preventDefault();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const phone = getFullPhoneNumber();
      const service = document.getElementById("service")?.value.trim() || "";
      const vehicle = document.getElementById("vehicle")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";

      if (!name || !email || !phone || !service || !vehicle) {
        if (formNote) {
          formNote.textContent = "Please fill in all required fields first.";
        }
        return;
      }

      const params = new URLSearchParams({
        name,
        email,
        a1: phone,
        a2: service,
        a3: vehicle,
        a4: message || "N/A"
      });

      if (formNote) {
        formNote.textContent = "Opening booking page...";
      }

      window.location.href = `${CALENDLY_BASE_URL}?${params.toString()}`;
    });
  }
});
