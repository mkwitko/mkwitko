"use strict";
document.getElementById("year").textContent = String(new Date().getFullYear());

const filters = Array.from(document.querySelectorAll("[data-filter]"));
const cards = Array.from(document.querySelectorAll(".project-card[data-tags]"));
const status = document.getElementById("filter-status");

for (const control of filters) {
  control.addEventListener("click", () => {
    const selected = control.dataset.filter;
    let visible = 0;
    for (const filter of filters) {
      const active = filter === control;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    }
    for (const card of cards) {
      const show = selected === "all" || (card.dataset.tags || "").split(/\s+/).includes(selected);
      card.hidden = !show;
      if (show) visible++;
    }
    status.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}.`;
  });
}
