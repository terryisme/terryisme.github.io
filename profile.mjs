const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LINK_ORDER = ["linkedin", "github", "x", "email"];
const LINK_LABELS = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "Twitter / X",
  email: "Email",
};

export function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "TZ";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatMonth(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.toLowerCase() === "present") return "Present";
  const match = /^(\d{4})-(\d{2})$/.exec(raw);
  if (!match) return raw;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return raw;
  return `${month} ${match[1]}`;
}

export function formatDateRange(start, end) {
  const s = String(start || "").trim();
  const e = String(end || "").trim();
  if (!s && !e) return "Dates TBA";
  return `${s ? formatMonth(s) : "TBA"} – ${e ? formatMonth(e) : "TBA"}`;
}

export function visibleLinks(links) {
  const source = links && typeof links === "object" ? links : {};
  return LINK_ORDER.filter((key) => String(source[key] || "").trim()).map((key) => {
    const value = String(source[key]).trim();
    return {
      key,
      label: LINK_LABELS[key],
      href: key === "email" ? `mailto:${value}` : value,
    };
  });
}

export function normalizeTheme(value) {
  return value === "light" ? "light" : "dark";
}
