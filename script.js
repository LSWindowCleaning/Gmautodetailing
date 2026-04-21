const header = document.querySelector(".site-header");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const conciergeBar = document.getElementById("conciergeBar");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function handleScrollState() {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (window.scrollY > 600) {
    conciergeBar.classList.add("visible");
  } else {
    conciergeBar.classList.remove("visible");
  }
}

handleScrollState();
window.addEventListener("scroll", handleScrollState);

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
    });
  });
}

const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

function setupBeforeAfterSlider(slider) {
  const beforeWrap = slider.querySelector(".ba-before-wrap");
  const divider = slider.querySelector(".ba-divider");
  const handle = slider.querySelector(".ba-handle");
  let dragging = false;

  const updatePosition = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;

    beforeWrap.style.width = `${percent}%`;
    divider.style.left = `${percent}%`;
  };

  const startDrag = (e) => {
    dragging = true;
    e.preventDefault();
  };

  const stopDrag = () => {
    dragging = false;
  };

  const onMove = (e) => {
    if (!dragging) return;
    updatePosition(e.clientX);
  };

  const onTouchMove = (e) => {
    updatePosition(e.touches[0].clientX);
  };

  slider.addEventListener("mousedown", startDrag);
  handle.addEventListener("mousedown", startDrag);

  window.addEventListener("mouseup", stopDrag);
  slider.addEventListener("mouseleave", stopDrag);
  slider.addEventListener("mousemove", onMove);

  slider.addEventListener("touchstart", () => {
    dragging = true;
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    onTouchMove(e);
  }, { passive: true });

  window.addEventListener("touchend", stopDrag);
}

document.querySelectorAll("[data-slider]").forEach(setupBeforeAfterSlider);
