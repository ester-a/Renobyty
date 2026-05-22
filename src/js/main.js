import "../css/main.css";

if (window.lucide?.createIcons) {
  window.lucide.createIcons();
}

const navInstances = document.querySelectorAll("[data-nav]");
const filterGroups = document.querySelectorAll("[data-filter-group]");
const revealGroups = [...document.querySelectorAll("[data-reveal-group]")];
const groupedRevealItems = new Set();
const revealTargets = new Map();

revealGroups.forEach((group) => {
  const rows = new Map();
  const groupItems = [...group.querySelectorAll(".reveal-on-scroll")];

  groupItems.forEach((item) => {
    groupedRevealItems.add(item);

    const row = item.dataset.revealRow || "all";
    const rowItems = rows.get(row) || [];

    rowItems.push(item);
    rows.set(row, rowItems);
  });

  rows.forEach((items) => {
    revealTargets.set(items[0], items);
  });
});

const revealItems = [...document.querySelectorAll(".reveal-on-scroll")].filter(
  (item) => !groupedRevealItems.has(item),
);
const allRevealItems = document.querySelectorAll(".reveal-on-scroll");

revealItems.forEach((item) => {
  revealTargets.set(item, [item]);
});

if (allRevealItems.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    allRevealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const items = revealTargets.get(entry.target) || [entry.target];

          items.forEach((item) => {
            item.classList.add("is-visible");
          });
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealTargets.forEach((items, target) => {
      if (items.length) {
        revealObserver.observe(target);
      }
    });
  }
}

navInstances.forEach((nav) => {
  const toggle = nav.querySelector("[data-nav-toggle]");
  const panel = nav.querySelector("[data-nav-panel]");
  const links = nav.querySelectorAll("[data-nav-close]");

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.add("hidden");
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.remove("hidden");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
});

filterGroups.forEach((group) => {
  const buttons = [...group.querySelectorAll("[data-filter]")];
  const items = [...document.querySelectorAll("[data-filter-item]")];

  if (!buttons.length || !items.length) {
    return;
  }

  const setActiveFilter = (value) => {
    buttons.forEach((button) => {
      button.dataset.active = String(button.dataset.filter === value);
      button.setAttribute("aria-pressed", String(button.dataset.filter === value));
    });

    items.forEach((item) => {
      const categories = item.dataset.categories?.split(" ") ?? [];
      const shouldShow = value === "all" || categories.includes(value);

      item.classList.toggle("hidden", !shouldShow);
    });
  };

  const initialFilter =
    buttons.find((button) => button.dataset.active === "true")?.dataset.filter || "all";

  setActiveFilter(initialFilter);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveFilter(button.dataset.filter || "all");
    });
  });
});
