import {
  formatDateRange,
  initialsFromName,
  normalizeTheme,
  visibleLinks,
} from "./profile.mjs";

const THEME_KEY = "theme";

function $(id) {
  return document.getElementById(id);
}

function applyTheme(theme) {
  const next = normalizeTheme(theme);
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
}

function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY));
  $("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === "light" ? "dark" : "light");
  });
}

const LINK_ICONS = {
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 9H4V20h2.5V9zm.2-3.7A1.6 1.6 0 1 1 4.6 3.7a1.6 1.6 0 0 1 2.1 1.6zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1.1V20H11V9h2.4v1.5c.5-.8 1.5-1.8 3.5-1.8 2.5 0 4.1 1.6 4.1 5.1V20z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.7 3h2.8l-6.1 7L21 21h-5.5l-4.3-5.6L6.3 21H3.5l6.6-7.5L3 3h5.6l3.9 5.2L16.7 3zm-1 16.2h1.6L8.4 4.7H6.7l9 14.5z"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm8 6.5L4.8 7.4h14.4L12 12.5zm0 1.8 7.2-5.2V17H4.8V9.1L12 14.3z"/></svg>',
};

function renderLinks(target, links) {
  target.replaceChildren();
  for (const link of links) {
    const a = document.createElement("a");
    a.href = link.href;
    a.setAttribute("aria-label", link.label);
    a.title = link.label;
    a.innerHTML = LINK_ICONS[link.key] || "";
    if (link.key !== "email") a.rel = "noreferrer";
    target.append(a);
  }
}

function renderAvatar(profile) {
  const img = $("avatar");
  const fallback = $("avatar-fallback");
  const initials = initialsFromName(profile.name);
  fallback.textContent = initials;
  img.alt = profile.name || "Profile photo";
  img.addEventListener("error", () => {
    img.hidden = true;
    fallback.hidden = false;
  });
  if (profile.avatar) img.src = profile.avatar;
}

function jobMeta(item) {
  const parts = [formatDateRange(item.start, item.end)];
  if (String(item.location || "").trim()) parts.push(item.location.trim());
  return parts.join(" · ");
}

function renderExperience(items) {
  const root = $("career-list");
  root.replaceChildren();
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "card";
    const title = document.createElement("h3");
    title.textContent = `${item.role} · ${item.company}`;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = jobMeta(item);
    card.append(title, meta);
    if (Array.isArray(item.highlights) && item.highlights.length) {
      const list = document.createElement("ul");
      for (const highlight of item.highlights) {
        const li = document.createElement("li");
        li.textContent = highlight;
        list.append(li);
      }
      card.append(list);
    }
    root.append(card);
  }
}

function renderEducation(items) {
  const root = $("education-list");
  root.replaceChildren();
  for (const item of items) {
    const card = document.createElement("article");
    card.className = "card";
    const title = document.createElement("h3");
    title.textContent = item.degree;
    const school = document.createElement("p");
    school.className = "meta";
    school.textContent = `${item.school} · ${formatDateRange(item.start, item.end)}`;
    card.append(title, school);
    root.append(card);
  }
}

function renderNote(note) {
  const root = $("note");
  const heading = $("note-heading");
  const body = $("note-body");
  const source = note && typeof note === "object" ? note : {};
  const title = String(source.heading || "").trim();
  const paragraphs = Array.isArray(source.paragraphs)
    ? source.paragraphs.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  if (!title && paragraphs.length === 0) {
    root.hidden = true;
    return;
  }
  root.hidden = false;
  heading.textContent = title;
  heading.hidden = !title;
  body.replaceChildren();
  for (const [index, text] of paragraphs.entries()) {
    const p = document.createElement("p");
    p.textContent = text;
    if (index === paragraphs.length - 1) p.className = "note-close";
    body.append(p);
  }
}

function renderProfile(data) {
  const profile = data.profile || {};
  const links = visibleLinks(data.links);
  $("brand").textContent = profile.name || "Terry Zhang";
  $("profile-name").textContent = profile.name || "Terry Zhang";
  $("profile-title").textContent = profile.title || "";
  $("profile-tagline").textContent = profile.tagline || "";
  $("profile-bio").textContent = profile.bio || "";
  document.title = profile.name
    ? `${profile.name} — ${profile.title || ""}`.replace(/\s+—\s+$/, "")
    : document.title;
  renderAvatar(profile);
  renderLinks($("hero-links"), links);
  renderNote(data.note);
  renderExperience(Array.isArray(data.experience) ? data.experience : []);
  renderEducation(Array.isArray(data.education) ? data.education : []);
}

function showLoadError() {
  $("career-list").replaceChildren();
  const error = document.createElement("p");
  error.className = "load-error";
  error.textContent = "Profile data failed to load.";
  $("career-list").append(error);
}

async function loadProfile() {
  try {
    const response = await fetch("./content.json", { cache: "no-store" });
    if (!response.ok) throw new Error("bad status");
    const data = await response.json();
    renderProfile(data);
  } catch {
    showLoadError();
  }
}

initTheme();
loadProfile();
