document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const revealEls = document.querySelectorAll(".reveal");
  const sectionLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
  const bookingForm = document.getElementById("bookingForm");
  const formNote = document.getElementById("formNote");

  function updateHeaderState() {
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

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const phone = document.getElementById("phone")?.value.trim() || "";
      const service = document.getElementById("service")?.value.trim() || "";
      const vehicle = document.getElementById("vehicle")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";

      const subject = encodeURIComponent("Booking Request - GM Auto Detailing");
      const body = encodeURIComponent(
        `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          `Service: ${service}\n` +
          `Vehicle Type: ${vehicle}\n` +
          `Message: ${message || "N/A"}`
      );

      if (formNote) {
        formNote.textContent = "Opening your email app...";
      }

      window.location.href = `mailto:gmautodetailing23@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        if (formNote) {
          formNote.textContent =
            "If no email window opened, email gmautodetailing23@gmail.com directly.";
        }
      }, 1200);
    });
  }
});
