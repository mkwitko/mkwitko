// Contact sheet: strips per product family, loupe on hover, print dialog on click.
(async () => {
  const data = await (await fetch("data.json")).json();
  const strips = document.getElementById("strips");
  const flat = []; // every exposed frame in sheet order, for prev/next

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const greasePath = (w, h) => {
    // hand-drawn ellipse, slightly open, like a chinagraph mark on the sheet
    const cx = w / 2, cy = h / 2, rx = w / 2 + 6, ry = h / 2 + 10;
    let d = "";
    for (let i = 0; i <= 345; i += 15) {
      const a = (i * Math.PI) / 180;
      const wob = 1 + 0.02 * Math.sin(a * 3.1 + 0.6) + 0.012 * Math.cos(a * 5.3);
      const x = cx + rx * wob * Math.cos(a), y = cy + ry * wob * Math.sin(a);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  };

  for (const fam of data.families) {
    const strip = el("section", "strip");
    strip.setAttribute("aria-labelledby", "fam-" + fam.id);
    const head = el("div", "strip-head");
    const h = el("h2", "edge", fam.label); h.id = "fam-" + fam.id;
    head.append(h, el("p", "blurb", fam.blurb));
    const row = el("div", "frames");
    for (const repo of fam.repos) {
      repo.frames.forEach((f, i) => {
        const b = el("button", "frame" + (repo.lead && i === 0 ? " lead" : ""));
        b.type = "button";
        b.setAttribute("aria-label", `Frame ${f.n}: ${repo.name}, ${f.caption}. Open the print.`);
        const pic = el("span", "pic");
        const img = new Image();
        img.src = f.thumb; img.alt = ""; img.loading = "lazy"; img.decoding = "async"; img.width = 480; img.height = 300;
        pic.append(img);
        if (repo.lead && i === 0) {
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("class", "grease"); svg.setAttribute("viewBox", "0 0 100 72"); svg.setAttribute("preserveAspectRatio", "none");
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", greasePath(100, 62)); p.setAttribute("vector-effect", "non-scaling-stroke");
          svg.append(p); b.append(svg);
        }
        const lab = el("span", "lab");
        lab.append(el("span", "num", "▸" + f.n), el("span", "code", repo.name));
        b.prepend(pic); b.append(lab);
        const entry = { repo, fam, frame: f, button: b };
        flat.push(entry);
        b.addEventListener("click", () => openPrint(flat.indexOf(entry)));
        b.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && loupeOn(entry));
        b.addEventListener("pointermove", (e) => e.pointerType === "mouse" && loupeMove(e, entry));
        b.addEventListener("pointerleave", loupeOff);
        row.append(b);
      });
    }
    const also = data.unexposed.filter((u) => u.family === fam.id);
    if (also.length) {
      const p = el("p", "also");
      p.append(document.createTextNode("also in this family: "));
      also.forEach((u, i) => {
        const a = el("a", null, u.name);
        a.href = "https://github.com/mkwitko/" + u.name;
        a.title = u.kind.toLowerCase() + " repository, no screen capture";
        p.append(a, document.createTextNode(i < also.length - 1 ? " · " : ""));
      });
      strip.append(head, row, p);
    } else {
      strip.append(head, row);
    }
    strips.append(strip);
  }

  const tools = document.getElementById("tools");
  for (const t of data.tools) {
    const li = el("li");
    const a = el("a", null, t.name); a.href = "https://github.com/mkwitko/" + t.name;
    li.append(a, document.createTextNode(" — " + t.what));
    tools.append(li);
  }

  // ---- loupe -------------------------------------------------------------
  const loupe = document.getElementById("loupe");
  const glass = loupe.querySelector(".loupe-glass img");
  const lnum = loupe.querySelector(".num"), ltxt = loupe.querySelector(".txt");
  let active = null;
  function loupeOn(entry) {
    active = entry;
    glass.src = entry.frame.print;
    lnum.textContent = "▸" + entry.frame.n;
    ltxt.textContent = entry.repo.what;
    loupe.classList.add("on");
  }
  function loupeMove(e, entry) {
    if (active !== entry) return;
    const r = entry.button.querySelector(".pic").getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    // the glass shows the print at 360px wide; pan so the pointer's spot is centred
    const scale = 360 / 1600;
    const ph = entry.frame.h * scale; // print height inside the glass at this width
    const gw = 360, gh = 225;
    // zoom factor 2.2 relative to the glass width
    const z = 2.2;
    glass.style.width = gw * z + "px";
    const tx = -(fx * gw * z - gw / 2), ty = -(fy * ph * z - gh / 2);
    glass.style.transform = `translate(${Math.min(0, Math.max(gw - gw * z, tx))}px, ${Math.min(0, Math.max(gh - ph * z, ty))}px)`;
    // keep the loupe inside the viewport
    const lw = 360, lh = 300;
    const x = Math.min(window.innerWidth - lw / 2 - 12, Math.max(lw / 2 + 12, e.clientX + 40 + lw / 2));
    const y = Math.min(window.innerHeight - lh / 2 - 12, Math.max(lh / 2 + 12, e.clientY));
    loupe.style.left = x + "px"; loupe.style.top = y + "px";
  }
  function loupeOff() { active = null; loupe.classList.remove("on"); }

  // ---- print dialog --------------------------------------------------------
  const dlg = document.getElementById("print");
  const pimg = dlg.querySelector("figure img");
  const q = (s) => dlg.querySelector(s);
  let current = -1;
  function openPrint(i) {
    current = (i + flat.length) % flat.length;
    const { repo, fam, frame } = flat[current];
    loupeOff();
    pimg.src = frame.print; pimg.width = frame.w; pimg.height = frame.h;
    pimg.alt = `${repo.name}: ${frame.caption}`;
    q("figcaption .num").textContent = "▸" + frame.n;
    q("figcaption .cap").textContent = frame.caption + " · fictitious seed data";
    q(".fam").textContent = fam.label;
    q("#print-title").textContent = repo.name;
    q(".what").textContent = repo.what;
    q(".stack").textContent = repo.stack;
    q(".decision").textContent = repo.decision;
    const links = q(".links"); links.replaceChildren();
    const main = el("a", "main", repo.name + " ↗"); main.href = repo.url; main.target = "_blank"; main.rel = "noopener";
    links.append(main);
    for (const s of [repo.api, ...(repo.siblings || [])].filter(Boolean)) {
      const a = el("a", null, s + " ↗"); a.href = "https://github.com/mkwitko/" + s; a.target = "_blank"; a.rel = "noopener";
      links.append(a);
    }
    if (!dlg.open) dlg.showModal();
    q(".note").scrollTop = 0;
  }
  q(".prev").addEventListener("click", () => openPrint(current - 1));
  q(".next").addEventListener("click", () => openPrint(current + 1));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") openPrint(current - 1);
    if (e.key === "ArrowRight") openPrint(current + 1);
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (current >= 0) flat[current].button.focus(); });
})();
