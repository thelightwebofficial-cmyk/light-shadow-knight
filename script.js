const ORDER_EMAIL = "light162010@gmail.com";

const form = document.getElementById("orderForm");
const statusEl = document.getElementById("formStatus");
const fallbackEl = document.getElementById("formFallback");
const copyBtn = document.getElementById("copyRequest");
const gmailBtn = document.getElementById("gmailRequest");
let latestRequest = null;

function buildRequest() {
  const name = document.getElementById("name")?.value.trim() || "";
  const type = document.getElementById("type")?.value || "Other";
  const details = document.getElementById("details")?.value.trim() || "";
  const budget = document.getElementById("budget")?.value.trim() || "Not specified";
  const subject = `Project request — ${type}`;
  const body = `Hi Light,\n\nMy name: ${name}\nProject type: ${type}\n\nProject details:\n${details}\n\nBudget / range:\n${budget}\n\nSent from the Light Shadow Knight portfolio.`;
  return { name, type, details, budget, subject, body };
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const req = buildRequest();
  if (!req.name || !req.details) return;
  latestRequest = req;
  const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(req.subject)}&body=${encodeURIComponent(req.body)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ORDER_EMAIL)}&su=${encodeURIComponent(req.subject)}&body=${encodeURIComponent(req.body)}`;

  // Copy first so the request is never lost if no desktop mail handler exists.
  navigator.clipboard?.writeText(req.body).catch(() => {});
  if (statusEl) statusEl.textContent = "Request prepared. Opening your email app…";
  if (fallbackEl) fallbackEl.hidden = false;
  if (gmailBtn) gmailBtn.dataset.url = gmail;

  window.location.href = mailto;
  window.setTimeout(() => {
    if (statusEl) statusEl.textContent = "If your email app did not open, use “Copy request” or “Open web mail”.";
  }, 1200);
});

copyBtn?.addEventListener("click", async () => {
  if (!latestRequest) latestRequest = buildRequest();
  try {
    await navigator.clipboard.writeText(latestRequest.body);
    if (statusEl) statusEl.textContent = "Request copied to your clipboard.";
  } catch {
    if (statusEl) statusEl.textContent = "Copy was blocked by the browser. You can use Open web mail instead.";
  }
});

gmailBtn?.addEventListener("click", () => {
  if (!latestRequest) latestRequest = buildRequest();
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ORDER_EMAIL)}&su=${encodeURIComponent(latestRequest.subject)}&body=${encodeURIComponent(latestRequest.body)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));

// Light/dark mode
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("lsk-theme");
if (savedTheme === "light") document.body.classList.add("light");
const syncTheme = () => { if (themeBtn) themeBtn.textContent = document.body.classList.contains("light") ? "☾" : "☼"; };
syncTheme();
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("lsk-theme", document.body.classList.contains("light") ? "light" : "dark");
  syncTheme();
});

// Project quick-view modal
const projectData = {
  nemo:{type:"AI · AGENT SYSTEM · [ IN PROGRESS ]",title:"Nemo Inazuma AI",text:"A modular, from-scratch AI ecosystem designed around specialized tools and agents. The project explores local workflows for coding, writing, images, science, audio, video, security and more.",chips:["Agents","Python","Local AI","R&D"]},
  qiao:{type:"AI · WRITING · [ IN PROGRESS ]",title:"Qiao / Qaio",text:"A custom creative-writing model experiment. The work explores tokenization, language understanding and generation with a focus on building the training stack rather than relying on an external AI service.",chips:["NLP","GPT","BERT","Training"]},
  akari:{type:"AI · IMAGE · [ IN PROGRESS ]",title:"Akari",text:"An image-generation research project exploring a native tokenizer, text encoder, VAE, DiT and scheduler pipeline, including lightweight experimentation for constrained hardware.",chips:["DiT","VAE","Vision","Research"]},
  emi:{type:"WEB · AI · [ IN PROGRESS ]",title:"Emi Website Builder",text:"A website-building agent concept aimed at turning a natural-language idea into a practical HTML, CSS and JavaScript interface.",chips:["HTML","CSS","JavaScript","AI"]}
};
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalText = document.getElementById("modalText");
const modalChips = document.getElementById("modalChips");
const closeModal = () => { modal?.classList.remove("open"); modal?.setAttribute("aria-hidden","true"); document.body.style.overflow=""; };
document.querySelectorAll(".details").forEach(btn => btn.addEventListener("click", () => {
  const p = projectData[btn.dataset.project]; if (!p || !modal) return;
  modalType.textContent = p.type; modalTitle.textContent = p.title; modalText.textContent = p.text;
  modalChips.innerHTML = p.chips.map(x => `<span>${x}</span>`).join("");
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
}));
modal?.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".project,.service-grid article").forEach(card => {
    card.addEventListener("pointermove", e => {
      if (innerWidth < 900) return;
      const r = card.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.8).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });
}

const sections = [...document.querySelectorAll("main section[id],#home")];
const links = [...document.querySelectorAll("#navMenu a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  });
}, { rootMargin:"-45% 0px -45% 0px" });
sections.forEach(s => observer.observe(s));
